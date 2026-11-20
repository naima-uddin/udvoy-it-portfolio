import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Syne } from "next/font/google";
import { SITE } from "@/lib/site";
import { BING_VERIFICATION, DESCRIPTION, GOOGLE_VERIFICATION, KEYWORDS, SITE_URL, TITLE } from "@/lib/seo";
import "./globals.css";

const display = Syne({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["italic"],
  variable: "--font-serif",
  display: "swap",
});

// the share image comes from app/opengraph-image.tsx, the icons from app/icon.png, app/favicon.ico
// and app/apple-icon.png, and the sitemap, robots.txt and manifest from their files in app/
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // pages added later only set their own part, e.g. "Shopify development" → "Shopify development | UDVOY IT"
  title: { default: TITLE, template: `%s | ${SITE.name}` },
  description: DESCRIPTION,
  keywords: KEYWORDS,
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE_URL }],
  creator: SITE.name,
  publisher: SITE.name,
  category: "technology",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE.name,
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  // stop phones turning numbers and addresses in the text into links
  formatDetection: { telephone: false, address: false, email: false },
  // Search Console / Bing Webmaster ownership codes, added only once set (see lib/seo.ts)
  verification: {
    ...(GOOGLE_VERIFICATION ? { google: GOOGLE_VERIFICATION } : {}),
    ...(BING_VERIFICATION ? { other: { "msvalidate.01": BING_VERIFICATION } } : {}),
  },
};

export const viewport: Viewport = {
  themeColor: "#07070b",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${serif.variable}`}>
      {/* browser extensions (Grammarly, ColorZilla…) add attributes to <body>; don't flag that as a hydration error */}
      <body suppressHydrationWarning>
        {/* scroll reveals start hidden and are shown by the scroll engine; without JavaScript, show them */}
        <noscript>
          <style>{".rise{opacity:1!important;transform:none!important}"}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
