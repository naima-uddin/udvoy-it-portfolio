import Track from "./Track";
import { vars } from "@/lib/css";
import { SITE, TEAM } from "@/lib/site";

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");

/** The UDVOY IT team. Names, roles, photos and LinkedIn links go in lib/site.ts. */
export default function Team() {
  return (
    <Track name="team" id="team" className="section team">
      <Track as="div" mode="enter" className="sec-head">
        <p className="kicker rise">( Team )</p>
        <h2 className="h2 rise" style={vars({ "--i": 1 })}>
          The people behind <em>UDVOY IT</em>
        </h2>
        <p className="lead rise" style={vars({ "--i": 2 })}>
          Founders, developers, SEO specialists, researchers and support staff, working from {SITE.locations}.
        </p>
      </Track>

      <div className="team-grid">
        {TEAM.map((m, i) => (
          <Track key={m.name || m.role} as="div" mode="enter" className="member rise" style={vars({ "--i": i % 3 })}>
            <div className="member-photo" aria-hidden={!m.photo}>
              {m.photo ? (
                // eslint-disable-next-line @next/next/no-img-element -- small local portraits, sized by CSS
                <img src={m.photo} alt={m.name} loading="lazy" />
              ) : (
                <span>{m.name ? initials(m.name) : `0${i + 1}`}</span>
              )}
            </div>
            <div className="member-info">
              {m.name ? (
                <>
                  <h3>{m.name}</h3>
                  <p className="member-role">{m.role}</p>
                </>
              ) : (
                <h3>{m.role}</h3>
              )}
              <p className="member-focus">{m.focus}</p>
            </div>
            {m.linkedin && (
              <a className="member-link" href={m.linkedin} target="_blank" rel="noreferrer" aria-label={`${m.name} on LinkedIn`}>
                in
              </a>
            )}
          </Track>
        ))}
      </div>
    </Track>
  );
}
