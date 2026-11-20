import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import * as THREE from "three";

const PALETTE = ["#8fd3ff", "#b79cff", "#ff9ccf", "#ffc48a", "#f2f0ec"];

const vertexShader = /* glsl */ `
attribute float aSeed;
attribute vec3 aColor;
uniform float uTime;
uniform float uPixelRatio;
uniform float uIntro;
varying vec3 vColor;
varying float vAlpha;
void main() {
  vec3 p = position;
  // each mote drifts on its own slow loop
  p.x += sin(uTime * 0.11 + aSeed * 6.28) * 0.18;
  p.y += mod(uTime * 0.035 * (0.4 + aSeed) + aSeed * 5.0, 4.0) - 2.0;
  p.z += cos(uTime * 0.09 + aSeed * 12.0) * 0.18;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = (1.6 + aSeed * 3.2) * uPixelRatio * (6.0 / -mv.z);
  vColor = aColor;
  // twinkle, fade in with the entrance, fade out at the top and bottom of the loop
  float edge = smoothstep(2.0, 1.4, abs(p.y));
  vAlpha = (0.25 + 0.75 * (0.5 + 0.5 * sin(uTime * (0.6 + aSeed) + aSeed * 40.0))) * uIntro * edge;
}
`;

const fragmentShader = /* glsl */ `
varying vec3 vColor;
varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d) * vAlpha * 0.85;
  gl_FragColor = vec4(vColor * a, a);
}
`;

/** Fine atmospheric dust in the brand colours, drifting through the scene. */
export default function Dust({ motion, quality }) {
  const count = quality === "high" ? 700 : 260;
  const dpr = useThree((s) => s.viewport.dpr);

  const { geometry, material } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    const col = new Float32Array(count * 3);
    const c = new THREE.Color();
    for (let i = 0; i < count; i++) {
      pos.set([(Math.random() - 0.5) * 7, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 5 - 0.5], i * 3);
      seed[i] = Math.random();
      c.set(PALETTE[i % PALETTE.length]);
      col.set([c.r, c.g, c.b], i * 3);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geometry.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    geometry.setAttribute("aColor", new THREE.BufferAttribute(col, 3));
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: { uTime: { value: 0 }, uPixelRatio: { value: 1 }, uIntro: { value: 0 } },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    return { geometry, material };
  }, [count]);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  useFrame(() => {
    material.uniforms.uTime.value = motion.time;
    material.uniforms.uIntro.value = motion.dust;
    material.uniforms.uPixelRatio.value = dpr;
  });

  return <points geometry={geometry} material={material} frustumCulled={false} />;
}
