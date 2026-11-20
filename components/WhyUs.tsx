import Track from "./Track";
import { vars } from "@/lib/css";
import { WHY } from "@/lib/site";

/** Why UDVOY IT: four short, checkable reasons in one row, right under the statement above. */
export default function WhyUs() {
  return (
    <Track name="why" id="why" className="section why">
      <div className="why-grid">
        {WHY.map((w, i) => (
          <Track key={w.title} as="div" mode="enter" className="why-item rise" style={vars({ "--i": i })}>
            <span className="why-num">0{i + 1}</span>
            <h3>{w.title}</h3>
            <p>{w.text}</p>
          </Track>
        ))}
      </div>
    </Track>
  );
}
