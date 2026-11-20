import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import LightFibres from "./LightFibres";

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeOut = (t) => 1 - Math.pow(1 - clamp01(t), 3);

const BOARD = 2.6; // circuit board size
const BOARD_H = 0.12;
const DIE = 1.06; // processor core size
const DIE_H = 0.16;
const LID = 1.78; // glass top size
const COLORS = ["#8fd3ff", "#b79cff", "#ff9ccf", "#ffc48a", "#f2f0ec"];

/** small seeded random, so the circuit looks the same on every visit */
function seeded(seed) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

/**
 * The circuit, drawn once onto a canvas: traces run in from every edge with 45° bends and
 * end on a pad at the core's footprint, which is covered in a grid of contact pads.
 */
function circuitTexture() {
  const S = 1024;
  const C = S / 2;
  const core = S * (DIE / BOARD) * 0.5; // half-size of the core's footprint, in pixels
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = S;
  const g = canvas.getContext("2d");
  const rnd = seeded(20261120);
  g.fillStyle = "#000";
  g.fillRect(0, 0, S, S);
  g.lineCap = "round";
  g.lineJoin = "round";

  const inside = (x, y) => Math.abs(x - C) < core && Math.abs(y - C) < core;
  for (let i = 0; i < 170; i++) {
    const side = i % 4;
    const t = 0.05 + rnd() * 0.9;
    let [x, y, dx, dy] =
      side === 0 ? [t * S, 16, 0, 1] : side === 1 ? [S - 16, t * S, -1, 0] : side === 2 ? [t * S, S - 16, 0, -1] : [16, t * S, 1, 0];
    const color = COLORS[i % COLORS.length];
    g.strokeStyle = color;
    g.fillStyle = color;
    g.globalAlpha = 0.45 + rnd() * 0.55;
    g.lineWidth = 2 + rnd() * 2.5;
    g.beginPath();
    g.moveTo(x, y);
    for (let step = 0; step < 8; step++) {
      const len = 30 + rnd() * 110;
      const nx = x + dx * len;
      const ny = y + dy * len;
      if (inside(nx, ny)) {
        // stop exactly on the edge of the core's footprint
        if (dx) x = C - dx * core;
        else y = C - dy * core;
        g.lineTo(x, y);
        break;
      }
      x = nx;
      y = ny;
      g.lineTo(x, y);
      // now and then a 45° jog toward the centre, like real board routing
      if (rnd() < 0.5) {
        const jog = 16 + rnd() * 56;
        if (dx === 0) x += Math.sign(C - x) * jog;
        else y += Math.sign(C - y) * jog;
        x += dx * jog;
        y += dy * jog;
        if (inside(x, y)) break;
        g.lineTo(x, y);
      }
    }
    g.stroke();
    g.beginPath();
    g.arc(x, y, 3.5 + rnd() * 3, 0, Math.PI * 2);
    g.fill();
  }

  // contact pads under the core
  g.globalAlpha = 0.85;
  g.fillStyle = "#b79cff";
  for (let a = -core + 16; a < core - 8; a += 26) {
    for (let b = -core + 16; b < core - 8; b += 26) g.fillRect(C + a - 3, C + b - 3, 6, 6);
  }
  // a fine border just inside the board edge
  g.globalAlpha = 0.5;
  g.strokeStyle = "#8fd3ff";
  g.lineWidth = 2;
  g.strokeRect(8, 8, S - 16, S - 16);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/** faint etched markings on top of the core: a floorplan of blocks and a model name */
function markingTexture() {
  const S = 512;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = S;
  const g = canvas.getContext("2d");
  const rnd = seeded(77);
  g.fillStyle = "#000";
  g.fillRect(0, 0, S, S);
  g.strokeStyle = "#b79cff";
  g.globalAlpha = 0.6;
  g.lineWidth = 2;
  g.strokeRect(28, 28, S - 56, S - 56);
  // floorplan: a few blocks of different sizes
  g.globalAlpha = 0.35;
  g.lineWidth = 1.5;
  for (let i = 0; i < 14; i++) {
    const w = 40 + rnd() * 120;
    const h = 30 + rnd() * 90;
    g.strokeStyle = COLORS[i % 4];
    g.strokeRect(50 + rnd() * (S - 140 - w), 50 + rnd() * (S - 190 - h), w, h);
  }
  g.globalAlpha = 0.8;
  g.fillStyle = "#f2f0ec";
  g.font = "700 30px system-ui, sans-serif";
  g.letterSpacing = "8px";
  g.fillText("UDVOY IT", 50, S - 70);
  g.globalAlpha = 0.5;
  g.font = "400 18px ui-monospace, monospace";
  g.letterSpacing = "4px";
  g.fillText("UDV-01  ·  2026", 52, S - 44);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** glowing links that carry pulses up from the board into the core (instanced: one draw call) */
const LINK_VERTEX = /* glsl */ `
attribute float aOffset;
varying float vH;
varying float vOffset;
void main() {
  vH = uv.y;
  vOffset = aOffset;
  gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
}
`;
const LINK_FRAGMENT = /* glsl */ `
uniform float uTime;
uniform float uIntro;
uniform vec3 uColor;
varying float vH;
varying float vOffset;
void main() {
  float pulse = pow(smoothstep(0.7, 1.0, fract(vH * 0.8 - uTime * 0.55 + vOffset)), 2.0);
  float a = (0.22 + pulse * 1.6) * uIntro;
  gl_FragColor = vec4(uColor * a, a);
}
`;

/** data cables that plug into the board's edges (board coordinates); they all come in from
 *  behind, so on screen they rise away from the chip instead of crossing the hero's text */
const CABLES = [
  { color: "#8fd3ff", points: [[-4.4, -0.1, -1.9], [-2.9, 0.0, -1.0], [-1.75, 0.02, -0.4], [-1.31, 0.03, -0.3]], offset: 0 },
  { color: "#ff9ccf", points: [[-0.7, 0.1, -4.4], [-0.45, 0.04, -2.9], [-0.25, 0.02, -1.75], [-0.2, 0.03, -1.31]], offset: 0.37 },
  { color: "#ffc48a", points: [[4.3, -0.1, -1.6], [2.8, 0.0, -0.95], [1.7, 0.02, -0.55], [1.31, 0.03, -0.45]], offset: 0.71 },
];

/**
 * An exploded-view processor: circuit board with pins, iridescent chrome core and a glass
 * top, floating apart in layers. Data pulses run along the traces into the core and up the
 * links between the layers. The layers assemble on load, breathe while idle, spread when the
 * cursor moves and fly further apart as the hero scrolls away.
 */
export default function ChipCore({ motion, quality }) {
  const high = quality === "high";
  const board = useRef(null);
  const core = useRef(null);
  const lid = useRef(null);
  const links = useRef(null);

  const parts = useMemo(() => {
    const circuit = circuitTexture();
    const marking = markingTexture();

    const uniforms = { uTime: { value: 0 }, uIntro: { value: 0 } };
    // the board: dark glossy solder mask, traces glowing in waves that travel to the core
    const boardTop = new THREE.MeshPhysicalMaterial({
      color: "#ffffff",
      map: circuit,
      emissive: "#ffffff",
      emissiveMap: circuit,
      emissiveIntensity: 1.25,
      roughness: 0.3,
      metalness: 0.2,
      envMapIntensity: 0.6,
    });
    boardTop.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, uniforms);
      shader.fragmentShader = shader.fragmentShader
        .replace("#include <common>", "#include <common>\nuniform float uTime;\nuniform float uIntro;")
        .replace(
          "#include <emissivemap_fragment>",
          `#include <emissivemap_fragment>
          // square waves moving in from the edges to the core: data flowing into the processor
          vec2 q = abs(vEmissiveMapUv - 0.5);
          float d = max(q.x, q.y);
          float wave = pow(0.5 + 0.5 * sin(d * 46.0 + uTime * 2.4), 7.0);
          totalEmissiveRadiance *= (0.22 + 1.9 * wave) * uIntro;`,
        );
    };
    boardTop.customProgramCacheKey = () => "udvoy-chip-board";
    // dim the base colour so the traces read as copper on a dark board when they aren't lit
    boardTop.color.setScalar(0.18);

    const boardBody = new THREE.MeshPhysicalMaterial({ color: "#0e0c18", roughness: 0.32, metalness: 0.3, envMapIntensity: 0.7 });
    const chrome = new THREE.MeshPhysicalMaterial({
      color: "#e9e6f2",
      metalness: 1,
      roughness: 0.18,
      iridescence: 1,
      iridescenceIOR: 1.55,
      iridescenceThicknessMinimum: 240,
      iridescenceThicknessMaximum: 820,
      envMapIntensity: 1.35,
    });
    const pinMetal = new THREE.MeshStandardMaterial({ color: "#eadccb", metalness: 1, roughness: 0.28, envMapIntensity: 1.2 });
    const etch = new THREE.MeshBasicMaterial({
      map: marking,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const glass = new THREE.MeshPhysicalMaterial({
      transmission: 1,
      roughness: 0.03,
      specularIntensity: 0.8,
      envMapIntensity: 0.55,
      ior: 1.5,
      thickness: 0.6,
      dispersion: 5,
      attenuationColor: new THREE.Color("#d9ccff"),
      attenuationDistance: 3,
    });
    const link = new THREE.ShaderMaterial({
      vertexShader: LINK_VERTEX,
      fragmentShader: LINK_FRAGMENT,
      uniforms: { uTime: { value: 0 }, uIntro: { value: 0 }, uColor: { value: new THREE.Color("#c9b8ff") } },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    // pins along all four edges, sticking out of the board (instanced: one draw call)
    const perSide = high ? 14 : 10;
    const pinGeo = new THREE.BoxGeometry(0.05, 0.03, 0.17);
    const pins = new THREE.InstancedMesh(pinGeo, pinMetal, perSide * 4);
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const up = new THREE.Vector3(0, 1, 0);
    let k = 0;
    for (let side = 0; side < 4; side++) {
      q.setFromAxisAngle(up, (side * Math.PI) / 2);
      for (let i = 0; i < perSide; i++) {
        const along = (i / (perSide - 1) - 0.5) * (BOARD - 0.5);
        const p = new THREE.Vector3(along, -0.02, BOARD / 2 + 0.07).applyQuaternion(q);
        m.compose(p, q, new THREE.Vector3(1, 1, 1));
        pins.setMatrixAt(k++, m);
      }
    }

    // vertical links around the core's footprint, from the board up into the core
    const linkGeo = new THREE.CylinderGeometry(0.008, 0.008, 1, 6, 1, true).translate(0, 0.5, 0);
    const linkCount = 12;
    const offsets = new Float32Array(linkCount);
    const linkMesh = new THREE.InstancedMesh(linkGeo, link, linkCount);
    for (let i = 0; i < linkCount; i++) {
      const a = (i / linkCount) * Math.PI * 2 + 0.2;
      const r = DIE * 0.42;
      m.makeTranslation(Math.cos(a) * r * 1.05, 0, Math.sin(a) * r * 1.05);
      linkMesh.setMatrixAt(i, m);
      offsets[i] = i / linkCount;
    }
    linkGeo.setAttribute("aOffset", new THREE.InstancedBufferAttribute(offsets, 1));
    linkMesh.frustumCulled = false;

    return { circuit, marking, uniforms, boardTop, boardBody, chrome, etch, glass, link, pins, pinGeo, linkMesh, linkGeo };
  }, [high]);

  useEffect(
    () => () => {
      const { circuit, marking, boardTop, boardBody, chrome, etch, glass, link, pinGeo, linkGeo, pins, linkMesh } = parts;
      [circuit, marking, boardTop, boardBody, chrome, etch, glass, link, pinGeo, linkGeo].forEach((x) => x.dispose());
      pins.dispose();
      linkMesh.dispose();
    },
    [parts],
  );

  useFrame(() => {
    const { time, px, py, intro, scroll } = motion;
    // staggered assembly: board rises, core drops in, glass settles on top
    const a = easeOut(intro / 0.7);
    const b = easeOut((intro - 0.15) / 0.7);
    const c = easeOut((intro - 0.3) / 0.7);
    // the gap between layers breathes, opens up when the cursor moves away from centre,
    // and grows as the hero scrolls away (the exploded view gets more exploded)
    const spread = 1 + scroll * 1.6 + Math.min(1, Math.hypot(px, py)) * 0.18;
    const gap = 0.48 * spread + Math.sin(time * 0.7) * 0.035;

    if (board.current) {
      board.current.position.y = -gap - (1 - a) * 1.8;
      board.current.rotation.y = (1 - a) * -0.8;
      board.current.scale.setScalar(0.6 + 0.4 * a);
    }
    if (core.current) {
      core.current.position.set(px * 0.05, (1 - b) * 2.2, -py * 0.05);
      core.current.rotation.y = (1 - b) * 0.9 + Math.sin(time * 0.3) * 0.03;
      core.current.scale.setScalar(0.6 + 0.4 * b);
    }
    if (lid.current) {
      lid.current.position.set(px * 0.12, gap * 0.95 + (1 - c) * 3, -py * 0.12);
      lid.current.rotation.y = (1 - c) * -1.1 + Math.sin(time * 0.25 + 1) * 0.04;
      lid.current.scale.setScalar(0.6 + 0.4 * c);
    }
    // the links stretch from the board's surface to the bottom of the core
    if (links.current && board.current && core.current) {
      const from = board.current.position.y + (BOARD_H / 2) * board.current.scale.y;
      const to = core.current.position.y - (DIE_H / 2) * core.current.scale.y;
      links.current.position.y = from;
      links.current.scale.y = Math.max(0.001, to - from);
    }

    parts.uniforms.uTime.value = time;
    parts.uniforms.uIntro.value = a;
    parts.link.uniforms.uTime.value = time;
    parts.link.uniforms.uIntro.value = Math.min(a, b);
    parts.etch.opacity = b * 0.9;
  });

  return (
    <group>
      <group ref={board}>
        <RoundedBox args={[BOARD, BOARD_H, BOARD]} radius={0.035} smoothness={3} material={parts.boardBody} />
        {/* the circuit sits on top of the board, inset from the rounded edge */}
        <mesh material={parts.boardTop} position-y={BOARD_H / 2 + 0.001} rotation-x={-Math.PI / 2}>
          <planeGeometry args={[BOARD - 0.08, BOARD - 0.08]} />
        </mesh>
        <primitive object={parts.pins} />
        <LightFibres motion={motion} fibres={CABLES} />
      </group>

      <primitive ref={links} object={parts.linkMesh} />

      <group ref={core}>
        <RoundedBox args={[DIE, DIE_H, DIE]} radius={0.03} smoothness={3} material={parts.chrome} />
        <mesh material={parts.etch} position-y={DIE_H / 2 + 0.002} rotation-x={-Math.PI / 2}>
          <planeGeometry args={[DIE - 0.06, DIE - 0.06]} />
        </mesh>
      </group>

      {high && (
        <group ref={lid}>
          <RoundedBox args={[LID, 0.08, LID]} radius={0.03} smoothness={3} material={parts.glass} />
        </group>
      )}
    </group>
  );
}
