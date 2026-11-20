import Counter from "./Counter";
import Track from "./Track";
import Hero3D from "./hero3d/Hero3D";
import { vars } from "@/lib/css";
import { SITE, STATS } from "@/lib/site";

/** First screen: what UDVOY IT does, the team in numbers, and the two next steps. */
export default function About() {
  return (
    <Track name="about" id="about" className="about">
      <Hero3D />
      <div className="about-inner">
        {/* the main heading: who UDVOY IT is (small line), then the promise (big line) */}
        <h1 className="about-h1">
          {/* the {" "} spaces keep the words apart in the page text that search engines read */}
          <span className="kicker kicker-wrap">
            {SITE.name} · Shopify, e-commerce & remote teams
          </span>{" "}
          <span className="about-title">
            <span>Turning ideas</span> <span>into digital</span>{" "}
            <span>
              <em>success.</em>
            </span>
          </span>
        </h1>

        <div className="about-foot">
          <p className="lead">
            We build and grow <span className="nowrap">Shopify</span> and{" "}
            <span className="nowrap">e-commerce</span> stores, and hire and manage remote employees for your business.
          </p>
          <div className="actions">
            <a className="btn" href="#contact">
              <span>Start a project</span>
              <b aria-hidden>→</b>
            </a>
            <a className="link-arrow" href="#projects">
              See our work <span aria-hidden>↓</span>
            </a>
          </div>
        </div>

        <div className="stats">
          {STATS.map((s, i) => (
            <div key={s.label} className="stat" style={vars({ "--i": i })}>
              <strong>
                <Counter from={s.from} to={s.to} suffix={s.suffix} />
              </strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </Track>
  );
}
