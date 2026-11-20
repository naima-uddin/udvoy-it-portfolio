import Image, { type StaticImageData } from "next/image";
import Track from "./Track";
import { vars } from "@/lib/css";
import aether from "@/assets/projects/aether.jpg";
import drift from "@/assets/projects/drift.jpg";
import halo from "@/assets/projects/halo.jpg";
import meridian from "@/assets/projects/meridian.jpg";
import monolith from "@/assets/projects/monolith.jpg";
import prism from "@/assets/projects/prism.jpg";

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
};

// Sample case studies, a mix of the main services: replace with your own projects (photo credits in assets/projects/CREDITS.md)
const PROJECTS: Project[] = [
  {
    name: "Prism",
    sector: "Fashion · Shopify Plus",
    year: "2025",
    summary: "A fashion brand moved to Shopify Plus with a new custom design.",
    result: ["+38%", "conversion rate"],
    services: ["Migration", "Shopify Plus"],
    image: prism,
    alt: "Clothing rails with neutral-toned garments in a bright studio",
    focus: "50% 70%",
  },
  {
    name: "Aether",
    sector: "Fintech · Web & mobile",
    year: "2026",
    summary: "A payments app for iOS, Android and the web.",
    result: ["4.8★", "app store rating"],
    services: ["Mobile", "Web"],
    image: aether,
    alt: "Hands holding a phone showing a money transfer screen",
  },
  {
    name: "Meridian",
    sector: "Retail · Remote team",
    year: "2024",
    summary: "A remote team of nine, hired and managed by us.",
    result: ["3 weeks", "from brief to full team"],
    services: ["Remote hiring", "Managed team"],
    image: meridian,
    alt: "A laptop showing a video meeting with many participants, next to a coffee mug",
    focus: "78% 50%",
  },
  {
    name: "Monolith",
    sector: "Wholesale · B2B e-commerce",
    year: "2025",
    summary: "A wholesale store connected to the warehouse system.",
    result: ["3×", "faster order processing"],
    services: ["Shopify B2B", "Integrations"],
    image: monolith,
    alt: "A long warehouse aisle with tall shelves of cardboard boxes",
    focus: "50% 60%",
  },
  {
    name: "Halo",
    sector: "Healthcare · Web app",
    year: "2025",
    summary: "Online booking and video visits for clinics.",
    result: ["12k", "consultations a month"],
    services: ["Web", "Mobile"],
    image: halo,
    alt: "A doctor typing on a keyboard, with a stethoscope on the desk",
    focus: "22% 50%",
  },
  {
    name: "Drift",
    sector: "Beauty · Shopify CRO",
    year: "2024",
    summary: "A faster Shopify store that sells more.",
    result: ["+27%", "conversion rate"],
    services: ["CRO", "Speed"],
    image: drift,
    alt: "Performance charts on a laptop screen",
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
                  0{i + 1} · {p.year}
                </span>
                <h3>{p.name}</h3>
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
