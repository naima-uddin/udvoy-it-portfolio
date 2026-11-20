import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { TAGLINE } from "@/lib/seo";

// the logo mark, read once at build time
const markSrc = `data:image/png;base64,${await readFile(join(process.cwd(), "public/brand/udvoy-mark.png"), "base64")}`;

/*
 * The preview image for shared links (LinkedIn, Facebook, WhatsApp, Slack, X…). Generated once at
 * build time. Next.js adds the og:image tags (and X falls back to the same image).
 */

export const alt = "UDVOY IT: Innovate. Create. Elevate. Web, e-commerce, SEO and IT services";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const SERVICES = ["Shopify", "E-commerce", "Web", "SEO", "Remote hiring"];

export default function Image() {
  const words = TAGLINE.split(" ");
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          color: "#f2f0ec",
          backgroundColor: "#07070b",
          backgroundImage:
            "radial-gradient(circle at 82% 30%, rgba(123, 77, 255, 0.45), transparent 50%), radial-gradient(circle at 10% 100%, rgba(255, 140, 90, 0.2), transparent 45%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- rendered by next/og, not the browser */}
          <img src={markSrc} width={56} height={56} alt="" />
          <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: 10 }}>UDVOY IT</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 26, letterSpacing: 6, color: "#a7a3b4" }}>EMPOWERING BUSINESSES THROUGH TECHNOLOGY</div>
          {/* one span per word so the line wraps between words; the last word in the brand colour */}
          <div style={{ display: "flex", flexWrap: "wrap", fontSize: 84, fontWeight: 800, lineHeight: 1.05, letterSpacing: -3 }}>
            {words.map((w, i) => (
              <span key={i} style={{ marginRight: 22, color: i === words.length - 1 ? "#b79cff" : undefined }}>
                {w}
              </span>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 14 }}>
          {SERVICES.map((s) => (
            <div
              key={s}
              style={{
                padding: "12px 24px",
                fontSize: 26,
                border: "1px solid rgba(255, 255, 255, 0.22)",
                borderRadius: 999,
                backgroundColor: "rgba(255, 255, 255, 0.06)",
              }}
            >
              {s}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
