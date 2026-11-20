import BackToTop from "./BackToTop";
import ContactForm from "./ContactForm";
import Track from "./Track";
import { SECTIONS, SITE } from "@/lib/site";

export default function Contact() {
  return (
    <Track as="footer" mode="enter" name="contact" id="contact" className="contact">
      <div className="section-inner contact-grid">
        <div className="contact-info">
          <p className="kicker">( Contact )</p>
          <h2 className="cta-title">
            Let&apos;s turn your vision <br />
            into <em>reality.</em>
          </h2>
          <p className="lead">
            Tell us about your project or the role you need. We&apos;ll get back to you within one business day.
          </p>
          <dl className="contact-list">
            <div>
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
              </dd>
            </div>
            <div>
              <dt>Working with</dt>
              <dd>Brands and teams worldwide</dd>
            </div>
            <div>
              <dt>Our team</dt>
              <dd>{SITE.locations}</dd>
            </div>
          </dl>
        </div>

        <ContactForm />
      </div>

      <div className="foot-bar">
        <span>
          © {SITE.founded} {SITE.name} · {SITE.slogan}
        </span>
        <nav className="foot-links hide-sm" aria-label="Footer">
          {SECTIONS.slice(0, -1).map((s) => (
            <a key={s.id} href={`#${s.id}`}>
              {s.label}
            </a>
          ))}
        </nav>
        <BackToTop />
      </div>
    </Track>
  );
}
