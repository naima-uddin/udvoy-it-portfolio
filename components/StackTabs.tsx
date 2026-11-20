"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { vars } from "@/lib/css";

export type StackTool = {
  name: string;
  /** SVG path on a 24×24 grid; tools without a logo show `mono` instead */
  path?: string;
  /** crop for logos that don't fill the 24×24 grid */
  viewBox?: string;
  mono?: string;
  /** the logo's colour (the brand colour, or white for black logos) */
  color: string;
};
export type StackGroup = { area: string; tools: StackTool[] };

/** Technology areas as tabs; each tab shows that area's tools as logo tiles. */
export default function StackTabs({ groups }: { groups: StackGroup[] }) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  // arrow keys move between tabs (and select), as screen-reader users expect from a tab list
  const onKey = (e: KeyboardEvent, i: number) => {
    const last = groups.length - 1;
    const next =
      e.key === "ArrowRight" ? (i === last ? 0 : i + 1)
      : e.key === "ArrowLeft" ? (i === 0 ? last : i - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : -1;
    if (next < 0) return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <div className="stack">
      <div className="stack-tabs" role="tablist" aria-label="Technology areas">
        {groups.map((g, i) => (
          <button
            key={g.area}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`stack-tab-${i}`}
            aria-selected={i === active}
            aria-controls={`stack-panel-${i}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => onKey(e, i)}
          >
            {g.area}
            <span aria-hidden>{g.tools.length}</span>
          </button>
        ))}
      </div>

      {groups.map((g, i) => (
        // every panel is in the HTML (search engines see all tools); only the active one is shown
        <div
          key={g.area}
          role="tabpanel"
          id={`stack-panel-${i}`}
          aria-labelledby={`stack-tab-${i}`}
          hidden={i !== active}
          className="stack-panel"
        >
          <ul className="stack-grid">
            {g.tools.map((t, j) => (
              <li key={t.name} className="tool" style={vars({ "--c": t.color, "--i": j })}>
                {t.path ? (
                  <svg viewBox={t.viewBox ?? "0 0 24 24"} aria-hidden>
                    <path d={t.path} />
                  </svg>
                ) : (
                  <span className="tool-mono" aria-hidden>
                    {t.mono}
                  </span>
                )}
                <span>{t.name}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
