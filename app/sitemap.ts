import type { MetadataRoute } from "next";
import { siteUrl } from "./site-url";

/*
  Every public page, in the order they matter. /tokens is deliberately absent:
  it is the internal design-system reference, it carries low-contrast swatches
  by design, and it is marked noindex in its own metadata — listing it here
  would invite exactly the crawl that page should never get.
*/
const routes = ["", "/about", "/work/first-table", "/work/covid-tracer", "/work/basis"];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified,
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
