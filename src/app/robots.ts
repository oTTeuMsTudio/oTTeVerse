import type { MetadataRoute } from "next";
import { baseURL, indexable } from "@/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: indexable ? "/" : undefined,
      disallow: indexable ? undefined : "/",
    },
    sitemap: `${baseURL}/sitemap.xml`,
  };
}
