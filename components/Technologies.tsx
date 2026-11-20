import {
  siBigcommerce,
  siDocker,
  siFigma,
  siFirebase,
  siFlutter,
  siGithub,
  siGooglecloud,
  siKotlin,
  siLaravel,
  siNextdotjs,
  siNodedotjs,
  siPaypal,
  siReact,
  siShopify,
  siStripe,
  siSwift,
  siTailwindcss,
  siTypescript,
  siVercel,
  siWoocommerce,
} from "simple-icons";
import Marquee from "./Marquee";
import StackTabs, { type StackGroup, type StackTool } from "./StackTabs";
import Track from "./Track";
import { vars } from "@/lib/css";

const TICKER = ["Shopify", "Next.js", "TypeScript", "WooCommerce", "Node.js", "React Native", "AWS", "AI & LLMs"];

type Icon = { path: string; hex: string };

/**
 * A logo tile in the brand's colour. Black logos (Next.js, Vercel, GitHub, BigCommerce) show in
 * white, as those brands do on dark backgrounds. `color` picks another official brand colour
 * where the main one is too dark to see here; `viewBox` crops a logo to its mark.
 */
const tool = (name: string, icon: Icon, opts: { color?: string; viewBox?: string } = {}): StackTool => {
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(icon.hex.slice(i, i + 2), 16) / 255);
  const light = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return {
    name,
    path: icon.path,
    viewBox: opts.viewBox,
    color: opts.color ?? (light < 0.12 ? "#f2f0ec" : `#${icon.hex}`),
  };
};
/** a tile for tools that have no logo in the icon set: letters in the brand colour */
const named = (name: string, mono: string, color: string): StackTool => ({ name, mono, color });

const STACK: StackGroup[] = [
  {
    area: "E-commerce",
    tools: [
      tool("Shopify", siShopify),
      tool("WooCommerce", siWoocommerce, { viewBox: "-0.35 7.6 8.8 8.8" }),
      tool("BigCommerce", siBigcommerce),
      named("Magento", "Mg", "#EE672F"),
      tool("Stripe", siStripe),
      tool("PayPal", siPaypal, { color: "#009CDE" }),
    ],
  },
  {
    area: "Web",
    tools: [
      tool("Next.js", siNextdotjs),
      tool("React", siReact),
      tool("TypeScript", siTypescript),
      tool("Tailwind CSS", siTailwindcss),
      tool("Node.js", siNodedotjs),
      tool("Laravel", siLaravel),
    ],
  },
  {
    area: "Mobile",
    tools: [
      tool("React Native", siReact),
      tool("Flutter", siFlutter, { color: "#47C5FB" }),
      tool("Swift", siSwift),
      tool("Kotlin", siKotlin),
      tool("Firebase", siFirebase, { color: "#FFCA28" }),
    ],
  },
  {
    area: "Cloud & tools",
    tools: [
      named("AWS", "AWS", "#FF9900"),
      tool("Google Cloud", siGooglecloud),
      tool("Docker", siDocker),
      tool("Vercel", siVercel),
      tool("GitHub", siGithub),
      tool("Figma", siFigma),
    ],
  },
];

export default function Technologies() {
  return (
    <Track name="technologies" id="technologies" className="tech">
      <Track as="div" mode="enter" className="section-inner sec-head">
        <p className="kicker rise">( Technologies )</p>
        <h2 className="h2 rise" style={vars({ "--i": 1 })}>
          Tools we <em>trust</em>
        </h2>
        <p className="lead rise" style={vars({ "--i": 2 })}>
          Modern, reliable tools that keep your product fast and easy to grow.
        </p>
      </Track>

      <Marquee items={TICKER} />

      <Track as="div" mode="enter" className="section-inner">
        <div className="rise">
          <StackTabs groups={STACK} />
        </div>
      </Track>
    </Track>
  );
}
