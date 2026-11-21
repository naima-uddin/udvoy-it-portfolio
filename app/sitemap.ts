import type { MetadataRoute } from "next";
import { SERVICE_PAGES } from "@/lib/service-pages";
import { SITE_URL } from "@/lib/seo";

/** /sitemap.xml: the home page and one page per service; add new pages here as they're created */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    ...SERVICE_PAGES.map((p) => ({
      url: `${SITE_URL}/services/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
