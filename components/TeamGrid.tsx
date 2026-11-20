"use client";

import { useMemo, useState } from "react";
import { vars } from "@/lib/css";
import type { Member } from "@/lib/site";

/** the department shown as a featured "Leadership" row above everyone else */
const LEAD_DEPT = "Management";
/** how many team cards show before "Show all" (two rows on a wide screen) */
const PREVIEW = 10;

const initials = (name: string) =>
  name
    .replace(/^md\.?\s+/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");

function Card({ m, i, lead = false }: { m: Member; i: number; lead?: boolean }) {
  return (
    <li className={lead ? "member member-lead" : "member"} style={vars({ "--i": i })}>
      <div className="member-photo">
        {m.photo ? (
          // eslint-disable-next-line @next/next/no-img-element -- small local portraits, sized by CSS
          <img src={m.photo} alt={m.name} loading="lazy" width={400} height={400} />
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
 * The team, built to grow: the leadership in a featured row, then everyone else in a grid with
 * department filters (made from the list, so a new department appears by itself). Only the first
 * rows show until "Show all" is pressed. Every card is keyed by employee ID, so nobody repeats.
 */
export default function TeamGrid({ team }: { team: Member[] }) {
  const [dept, setDept] = useState("All");
  const [all, setAll] = useState(false);

  // de-duplicate by ID in case someone is listed twice by mistake
  const unique = useMemo(() => [...new Map(team.map((m) => [m.id, m])).values()], [team]);
  const leads = unique.filter((m) => m.focus === LEAD_DEPT);
  const staff = unique.filter((m) => m.focus !== LEAD_DEPT);

  const depts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const m of staff) counts.set(m.focus, (counts.get(m.focus) ?? 0) + 1);
    return [["All", staff.length] as const, ...counts];
  }, [staff]);

  const list = dept === "All" ? staff : staff.filter((m) => m.focus === dept);
  const shown = all ? list : list.slice(0, PREVIEW);

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
                  <button
                    key={d}
                    type="button"
                    aria-pressed={dept === d}
                    onClick={() => {
                      setDept(d);
                      setAll(false);
                    }}
                  >
                    {d} <span>{n}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* the key restarts the card entrance animation when the filter changes */}
          <ul className="team-grid" key={dept} aria-live="polite">
            {shown.map((m, i) => (
              <Card key={m.id} m={m} i={i % PREVIEW} />
            ))}
          </ul>

          {list.length > PREVIEW && (
            <div className="team-more">
              <button type="button" className="link-arrow" aria-expanded={all} onClick={() => setAll((a) => !a)}>
                {all ? "Show less" : `Show all ${list.length}`} <span aria-hidden>{all ? "↑" : "↓"}</span>
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
