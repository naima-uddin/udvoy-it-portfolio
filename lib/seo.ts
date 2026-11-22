import { FAQ, SERVICES, SITE, TEAM } from "./site";

/**
 * Search and social settings, used by the metadata in app/layout.tsx, the sitemap, robots.txt,
 * the share image and the structured data (JSON-LD) on the page. Server-only.
 */

/**
 * The live address of the site, with no trailing slash: https://udvoy.com in production builds,
 * localhost in development. NEXT_PUBLIC_SITE_URL overrides it (e.g. for a staging domain).
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.NODE_ENV === "production" ? "https://udvoy.com" : "http://localhost:3000")
).replace(/\/+$/, "");

/** about 60 characters: what search results show as the link */
export const TITLE = "UDVOY IT | Shopify, E-commerce & Remote Hiring Company";

/** about 155 characters: the snippet under the link in search results */
export const DESCRIPTION =
  "UDVOY IT builds and grows Shopify and e-commerce stores, and hires and manages skilled remote employees for your business. Also websites, SEO and support.";

/** shown on social shares and in the share image */
export const TAGLINE = "Innovate. Create. Elevate.";

export const KEYWORDS = [
  "UDVOY IT",
  "Udvoy",
  "Shopify development",
  "Shopify developers",
  "Shopify agency",
  "Shopify Plus",
  "Shopify store setup",
  "Shopify migration",
  "e-commerce development",
  "WooCommerce development",
  "web development company",
  "SEO services",
  "data entry services",
  "web research",
  "customer support outsourcing",
  "custom software development",
  "IT company Bangladesh",
  "remote hiring",
  "remote employee management",
  "managed remote team",
  "hire remote employees",
  "hire remote developers",
  "IT company",
];

/** public profiles and the Google Business Profile, so search engines link them to UDVOY IT (edit SITE.social) */
export const SOCIAL_PROFILES: string[] = [...SITE.social.map((s) => s.url), SITE.map];

/** Google Search Console: set NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION to the code it gives you */
export const GOOGLE_VERIFICATION = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

/** Bing Webmaster Tools (also feeds DuckDuckGo, Yahoo and ChatGPT search): set NEXT_PUBLIC_BING_SITE_VERIFICATION */
export const BING_VERIFICATION = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION;

/** the placeholder address isn't published in the structured data; it shows up once SITE.email is real */
export const PUBLIC_EMAIL = /@example.(com|org|net)$/i.test(SITE.email) ? undefined : SITE.email;

/** the share image made by app/opengraph-image.tsx */
export const OG_IMAGE = { url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630 };

/**
 * Structured data for search engines and AI assistants: who UDVOY IT is, the website, this page,
 * the services offered and the FAQ. One graph, with the parts linked by @id.
 */
export function jsonLd() {
  const org = `${SITE_URL}/#organization`;
  const website = `${SITE_URL}/#website`;
  const email = PUBLIC_EMAIL ? { email: PUBLIC_EMAIL } : {};
  // the team as shown on the page (public details only), so search engines see the real people behind UDVOY IT
  const person = (m: (typeof TEAM)[number]) => ({
    "@type": "Person",
    "@id": `${SITE_URL}/#${m.id.toLowerCase()}`,
    name: m.name,
    jobTitle: m.role,
    worksFor: { "@id": org },
    ...(m.photo ? { image: `${SITE_URL}${m.photo}` } : {}),
    ...(m.linkedin ? { sameAs: [m.linkedin] } : {}),
  });
  const people = TEAM.map(person);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        // a company with a real office: also a local business, which links it to the Google Business Profile
        "@type": ["Organization", "ProfessionalService"],
        "@id": org,
        telephone: SITE.tel,
        address: {
          "@type": "PostalAddress",
          streetAddress: SITE.address.street,
          addressLocality: SITE.address.locality,
          addressRegion: SITE.address.region,
          addressCountry: SITE.address.countryCode,
        },
        hasMap: SITE.map,
        name: SITE.name,
        alternateName: ["UDVOY", "Udvoy IT"],
        url: `${SITE_URL}/`,
        logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png`, width: 512, height: 512 },
        image: `${SITE_URL}/logo.png`,
        description: DESCRIPTION,
        ...email,
        slogan: TAGLINE,
        foundingDate: String(SITE.founded),
        numberOfEmployees: { "@type": "QuantitativeValue", value: TEAM.length },
        founder: TEAM.filter((m) => /founder/i.test(m.role)).map((m) => ({ "@id": `${SITE_URL}/#${m.id.toLowerCase()}` })),
        employee: TEAM.map((m) => ({ "@id": `${SITE_URL}/#${m.id.toLowerCase()}` })),
        areaServed: "Worldwide",
        knowsAbout: [
          "Shopify",
          "Shopify Plus",
          "E-commerce",
          "WooCommerce",
          "Web development",
          "SEO",
          "Data entry",
          "Web research",
          "Customer support",
          "Custom software",
          "Remote hiring",
          "Remote team management",
        ],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "sales",
          ...email,
          telephone: SITE.tel,
          url: `${SITE_URL}/#contact`,
          availableLanguage: ["English"],
        },
        ...(SOCIAL_PROFILES.length ? { sameAs: SOCIAL_PROFILES } : {}),
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Services",
          itemListElement: SERVICES.map((s) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: s.title,
              description: s.text,
              url: `${SITE_URL}/services/${s.slug}`,
              provider: { "@id": org },
              areaServed: "Worldwide",
            },
          })),
        },
      },
      {
        "@type": "WebSite",
        "@id": website,
        url: `${SITE_URL}/`,
        name: SITE.name,
        description: DESCRIPTION,
        alternateName: ["UDVOY", "Udvoy IT"],
        publisher: { "@id": org },
        inLanguage: "en-US",
      },
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/#webpage`,
        url: `${SITE_URL}/`,
        name: TITLE,
        description: DESCRIPTION,
        isPartOf: { "@id": website },
        about: { "@id": org },
        primaryImageOfPage: { "@type": "ImageObject", ...OG_IMAGE },
        inLanguage: "en-US",
      },
      ...people,
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        mainEntity: FAQ.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };
}
