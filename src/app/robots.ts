import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/site";

/** Served at /robots.txt. The form endpoints are not pages, so keep crawlers off them. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
