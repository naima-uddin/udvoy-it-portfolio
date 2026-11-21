import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SERVICE_PAGES, servicePage } from "@/lib/service-pages";
import { OG_IMAGE, SITE_URL } from "@/lib/seo";
import { PROCESS, SITE } from "@/lib/site";

// only the services listed in lib/service-pages.ts exist; any other slug is a 404
export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICE_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const page = servicePage((await params).slug);
  if (!page) return {};
  const url = `/services/${page.slug}`;
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: url },
    openGraph: { type: "website", url, title: `${page.title} | ${SITE.name}`, description: page.description, images: [OG_IMAGE] },
    twitter: { card: "summary_large_image", title: `${page.title} | ${SITE.name}`, description: page.description },
  };
}

/** structured data: the service, where the page sits (breadcrumbs) and its questions */
function jsonLd(page: NonNullable<ReturnType<typeof servicePage>>) {
  const url = `${SITE_URL}/services/${page.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: page.name,
        serviceType: page.name,
        description: page.description,
        url,
        provider: { "@id": `${SITE_URL}/#organization` },
        areaServed: "Worldwide",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Services", item: `${SITE_URL}/#services` },
          { "@type": "ListItem", position: 3, name: page.name, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: page.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const page = servicePage((await params).slug);
  if (!page) notFound();
  const others = SERVICE_PAGES.filter((p) => p.slug !== page.slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(page)).replace(/</g, "\\u003c") }}
      />
      <div className="backdrop" aria-hidden />
      <header className="sp-nav">
        <Link href="/" className="logo">
          <Image src="/brand/udvoy-logo-white.png" alt={SITE.name} width={135} height={30} loading="eager" />
        </Link>
        <Link href="/#contact" className="nav-cta">
          Let&apos;s talk
        </Link>
      </header>

      <main className="main sp">
        <nav className="sp-crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link> <span aria-hidden>/</span> <Link href="/#services">Services</Link>{" "}
          <span aria-hidden>/</span> <span aria-current="page">{page.name}</span>
        </nav>

        <section className="sp-hero">
          <p className="kicker">( Services )</p>
          <h1 className="h2">{page.name}</h1>
          <p className="lead sp-intro">{page.intro}</p>
          <Link className="btn" href="/#contact">
            <span>Get a free call</span>
            <b aria-hidden>→</b>
          </Link>
        </section>

        <section className="sp-block">
          <h2 className="sp-h">What&apos;s included</h2>
          <ul className="sp-grid">
            {page.includes.map((it) => (
              <li key={it.title}>
                <h3>{it.title}</h3>
                <p>{it.text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="sp-block sp-two">
          <div>
            <h2 className="sp-h">Who it&apos;s for</h2>
            <ul className="sp-list">
              {page.forWho.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="sp-h">How we work</h2>
            <ol className="sp-steps">
              {PROCESS.map((s) => (
                <li key={s.title}>
                  <b>{s.title}</b> <span>{s.text}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="sp-block">
          <h2 className="sp-h">Questions</h2>
          <div className="faq-list">
            {page.faq.map((f) => (
              <details key={f.q}>
                <summary>
                  <h3 className="faq-q">{f.q}</h3>
                  <i aria-hidden />
                </summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="sp-block sp-cta">
          <h2 className="h2">
            Let&apos;s talk about <em>your project</em>
          </h2>
          <p className="lead">Tell us what you need and we&apos;ll plan it with you on a free call.</p>
          <Link className="btn" href="/#contact">
            <span>Contact {SITE.name}</span>
            <b aria-hidden>→</b>
          </Link>
        </section>

        <nav className="sp-block" aria-label="Other services">
          <h2 className="sp-h">Other services</h2>
          <ul className="sp-others">
            {others.map((p) => (
              <li key={p.slug}>
                <Link href={`/services/${p.slug}`}>
                  {p.name} <span aria-hidden>→</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </main>
    </>
  );
}
