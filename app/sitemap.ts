import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/** /sitemap.xml: the site is one page; add new pages here as they're created */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
