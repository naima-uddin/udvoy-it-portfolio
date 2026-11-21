import Link from "next/link";
import LineIcon from "./LineIcon";
import ServiceArt from "./ServiceArt";
import Spotlight from "./Spotlight";
import Track from "./Track";
import { vars } from "@/lib/css";
import { SERVICES } from "@/lib/site";

// each tile's place in the bento grid: the main services by name, the others s1, s2, s3
let small = 0;
const TILES = SERVICES.map((s) => ({ ...s, area: s.main ?? `s${++small}` }));

/**
 * Services as a bento grid: the main services (Shopify, e-commerce, remote hiring & management, web) get
 * large tiles with a small product mock-up; the rest are compact tiles.
 */
export default function Services() {
  return (
    <Track name="services" id="services" className="section">
      <Track as="div" mode="enter" className="sec-head">
        <p className="kicker rise">( Services )</p>
        <h2 className="h2 rise" style={vars({ "--i": 1 })}>
          Everything you need to <em>grow digitally</em>
        </h2>
        <p className="lead rise" style={vars({ "--i": 2 })}>
          Our core work is Shopify, e-commerce, and hiring and managing remote employees. We also build websites and offer
          SEO, data research and customer support.
        </p>
      </Track>

      <Spotlight className="bento">
        {TILES.map((s, i) => (
          <Track
            key={s.title}
            as="div"
            mode="enter"
            className={`tile tile-${s.area} rise is-link`}
            style={vars({ "--i": i % 3 })}
          >
            <div className="tile-text">
              <LineIcon name={s.icon} />
              <h3>
                {/* each service has its own page; the link covers the whole tile (see .is-link in the CSS) */}
                <Link href={`/services/${s.slug}`}>
                  {s.title} <span aria-hidden>→</span>
                </Link>
              </h3>
              <p>{s.text}</p>
            </div>
            {s.main && <ServiceArt kind={s.main} />}
          </Track>
        ))}
      </Spotlight>
    </Track>
  );
}
