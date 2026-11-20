import Track from "./Track";
import { vars } from "@/lib/css";

// *word* = highlighted
const TEXT =
  "We are a team of engineers and designers. We build *Shopify* stores, *e-commerce* sites and apps, and find *remote* talent for growing teams.";

/** The "about Ucchas" statement: words light up one by one as you scroll. */
export default function Story() {
  const words = TEXT.split(" ");
  return (
    <Track mode="pin" name="story" className="story" style={vars({ "--n": words.length })}>
      <div className="story-sticky">
        <h2 className="kicker kicker-wrap">About Ucchas</h2>
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
