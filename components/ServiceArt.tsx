import { vars } from "@/lib/css";
import type { MainService } from "@/lib/site";

/*
 * Small product mock-ups for the four main service tiles, drawn in HTML and CSS (styles under
 * "services (bento)" in globals.css). They're decoration: hidden from screen readers.
 */

/** Shopify: a storefront, a sales card and a new-order toast */
function Store() {
  return (
    <div className="art art-store" aria-hidden>
      <div className="mock">
        <div className="mock-bar">
          <i />
          <i />
          <i />
          <span>yourbrand.com</span>
        </div>
        <div className="mock-hero">
          <b />
          <b />
          <em />
        </div>
        <div className="mock-grid">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="mock-item">
              <span />
              <b />
              <b />
            </div>
          ))}
        </div>
      </div>
      <div className="art-stat">
        <small>Sales today</small>
        <strong>$8,420</strong>
        <svg viewBox="0 0 100 30" preserveAspectRatio="none">
          <path d="M0 26 L12 22 L24 24 L36 16 L48 18 L60 11 L72 13 L84 6 L100 3" />
        </svg>
      </div>
      <div className="art-toast">
        <i /> New order <strong>$129.00</strong>
      </div>
    </div>
  );
}

const ORDERS = [
  ["#1042", "Paid", "$129.00"],
  ["#1043", "Shipped", "$58.40"],
  ["#1044", "Paid", "$212.00"],
  ["#1045", "Delivered", "$74.90"],
  ["#1046", "Shipped", "$96.10"],
];

/** E-commerce: a live order feed that scrolls by */
function Orders() {
  return (
    <div className="art art-feed" aria-hidden>
      <div className="feed">
        {/* the list twice, so the scroll can loop without a jump */}
        {[...ORDERS, ...ORDERS].map(([id, status, amount], i) => (
          <div key={i} className="feed-row">
            <span className="feed-id">{id}</span>
            <span className={`feed-st st-${status.toLowerCase()}`}>{status}</span>
            <span className="feed-amt">{amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Web: a few lines of code with a blinking cursor */
function Code() {
  return (
    <div className="art art-code" aria-hidden>
      <div className="code-bar">
        <i />
        <i />
        <i />
      </div>
      <p>
        <span className="c-t">&lt;Hero</span> <span className="c-a">fast</span> <span className="c-t">/&gt;</span>
      </p>
      <p>
        <span className="c-t">&lt;Products</span> <span className="c-a">grid</span>=<span className="c-s">{"{3}"}</span>{" "}
        <span className="c-t">/&gt;</span>
      </p>
      <p>
        <span className="c-t">&lt;Checkout</span> <span className="c-a">secure</span> <span className="c-t">/&gt;</span>
        <span className="caret" />
      </p>
    </div>
  );
}

const PEOPLE = [
  ["SD", "Shopify developer", "Senior"],
  ["VA", "Virtual assistant", "Managed"],
];

/** Remote hiring: a shortlist of vetted candidates */
function Shortlist() {
  return (
    <div className="art art-people" aria-hidden>
      {PEOPLE.map(([initials, role, level], i) => (
        <div key={role} className="person" style={vars({ "--i": i })}>
          <span className="avatar">{initials}</span>
          <span className="person-text">
            <b>{role}</b>
            <small>{level} · Vetted</small>
          </span>
          <span className="person-ok" />
        </div>
      ))}
      <div className="people-foot">
        <span className="pulse" /> Shortlist ready
      </div>
    </div>
  );
}

const ART: Record<MainService, () => React.JSX.Element> = {
  shopify: Store,
  commerce: Orders,
  web: Code,
  hiring: Shortlist,
};

export default function ServiceArt({ kind }: { kind: MainService }) {
  const Art = ART[kind];
  return <Art />;
}
