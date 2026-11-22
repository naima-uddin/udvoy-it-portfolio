import BackToTop from "./BackToTop";
import ContactForm from "./ContactForm";
import FootLegal from "./FootLegal";
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
              <dt>Phone</dt>
              <dd>
                <a href={`tel:${SITE.tel}`}>{SITE.phone}</a>
                {" · "}
                <a href={SITE.whatsapp} target="_blank" rel="noreferrer">
                  WhatsApp
                </a>
              </dd>
            </div>
            <div>
              <dt>Office</dt>
              <dd>
                <address>
                  {SITE.address.street}, {SITE.address.locality}, {SITE.address.region}, {SITE.address.country}
                </address>
                <a href={SITE.map} target="_blank" rel="noreferrer">
                  View on Google Maps
                </a>
              </dd>
            </div>
            <div>
              <dt>Follow us</dt>
              <dd>
                {SITE.social.map((s, i) => (
                  <span key={s.url}>
                    {i > 0 && " · "}
                    <a href={s.url} target="_blank" rel="noreferrer me">
                      {s.name}
                    </a>
                  </span>
                ))}
              </dd>
            </div>
            <div>
              <dt>Our team</dt>
              <dd>{SITE.locations}, working with brands worldwide</dd>
            </div>
          </dl>
        </div>

        <ContactForm />
      </div>

      <div className="foot-bar">
        <span>{SITE.slogan}</span>
        <nav className="foot-links hide-sm" aria-label="Footer">
          {SECTIONS.slice(0, -1).map((s) => (
            <a key={s.id} href={`#${s.id}`}>
              {s.label}
            </a>
          ))}
        </nav>
        <BackToTop />
      </div>
      <FootLegal />
    </Track>
  );
}
