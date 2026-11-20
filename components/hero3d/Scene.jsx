"use client";

import { Environment, Lightformer, PerformanceMonitor } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { engine } from "@/lib/engine";
import ChipCore from "./ChipCore";
import Dust from "./Dust";

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeOut = (t) => 1 - Math.pow(1 - clamp01(t), 3);
const damp = THREE.MathUtils.damp;

/**
 * Advances the shared motion state once per frame, before anything else reads it.
 * Everything animates by mutating this object in useFrame: no React state, no re-renders.
 */
function Driver({ motion, reduced }) {
  // keeps its own time: the frame delta from @react-three/fiber's THREE.Clock (deprecated in
  // three r187) can stay at 0, which would freeze every animation
  const last = useRef(0);
  useFrame(() => {
    // nothing moves until the shaders are compiled, so the entrance plays from its start
    if (reduced || !motion.compiled) return; // reduced motion: one still, fully-built frame
    const now = performance.now();
    const dt = last.current ? Math.min((now - last.current) / 1000, 0.05) : 1 / 60;
    last.current = now;
    motion.time += dt;
    motion.clock += dt;

    // entrance, about 2.6 s: ribbon grows, glass rises, fibres draw in, dust appears
    const t = motion.clock;
    motion.intro = easeOut((t - 0.15) / 2.2);
    motion.ribbon = easeOut((t - 0.1) / 2.0);
    motion.fibres = easeOut((t - 0.9) / 1.6);
    motion.dust = easeOut((t - 0.6) / 1.8);

    // cursor, eased so the scene follows it with a little weight
    motion.px = damp(motion.px, motion.tx, 2.6, dt);
    motion.py = damp(motion.py, motion.ty, 2.6, dt);

    // how far the hero has scrolled away (0 at the top, 1 once it has left the screen)
    const about = engine.find("about");
    const s = about ? clamp01(engine.y / Math.max(1, about.height)) : 0;
    motion.scroll = damp(motion.scroll, s, 5, dt);
  }, -1);
  return null;
}

/** Tilts the whole composition toward the cursor and turns/lifts it as the hero scrolls away. */
function Rig({ motion, quality, children }) {
  const group = useRef(null);
  const camera = useThree((s) => s.camera);
  const base = quality === "high" ? 8.2 : 9.4;

  useFrame(() => {
    const g = group.current;
    if (!g) return;
    const { px, py, scroll, intro, time } = motion;
    // a product-shot angle: looking down on the chip, turned to show two of its sides
    g.rotation.y = -0.62 + px * 0.34 + scroll * 0.55 + Math.sin(time * 0.1) * 0.07;
    g.rotation.x = 0.56 - py * 0.16 + scroll * 0.22;
    // sits high, clear of the buttons below it
    g.position.y = 0.55 + scroll * 1.3;
    g.scale.setScalar(0.76 + 0.12 * intro - scroll * 0.08);

    // camera eases in during the entrance and drifts slightly against the cursor
    camera.position.set(-px * 0.25, -py * 0.15, base + (1 - intro) * 1.1);
    camera.lookAt(0, 0.15, 0);
  });

  return <group ref={group}>{children}</group>;
}

/** A soft light that follows the cursor, so highlights slide across the chrome as you move. */
function CursorLight({ motion }) {
  const light = useRef(null);
  useFrame(() => {
    if (!light.current) return;
    light.current.position.set(motion.px * 2.6, motion.py * 1.7 + 0.3, 2.4);
    light.current.intensity = 22 * motion.intro;
  });
  return <pointLight ref={light} color="#d8ccff" distance={7} decay={2} />;
}

/**
 * Renders each frame ourselves. The canvas is cleared fully transparent (the page's own glow
 * shows behind the scene), then the clear colour is set to the page's dark violet before
 * rendering: three.js fills what is seen *through glass* with the clear colour, and on a
 * transparent canvas it would otherwise pick 50% white, which makes glass look milky.
 */
function Render({ motion }) {
  const behindGlass = useMemo(() => new THREE.Color("#0c0916"), []);
  useFrame(({ gl, scene, camera }) => {
    if (!motion.compiled) return;
    gl.autoClear = false;
    gl.setClearColor(0x000000, 0);
    gl.clear();
    gl.setClearColor(behindGlass, 1);
    gl.render(scene, camera);
  }, 1);
  return null;
}

/** resolves when the browser has a quiet moment (or soon, if it never does) */
const idle = () =>
  new Promise((resolve) =>
    window.requestIdleCallback ? window.requestIdleCallback(() => resolve(), { timeout: 250 }) : setTimeout(resolve, 16),
  );

/**
 * Compiles the shaders in the background before the first real frame, one material at a
 * time with a pause between each. The physical materials (glass, iridescent chrome) are big
 * shaders: compiled all at once on first render they would freeze the page for a moment;
 * split up like this, scrolling and clicks stay responsive. Then the canvas fades in.
 */
