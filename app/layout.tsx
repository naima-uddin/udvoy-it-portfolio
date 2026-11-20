import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Syne } from "next/font/google";
import { SITE } from "@/lib/site";
import { DESCRIPTION, GOOGLE_VERIFICATION, KEYWORDS, SITE_URL, TITLE } from "@/lib/seo";
import "./globals.css";

const display = Syne({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["italic"],
  variable: "--font-serif",
  display: "swap",
});

// the share image comes from app/opengraph-image.tsx, the icons from app/icon.svg, app/favicon.ico
// and app/apple-icon.png, and the sitemap, robots.txt and manifest from their files in app/
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
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
  ...(GOOGLE_VERIFICATION ? { verification: { google: GOOGLE_VERIFICATION } } : {}),
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
