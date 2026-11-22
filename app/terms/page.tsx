import type { Metadata } from "next";
import Link from "next/link";
import SubPage from "@/components/SubPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: `The terms for using the ${SITE.name} website, udvoy.com.`,
  alternates: { canonical: "/terms" },
};

const UPDATED = "22 November 2026";

export default function Terms() {
  return (
    <SubPage className="legal">
      <p className="kicker">( Legal )</p>
      <h1 className="h2">Terms &amp; Conditions</h1>
      <p className="legal-date">Last updated: {UPDATED}</p>

      <p>
        These terms apply to your use of the {SITE.name} website. By using the site, you agree to them. If you do not
        agree, please do not use the site.
      </p>

      <h2>About this website</h2>
      <p>
        This website describes the services of {SITE.name}. Information on it is general and may change without
        notice. It is not an offer or a contract.
      </p>

      <h2>Our services</h2>
      <p>
        Any work we do for you, including development, remote hiring and team management, is covered by a separate
        written agreement or quote. If that agreement differs from these terms, the agreement applies.
      </p>

      <h2>Using the site</h2>
      <p>You agree not to:</p>
      <ul>
        <li>use the site for anything unlawful;</li>
        <li>try to break, overload or gain unauthorised access to the site;</li>
        <li>send spam or misleading information through the contact form.</li>
      </ul>

      <h2>Intellectual property</h2>
      <p>
        The text, design, logo and other content on this site belong to {SITE.name} or are used with permission. You
        may not copy or reuse them without our written consent. Project names and screenshots belong to their owners.
      </p>

      <h2>Links to other sites</h2>
      <p>
        We link to other websites for your convenience. We are not responsible for their content or how they work.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        We work to keep the site accurate and available, but we provide it &quot;as is&quot; and cannot guarantee it
        will always be error-free or uninterrupted. To the extent the law allows, {SITE.name} is not liable for any
        loss caused by using this website.
      </p>

      <h2>Governing law</h2>
      <p>These terms are governed by the laws of {SITE.address.country}.</p>

      <h2>Changes</h2>
      <p>We may update these terms. The date at the top shows when they last changed.</p>

      <h2>Contact</h2>
      <p>
        Questions about these terms? Email <a href={`mailto:${SITE.email}`}>{SITE.email}</a> or call{" "}
        <a href={`tel:${SITE.tel}`}>{SITE.phone}</a>. See also our <Link href="/privacy">Privacy Policy</Link>.
      </p>
    </SubPage>
  );
}
