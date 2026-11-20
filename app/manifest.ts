import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { DESCRIPTION } from "@/lib/seo";

/** /manifest.webmanifest: name, colours and icons when the site is saved to a phone's home screen */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.name}: Shopify, E-commerce & Software Development`,
    short_name: SITE.name,
    description: DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#07070b",
    theme_color: "#07070b",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
