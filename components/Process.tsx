import Track from "./Track";
import { vars } from "@/lib/css";
import { PROCESS } from "@/lib/site";

/** How a project runs: four steps on a line that draws itself as you scroll. */
export default function Process() {
  return (
    <Track name="process" id="process" className="section process">
      <Track as="div" mode="enter" className="sec-head">
        <p className="kicker rise">( How we work )</p>
        <h2 className="h2 rise" style={vars({ "--i": 1 })}>
          From first call to <em>launch</em>
        </h2>
        <p className="lead rise" style={vars({ "--i": 2 })}>
          A simple process with a clear price and weekly updates.
        </p>
      </Track>

      <Track as="ol" mode="enter" className="steps">
        {PROCESS.map((s, i) => (
          <li key={s.title} className="step rise" style={vars({ "--i": i })}>
            <span className="step-dot" aria-hidden />
            <span className="step-when">{s.when}</span>
            <h3>
              <span className="step-num">0{i + 1}</span> {s.title}
            </h3>
            <p>{s.text}</p>
          </li>
        ))}
      </Track>
    </Track>
  );
}
