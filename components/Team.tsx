import TeamGrid from "./TeamGrid";
import Track from "./Track";
import { vars } from "@/lib/css";
import { SITE, TEAM } from "@/lib/site";

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
          {TEAM.length} people across founders, developers, SEO, data research and customer support, working from{" "}
          {SITE.locations}.
        </p>
      </Track>

      <TeamGrid team={TEAM} />
    </Track>
  );
}
