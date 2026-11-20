import TiltCard from "./TiltCard";
import Track from "./Track";
import { vars } from "@/lib/css";
import { HIRING } from "@/lib/site";

/** Remote hiring: two ways to work with us, the roles we fill, and one call to action. */
export default function Hiring() {
  return (
    <Track name="hiring" id="hiring" className="section hiring">
      <Track as="div" mode="enter" className="sec-head">
        <p className="kicker rise">( Remote talent )</p>
        <h2 className="h2 rise" style={vars({ "--i": 1 })}>
          Hire your <em>remote team</em>
        </h2>
        <p className="lead rise" style={vars({ "--i": 2 })}>
          Skilled developers and designers, checked by our senior team.
        </p>
      </Track>

      <div className="hire-modes">
        {HIRING.modes.map((m, i) => (
          <Track key={m.title} as="div" mode="enter" className="rise rise-3d" style={vars({ "--i": i })}>
            <TiltCard>
              <span className="svc-phase">Option 0{i + 1}</span>
              <h3>{m.title}</h3>
              <p>{m.text}</p>
            </TiltCard>
          </Track>
        ))}
      </div>

      <Track as="div" mode="enter" className="hire-roles rise">
        <ul className="role-list" aria-label="Roles we hire for">
          {HIRING.roles.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </Track>

      <Track as="div" mode="enter" className="hire-cta rise">
        <p>Need someone for your team?</p>
        <a className="btn" href="#contact">
          <span>Book a hiring call</span>
          <b aria-hidden>→</b>
        </a>
      </Track>
    </Track>
  );
}
