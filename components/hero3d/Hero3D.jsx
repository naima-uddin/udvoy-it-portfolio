"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";

// three.js and the scene are only downloaded when we decide to show them
const Scene = dynamic(() => import("./Scene"), { ssr: false });

function webglAvailable() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * The 3D centrepiece on the right of the hero. The box is always rendered (absolutely
 * positioned, so it never moves the layout); the scene loads into it once the page is idle,
 * and fades in on its first frame. No WebGL or data saver on: the box simply stays empty.
 */
export default function Hero3D() {
  const box = useRef(null);
  const [mode, setMode] = useState(null);
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);

  useEffect(() => {
    const conn = navigator.connection;
    if (conn?.saveData || !webglAvailable()) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = matchMedia("(max-width: 900px), (pointer: coarse)").matches;
    const start = () => setMode({ quality: small ? "low" : "high", reduced });
    // wait for the browser to be idle, so the hero's own content paints first
    if (window.requestIdleCallback) {
      const id = window.requestIdleCallback(start, { timeout: 1200 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(start, 300);
    return () => clearTimeout(id);
  }, []);

  return (
    <div ref={box} className={`hero3d${ready ? " is-ready" : ""}`} aria-hidden>
      {mode && <Scene {...mode} container={box} onReady={onReady} />}
    </div>
  );
}
