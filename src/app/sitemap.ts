import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/site";

/**
 * Served at /sitemap.xml. Lists exactly the routes under src/app — add a line
 * here when a page is added. No lastModified: a made-up date is worse than none.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