function Warmup({ motion, onReady }) {
  const { gl, scene, camera, invalidate } = useThree();
  useEffect(() => {
    let alive = true;
    let raf = 0;
    const compileAll = async () => {
      const seen = new Set();
      const targets = [];
      scene.traverse((o) => {
        if ((o.isMesh || o.isPoints) && o.material && !seen.has(o.material)) {
          seen.add(o.material);
          targets.push(o);
        }
      });
      for (const object of targets) {
        if (!alive) return;
        // compiled against the whole scene, so lights and the environment are accounted for
        await gl.compileAsync(object, camera, scene).catch(() => {});
        await idle();
      }
      // Glass shows what is behind it by rendering the solid objects a second time into a
      // texture, without tone mapping and in linear colour. Those are different shader
      // variants: warm them up too, or they would all compile on the first frame.
      const hasGlass = targets.some((o) => o.material.transmission > 0);
      if (hasGlass) {
        const offscreen = new THREE.WebGLRenderTarget(1, 1);
        for (const object of targets) {
          const m = object.material;
          if (!alive) break;
          if (m.transparent || m.transmission > 0) continue;
          const target = gl.getRenderTarget();
          const toneMapping = gl.toneMapping;
          gl.setRenderTarget(offscreen);
          gl.toneMapping = THREE.NoToneMapping;
          // compileAsync reads the renderer state synchronously, so it can be restored straight away
          const done = gl.compileAsync(object, camera, scene);
          gl.setRenderTarget(target);
          gl.toneMapping = toneMapping;
          await done.catch(() => {});
          await idle();
        }
        offscreen.dispose();
      }
      if (!alive) return;
      motion.compiled = true;
      invalidate();
      requestAnimationFrame(() => requestAnimationFrame(() => alive && onReady?.()));
    };
    // wait a couple of frames so the studio environment exists: materials compile differently with it
    let frames = 0;
    const tick = () => {
      invalidate();
      if (++frames < 3) raf = requestAnimationFrame(tick);
      else compileAll();
    };
    raf = requestAnimationFrame(tick);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
    };
  }, [gl, scene, camera, invalidate, motion, onReady]);
  return null;
}

/** Studio lighting built from glowing panels in the brand colours: no HDR file to download. */
function Studio() {
  return (
    // 128 px is plenty for slightly rough chrome, and makes the reflection map much cheaper to build
    <Environment resolution={128} frames={1}>
      <Lightformer form="rect" intensity={3.2} color="#ffffff" position={[0, 4.5, -1]} rotation-x={Math.PI / 2} scale={[9, 1.6, 1]} />
      <Lightformer form="rect" intensity={2.6} color="#8fd3ff" position={[-5, 0.8, 0.5]} rotation-y={Math.PI / 2} scale={[3, 7, 1]} />
      <Lightformer form="rect" intensity={2.6} color="#ff9ccf" position={[5, -0.6, 0]} rotation-y={-Math.PI / 2} scale={[3, 7, 1]} />
      <Lightformer form="rect" intensity={1.4} color="#b79cff" position={[0, -0.5, 6]} scale={[7, 2.4, 1]} />
      <Lightformer form="ring" intensity={2.2} color="#ffc48a" position={[2.5, -3.5, 2.5]} scale={2.2} />
    </Environment>
  );
}

export default function Scene({ quality, reduced, container, onReady }) {
  const high = quality === "high";
  const [visible, setVisible] = useState(true);
  const [dpr, setDpr] = useState(() => Math.min(window.devicePixelRatio || 1, high ? 1.75 : 1.25));

  // one mutable object shared by every animated part
  const motion = useMemo(
    () => ({
      tx: 0,
      ty: 0,
      px: 0,
      py: 0,
      scroll: 0,
      clock: 0,
      compiled: false,
      // reduced motion: a still frame, mid-flow, with everything fully in place
      time: reduced ? 7.5 : 0,
      intro: reduced ? 1 : 0,
      ribbon: reduced ? 1 : 0,
      fibres: reduced ? 1 : 0,
      dust: reduced ? 1 : 0,
    }),
    [reduced],
  );

  // cursor position over the whole window, in -1..1 (no listeners on touch screens or reduced motion)
  useEffect(() => {
    if (reduced || !matchMedia("(pointer: fine)").matches) return;
    const onMove = (e) => {
      motion.tx = (e.clientX / window.innerWidth) * 2 - 1;
      motion.ty = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [motion, reduced]);

  // stop rendering entirely while the hero is off screen
  useEffect(() => {
    const el = container.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "120px" });
    io.observe(el);
    return () => io.disconnect();
  }, [container]);

  return (
    <Canvas
      dpr={dpr}
      frameloop={reduced ? "demand" : visible ? "always" : "never"}
      camera={{ position: [0, 0, 9], fov: 32, near: 0.1, far: 40 }}
      gl={{ antialias: high, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.toneMappingExposure = 1.05;
        // what you see through the glass: full resolution on desktop (lower looks blocky up
        // close), reduced on phones where the scene is small and dimmed anyway
        gl.transmissionResolutionScale = high ? 1 : 0.6;
      }}
    >
      {/* drop the resolution if the device can't keep up */}
      <PerformanceMonitor onDecline={() => setDpr(1)} />
      <Driver motion={motion} reduced={reduced} />
      <Studio />
      <CursorLight motion={motion} />
      <Rig motion={motion} quality={quality}>
        <ChipCore motion={motion} quality={quality} />
        <Dust motion={motion} quality={quality} />
      </Rig>
      <Render motion={motion} />
      <Warmup motion={motion} onReady={onReady} />
    </Canvas>
  );
}
