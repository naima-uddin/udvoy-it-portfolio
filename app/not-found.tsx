import type { Metadata } from "next";
import Link from "next/link";

// answered with a 404 status; search engines are told not to index it (links on it may be followed)
export const metadata: Metadata = { title: "Page not found | Ucchas", robots: { index: false, follow: true } };

export default function NotFound() {
  return (
    <main className="not-found">
      <p className="kicker">( 404 )</p>
      <h1 className="h2">
        Page not <em>found</em>
      </h1>
      <p className="lead">This page doesn&apos;t exist or has moved.</p>
      <Link className="btn" href="/">
        <span>Back to the home page</span>
        <b aria-hidden>→</b>
      </Link>
    </main>
  );
}
