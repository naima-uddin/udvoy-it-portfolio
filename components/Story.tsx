import Track from "./Track";
import { vars } from "@/lib/css";

// *word* = highlighted
const TEXT =
  "We don't believe in limitations. We believe in *ideas,* determination and the power of *technology* to create a better tomorrow. We are not just building for today. We are creating *possibilities* for tomorrow.";

/** The "about UDVOY IT" statement: words light up one by one as you scroll. */
export default function Story() {
  const words = TEXT.split(" ");
  return (
    <Track mode="pin" name="story" className="story" style={vars({ "--n": words.length })}>
      <div className="story-sticky">
        <h2 className="kicker kicker-wrap">About UDVOY IT · A partner in progress</h2>
        <p className="story-text">
          {words.map((w, i) => {
            const hl = w.startsWith("*");
            const clean = w.replace(/\*/g, "");
            return (
              <span key={i} className={hl ? "w hl" : "w"} style={vars({ "--i": i })}>
                {clean}{" "}
              </span>
            );
          })}
        </p>
      </div>
    </Track>
  );
}
