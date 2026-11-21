import Image, { type StaticImageData } from "next/image";
import Track from "./Track";
import { vars } from "@/lib/css";
import aether from "@/assets/projects/aether.jpg";
import autospecshub from "@/assets/projects/autospecshub.jpg";
import beautyStore from "@/assets/projects/beauty-store.jpg";
import chronologicalAge from "@/assets/projects/chronological-age.jpg";
import clinicWebsite from "@/assets/projects/clinic-website.jpg";
import fashionStore from "@/assets/projects/fashion-store.jpg";
import meridian from "@/assets/projects/meridian.jpg";
import monolith from "@/assets/projects/monolith.jpg";

type Project = {
  name: string;
  sector: string;
  year: string;
  summary: string;
  /** the headline number and what it measures */
  result: [string, string];
  services: string[];
  image: StaticImageData;
  alt: string;
  /** which part of the photo to keep when the card crops it (CSS object-position) */
  focus?: string;
  /** the live site, linked from the project name */
  url?: string;
};

// AutoSpecsHub and the Chronological Age Calculator are real UDVOY IT projects; the cards after them
// show the types of project we build, with what each includes (no made-up clients or numbers).
// Swap them for real client projects as they go live (photo credits in assets/projects/CREDITS.md)
const PROJECTS: Project[] = [
  {
    name: "AutoSpecsHub",
    sector: "Automotive · Web platform",
    year: "2026",
    summary: "A car specs site: find any car by body type, brand, price and detailed specs.",
    result: ["157", "car brands to browse"],
    services: ["Web development", "Search & filters"],
    image: autospecshub,
    alt: "The AutoSpecsHub car search: body types, brands and spec filters",
    focus: "50% 0%",
    url: "https://www.autospecshub.com/",
  },
  {
    name: "Chronological Age Calculator",
    sector: "Utility · Web tool",
    year: "2026",
    summary: "Exact age in years, months and days from any date of birth, with PDF download and share cards.",
    result: ["Y · M · D", "exact age in one click"],
    services: ["Web development", "SEO"],
    image: chronologicalAge,
    alt: "The Chronological Age Calculator: name, date of birth and age-at-date fields with calculate, PDF and share buttons",
    focus: "50% 0%",
    url: "https://www.calculatechronologicalage.com/",
  },
  {
    name: "Fashion E-commerce Store",
    sector: "Fashion · Shopify",
    year: "Project type",
    summary: "A clothing store on Shopify with a custom design, size filters, collections and fast mobile checkout.",
    result: ["Shopify", "custom theme"],
    services: ["Shopify", "Store design"],
    image: fashionStore,
    alt: "A fashion store page: an 'Up to 30% off' banner over a rail of women's clothes, with secure payment and support badges",
    focus: "72% 50%",
  },
  {
    name: "Doctor & Clinic Website",
    sector: "Healthcare · Web app",
    year: "Project type",
    summary: "A clinic website where patients find doctors, book appointments online and get reminders.",
    result: ["24/7", "online appointment booking"],
    services: ["Web app", "Booking system"],
    image: clinicWebsite,
    alt: "A medical center website: 'Your health is our priority' over a surgeon's portrait, with an appointment form and opening hours",
    focus: "45% 0%",
  },
  {
    name: "Wholesale B2B Store",
    sector: "Wholesale · B2B e-commerce",
    year: "Project type",
    summary: "A wholesale store with customer price lists, bulk ordering and stock synced with the warehouse.",
    result: ["Bulk", "orders & price lists"],
    services: ["Shopify B2B", "Integrations"],
    image: monolith,
    alt: "A long warehouse aisle with tall shelves of cardboard boxes",
    focus: "50% 60%",
  },
  {
    name: "Payments App",
    sector: "Fintech · Web & mobile",
    year: "Project type",
    summary: "A money transfer app for iOS, Android and the web, with secure sign-in and payment history.",
    result: ["iOS · Android", "and web"],
    services: ["Mobile", "Web"],
    image: aether,
    alt: "Hands holding a phone showing a money transfer screen",
  },
  {
    name: "Beauty Store Makeover",
    sector: "Beauty · Shopify CRO",
    year: "Project type",
    summary: "A faster beauty store with a cleaner product page and checkout, built to turn visitors into buyers.",
    result: ["Faster", "pages & checkout"],
    services: ["CRO", "Speed", "SEO"],
    image: beautyStore,
    alt: "A cosmetics store homepage: 'Cosmetics that everyone loves!' beside a pink splash and a product tube, with product cards below",
    focus: "70% 50%",
  },
  {
    name: "Remote Support Team",
    sector: "Retail · Remote team",
    year: "Project type",
    summary: "A remote customer support and data team for an online store, hired and managed by UDVOY IT.",
    result: ["Managed", "daily by us"],
    services: ["Remote hiring", "Managed team"],
    image: meridian,
    alt: "A laptop showing a video meeting with many participants, next to a coffee mug",
    focus: "78% 50%",
  },
];

/** Projects: a pinned, horizontally scrolling 3D gallery of case studies. */
export default function Work() {
  return (
    <Track mode="pin" name="projects" id="projects" className="work" style={vars({ "--cards": PROJECTS.length })}>
      <div className="work-sticky">
        <div className="work-ghost" aria-hidden>
          Selected work · Selected work ·
        </div>

        <div className="work-head">
          <p className="kicker">( Selected work )</p>
          <h2 className="h2">
            Worlds we&apos;ve <em>built</em>
          </h2>
        </div>

        <div className="work-stage">
          {PROJECTS.map((p, i) => (
            <article key={p.name} className="card" style={vars({ "--i": i })}>
              <Image
                className="card-img"
                src={p.image}
                alt={p.alt}
                fill
                sizes="(max-width: 900px) 74vw, 27vw"
                placeholder="blur"
                style={p.focus ? { objectPosition: p.focus } : undefined}
              />
              <span className="card-sector">{p.sector}</span>
              <div className="card-info">
                <span className="card-num">
                  {String(i + 1).padStart(2, "0")} · {p.year}
                </span>
                <h3>
                  {p.url ? (
                    <a href={p.url} target="_blank" rel="noreferrer">
                      {p.name} <span aria-hidden>↗</span>
                    </a>
                  ) : (
                    p.name
                  )}
                </h3>
                <p className="card-sum">{p.summary}</p>
                <div className="card-foot">
                  <p className="card-result">
                    <strong>{p.result[0]}</strong> {p.result[1]}
                  </p>
                  <ul className="card-tags">
                    {p.services.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="work-progress" aria-hidden>
          <span />
        </div>
      </div>
    </Track>
  );
}
