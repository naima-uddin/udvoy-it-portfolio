"use client";

import { useEffect, useRef } from "react";
import { engine } from "@/lib/engine";

/** Endless ticker that speeds up and leans with your scroll velocity. Pauses when off screen. */
export default function Marquee({ items }: { items: string[] }) {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const w = wrap.current;
    const t = track.current;
    if (!w || !t) return;
    let visible = false;
    let x = 0;
    let skew = 0;
    let dir = 1;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(w);

    const off = engine.onTick((_time, dt) => {
      if (!visible) return;
      const v = engine.velocity;
      if (Math.abs(v) > 0.5) dir = v < 0 ? -1 : 1;
      const half = t.scrollWidth / 2;
      x -= (0.05 + Math.min(Math.abs(v), 60) * 0.02) * dt * dir;
      if (x <= -half) x += half;
      if (x > 0) x -= half;
      skew += (Math.max(-12, Math.min(12, -v * 0.35)) - skew) * 0.1;
      t.style.transform = `translate3d(${x}px,0,0) skewX(${skew}deg)`;
    });

    return () => {
      off();
      io.disconnect();
    };
  }, []);

  const row = items.map((s) => (
    <span key={s}>
      {s} <i aria-hidden>✦</i>
    </span>
  ));

  return (
    <div ref={wrap} className="marquee" aria-label={items.join(", ")}>
      <div ref={track} className="marquee-track" aria-hidden>
        {row}
        {row}
      </div>
    </div>
  );
}
