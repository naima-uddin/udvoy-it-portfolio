import type { Metadata } from "next";
import Link from "next/link";
import SubPage from "@/components/SubPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${SITE.name} collects, uses and protects the information you share with us through udvoy.com.`,
  alternates: { canonical: "/privacy" },
};

const UPDATED = "22 November 2026";

export default function Privacy() {
  const a = SITE.address;
  return (
    <SubPage className="legal">
      <p className="kicker">( Legal )</p>
      <h1 className="h2">Privacy Policy</h1>
      <p className="legal-date">Last updated: {UPDATED}</p>

      <p>
        This policy explains what information {SITE.name} (&quot;we&quot;, &quot;us&quot;) collects when you use this
        website, how we use it and the choices you have.
      </p>

      <h2>Information we collect</h2>
      <ul>
        <li>
          <b>What you send us.</b> When you use the contact form, we receive your name, email address and message. If
          you email, call or message us on WhatsApp, we receive what you share there.
        </li>
        <li>
          <b>Technical data.</b> Like most websites, our hosting provider automatically records basic technical
          information such as your IP address, browser type and the pages requested, to keep the site running and
          secure.
        </li>
      </ul>
      <p>
        We do not use advertising or analytics cookies, and we do not track you across other websites.
      </p>

      <h2>How we use it</h2>
      <ul>
        <li>To reply to your enquiry and discuss your project or hiring needs.</li>
        <li>To provide the services you ask us for.</li>
        <li>To keep the website secure and working properly.</li>
      </ul>
      <p>We never sell your personal information.</p>

      <h2>Sharing</h2>
      <p>
        We share information only with service providers that help us run the website and handle messages (such as
        our hosting and email providers), and only as needed for that purpose, or when the law requires it.
      </p>

      <h2>How long we keep it</h2>
      <p>
        We keep enquiries for as long as needed to respond and to work with you, and then delete them unless we must
        keep them for legal or accounting reasons.
      </p>

      <h2>Your choices</h2>
      <p>
        You can ask us to see, correct or delete the personal information we hold about you by emailing{" "}
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
      </p>

      <h2>Links to other sites</h2>
      <p>
        Our website links to other sites, such as Facebook, WhatsApp and Google Maps. Their own privacy policies
        apply when you visit them.
      </p>

      <h2>Changes</h2>
      <p>We may update this policy. The date at the top shows when it last changed.</p>

      <h2>Contact</h2>
      <p>
        {SITE.name}
        <br />
        {a.street}, {a.locality}, {a.region}, {a.country}
        <br />
        Email: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
        <br />
        Phone / WhatsApp: <a href={`tel:${SITE.tel}`}>{SITE.phone}</a>
      </p>
      <p>
        See also our <Link href="/terms">Terms &amp; Conditions</Link>.
      </p>
    </SubPage>
  );
}
