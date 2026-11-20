"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { vars } from "@/lib/css";
import type { Member } from "@/lib/site";

/** the department shown as a featured "Leadership" row above everyone else */
const LEAD_DEPT = "Management";
/** auto-scroll speed of the team row, in pixels per second */
const SPEED = 38;

const initials = (name: string) =>
  name
    .replace(/^md\.?\s+/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");

function Card({ m, i, lead = false, clone = false }: { m: Member; i: number; lead?: boolean; clone?: boolean }) {
  return (
    <li
      className={lead ? "member member-lead" : "member"}
      style={vars({ "--i": i })}
      // the second copy in the looping row is only there for the seamless loop: hidden from screen readers and keyboard
      aria-hidden={clone || undefined}
      inert={clone || undefined}
    >
      <div className="member-photo">
        {m.photo ? (
          // eslint-disable-next-line @next/next/no-img-element -- small local portraits, sized by CSS
          <img src={m.photo} alt={clone ? "" : m.name} loading="lazy" width={400} height={400} />
        ) : (
          <span aria-hidden>{initials(m.name)}</span>
        )}
      </div>
      <div className="member-info">
        <h3>{m.name}</h3>
        <p className="member-role">{m.role}</p>
      </div>
      {m.linkedin && (
        <a className="member-link" href={m.linkedin} target="_blank" rel="noreferrer" aria-label={`${m.name} on LinkedIn`}>
          in
        </a>
      )}
    </li>
  );
}

/**
 * One row of team cards. When the cards don't fit, the row scrolls on its own and loops
 * seamlessly (the list is repeated once, out of view, to make the loop). It pauses while the
 * pointer is over it or it's being touched, can always be swiped or scrolled by hand, and stays
 * still for visitors who prefer reduced motion.
 */
function TeamRail({ list }: { list: Member[] }) {
  const rail = useRef<HTMLDivElement>(null);
  const row = useRef<HTMLUListElement>(null);
  const [loop, setLoop] = useState(false);

  // loop only when one copy of the list is wider than the rail
  useEffect(() => {
    const el = rail.current;
    const ul = row.current;
    if (!el || !ul) return;
    const check = () => {
      const items = ul.children;
      const n = list.length;
      if (!items.length) return;
      const last = items[n - 1] as HTMLElement;
      const oneCopy = last.offsetLeft + last.offsetWidth - (items[0] as HTMLElement).offsetLeft;
      setLoop(oneCopy > el.clientWidth + 1);
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [list]);

  // auto-scroll
  useEffect(() => {
    const el = rail.current;
    const ul = row.current;
    if (!el || !ul) return;
    el.scrollLeft = 0;
    if (!loop || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let pos = 0;
    let last = 0;
    let raf = 0;
    let paused = false;
    let resumeAt = 0;
    let visible = true;

    const step = (t: number) => {
      const dt = last ? Math.min(0.05, (t - last) / 1000) : 0;
      last = t;
      // the first card of the second copy marks where the loop restarts
      const clone = ul.children[list.length] as HTMLElement | undefined;
      const period = clone ? clone.offsetLeft - (ul.children[0] as HTMLElement).offsetLeft : 0;
      if (Math.abs(el.scrollLeft - pos) > 2) pos = el.scrollLeft; // the visitor scrolled by hand
      if (visible && !paused && t >= resumeAt && period > 0) {
        pos += SPEED * dt;
        if (pos >= period) pos -= period;
        el.scrollLeft = pos;
      } else if (period > 0 && pos >= period) {
        pos -= period;
        el.scrollLeft = pos;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    const pause = () => (paused = true);
    const resume = () => {
      paused = false;
      resumeAt = performance.now() + 1200;
    };
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);
    el.addEventListener("pointerenter", pause);
    el.addEventListener("pointerleave", resume);
    el.addEventListener("touchstart", pause, { passive: true });
    el.addEventListener("touchend", resume);
    el.addEventListener("focusin", pause);
    el.addEventListener("focusout", resume);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      el.removeEventListener("pointerenter", pause);
      el.removeEventListener("pointerleave", resume);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("touchend", resume);
      el.removeEventListener("focusin", pause);
      el.removeEventListener("focusout", resume);
    };
  }, [loop, list]);

  return (
    <div ref={rail} className={`team-rail${loop ? " is-loop" : ""}`}>
      <ul ref={row} className="team-row" aria-live="polite">
        {list.map((m, i) => (
          <Card key={m.id} m={m} i={i} />
        ))}
        {loop && list.map((m, i) => <Card key={`${m.id}-loop`} m={m} i={i} clone />)}
      </ul>
    </div>
  );
}

/**
 * The team, built to grow: the leadership in a featured row, then everyone else in one
 * auto-scrolling row with department filters (made from the list, so a new department appears by
 * itself). Every card is keyed by employee ID, so nobody is listed twice.
 */
export default function TeamGrid({ team }: { team: Member[] }) {
  const [dept, setDept] = useState("All");

  // de-duplicate by ID in case someone is listed twice by mistake
  const unique = useMemo(() => [...new Map(team.map((m) => [m.id, m])).values()], [team]);
  const leads = unique.filter((m) => m.focus === LEAD_DEPT);
  const staff = useMemo(() => unique.filter((m) => m.focus !== LEAD_DEPT), [unique]);

  const depts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const m of staff) counts.set(m.focus, (counts.get(m.focus) ?? 0) + 1);
    return [["All", staff.length] as const, ...counts];
  }, [staff]);

  const list = useMemo(() => (dept === "All" ? staff : staff.filter((m) => m.focus === dept)), [dept, staff]);

  return (
    <>
      {leads.length > 0 && (
        <>
          <p className="team-label">Leadership</p>
          <ul className="team-leads">
            {leads.map((m, i) => (
              <Card key={m.id} m={m} i={i} lead />
            ))}
          </ul>
        </>
      )}

      {staff.length > 0 && (
        <>
          <div className="team-bar">
            <p className="team-label">Our team</p>
            {depts.length > 2 && (
              <div className="stack-tabs team-filters" role="group" aria-label="Filter by department">
                {depts.map(([d, n]) => (
                  <button key={d} type="button" aria-pressed={dept === d} onClick={() => setDept(d)}>
                    {d} <span>{n}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* the key restarts the row (and its card entrance animation) when the filter changes */}
          <TeamRail key={dept} list={list} />
        </>
      )}
    </>
  );
}
