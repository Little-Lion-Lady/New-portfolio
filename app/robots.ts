import type { MetadataRoute } from "next";
import { siteUrl } from "./site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The internal design-system reference. It also sets noindex in its own
      // metadata; this keeps well-behaved crawlers from spending the request
      // at all.
      disallow: "/tokens",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
