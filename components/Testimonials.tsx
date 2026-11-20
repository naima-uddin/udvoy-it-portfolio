import Track from "./Track";
import { vars } from "@/lib/css";
import { TESTIMONIALS } from "@/lib/site";

/**
 * Named client quotes, with photo, role and company. Renders nothing until real quotes are
 * added to lib/site.ts: an invented testimonial costs more trust than it earns.
 */
export default function Testimonials() {
  if (!TESTIMONIALS.length) return null;
  return (
    <Track name="testimonials" id="testimonials" className="section">
      <Track as="div" mode="enter" className="sec-head">
        <p className="kicker rise">( Clients )</p>
        <h2 className="h2 rise" style={vars({ "--i": 1 })}>
          In their <em>words</em>
        </h2>
      </Track>
      <div className="quotes">
        {TESTIMONIALS.map((t, i) => (
          <Track key={t.name} as="div" mode="enter" className="quote rise" style={vars({ "--i": i % 3 })}>
            <blockquote>
              <p>&ldquo;{t.quote}&rdquo;</p>
            </blockquote>
            <div className="quote-by">
              {t.photo && (
                // eslint-disable-next-line @next/next/no-img-element -- small local portraits, sized by CSS
                <img src={t.photo} alt="" loading="lazy" />
              )}
              <div>
                <strong>{t.name}</strong>
                <span>
                  {t.role}, {t.company}
                </span>
              </div>
            </div>
          </Track>
        ))}
      </div>
    </Track>
  );
}
