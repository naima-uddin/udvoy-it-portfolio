"use client";

import { useRef, type ReactNode } from "react";

/**
 * A grid whose tiles light up near the pointer: on mouse move it writes the pointer position,
 * relative to each `.tile`, as --mx / --my (the CSS draws the glow). Nearby tiles glow too.
 */
export default function Spotlight({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  const tiles = () => ref.current?.querySelectorAll<HTMLElement>(".tile") ?? [];

  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const { clientX, clientY } = e;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      for (const t of tiles()) {
        const r = t.getBoundingClientRect();
        t.style.setProperty("--mx", `${clientX - r.left}px`);
        t.style.setProperty("--my", `${clientY - r.top}px`);
      }
    });
  };

  const leave = () => {
    cancelAnimationFrame(frame.current);
    for (const t of tiles()) {
      t.style.removeProperty("--mx");
      t.style.removeProperty("--my");
    }
  };

  return (
    <div ref={ref} className={className} onPointerMove={move} onPointerLeave={leave}>
      {children}
    </div>
  );
}
