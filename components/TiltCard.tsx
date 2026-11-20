"use client";

import { useRef, type ReactNode } from "react";

/** Card that tilts in 3D toward the pointer, with a moving glare highlight. */
export default function TiltCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    const s = ref.current.style;
    s.setProperty("--ry", `${(x - 0.5) * 16}deg`);
    s.setProperty("--rx", `${(0.5 - y) * 14}deg`);
    s.setProperty("--mx", `${x * 100}%`);
    s.setProperty("--my", `${y * 100}%`);
    s.setProperty("--glare", "1");
  };

  const leave = () => {
    const s = ref.current?.style;
    if (!s) return;
    s.setProperty("--ry", "0deg");
    s.setProperty("--rx", "0deg");
    s.setProperty("--glare", "0");
  };

  return (
    <div ref={ref} className={`tilt ${className}`} onPointerMove={move} onPointerLeave={leave}>
      {children}
    </div>
  );
}
