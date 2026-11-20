import Track from "./Track";
import { vars } from "@/lib/css";
import { FAQ } from "@/lib/site";

/**
 * Questions buyers actually ask. Native <details> elements: keyboard and screen-reader friendly,
 * work without JavaScript, and open with a smooth height animation where the browser supports it.
 */
export default function Faq() {
  return (
    <Track name="faq" id="faq" className="section faq">
      <Track as="div" mode="enter" className="faq-side">
        <p className="kicker rise">( FAQ )</p>
        <h2 className="h2 rise" style={vars({ "--i": 1 })}>
          Good <em>questions</em>
        </h2>
        <p className="lead rise" style={vars({ "--i": 2 })}>
          Something else on your mind? Just ask us.
        </p>
        <a className="link-arrow rise" style={vars({ "--i": 3 })} href="#contact">
          Ask a question <span aria-hidden>→</span>
        </a>
      </Track>

      <Track as="div" mode="enter" className="faq-list">
        {FAQ.map((f, i) => (
          <details key={f.q} className="rise" style={vars({ "--i": Math.min(i, 4) })}>
            <summary>
              <h3 className="faq-q">{f.q}</h3>
              <i aria-hidden />
            </summary>
            <p>{f.a}</p>
          </details>
        ))}
      </Track>
    </Track>
  );
}
