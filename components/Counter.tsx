"use client";

import { useLayoutEffect, useRef } from "react";

/**
 * A number that counts up the first time it scrolls into view.
 * The real number is in the HTML (what search engines, screen readers and visitors without
 * JavaScript see); the count-up is only added on top, and skipped for reduced motion.
 */
export default function Counter({ from = 0, to, suffix = "" }: { from?: number; to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  // layout effect: swap to the start value before the first paint, so there is no flash
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.textContent = from + suffix;
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const dur = 1600;
        const step = (now: number) => {
          const t = Math.min(1, (now - t0) / dur);
          const e = 1 - Math.pow(2, -10 * t);
          el.textContent = Math.round(from + (to - from) * (t === 1 ? 1 : e)) + suffix;
          if (t < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      el.textContent = to + suffix;
    };
  }, [from, to, suffix]);

  return (
    <span ref={ref}>
      {to}
      {suffix}
    </span>
  );
}
