"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { engine } from "@/lib/engine";

/** Boots Lenis smooth scrolling and the shared animation loop. Renders nothing. */
export default function SmoothScroll() {
  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lenis: Lenis | null = null;
    if (!reduce) {
      lenis = new Lenis({ lerp: 0.085, smoothWheel: true, anchors: true, autoRaf: false });
      engine.setDriver(lenis);
    }
    const stop = engine.start();
    return () => {
      stop();
      engine.setDriver(null);
      lenis?.destroy();
    };
  }, []);

  return null;
}
