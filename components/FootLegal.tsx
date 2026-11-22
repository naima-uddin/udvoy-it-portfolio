import Link from "next/link";
import { SITE } from "@/lib/site";

/** copyright + legal links, at the bottom of every page */
export default function FootLegal() {
  const year = new Date().getFullYear();
  return (
    <div className="foot-legal">
      <span>
        © {year > SITE.founded ? `${SITE.founded}–${year}` : year} {SITE.name}. All rights reserved.
      </span>
      <nav aria-label="Legal">
        <Link href="/privacy">Privacy Policy</Link>
        <Link href="/terms">Terms &amp; Conditions</Link>
        <a href="/sitemap.xml">Sitemap</a>
      </nav>
    </div>
  );
}
