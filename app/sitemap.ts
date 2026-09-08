import type { MetadataRoute } from "next";
import { siteUrl } from "./site-url";

/*
  Every public page, in the order they matter. /tokens is deliberately absent:
  it is the internal design-system reference, it carries low-contrast swatches
  by design, and it is marked noindex in its own metadata — listing it here
  would invite exactly the crawl that page should never get.

  `lastModified` is a hand-maintained date per route, NOT `new Date()`.

  Built from the clock, every deploy told crawlers that all five pages had just
  changed — including a deploy that only touched a component or a config file.
  A signal that fires on every build carries no information, and a sitemap that
  cries wolf is one a crawler learns to discount, which costs exactly the pages
  a portfolio most wants recrawled after a real edit.

  Seeded from `git log -1 --format=%cs -- <page>` at the time this was written.
  Bump a date when that page's CONTENT changes — new copy, new case study,
  reworked section. Not for a refactor, a token sync or a styling pass.
*/
const routes = [
  { path: "", lastModified: "2026-09-07" },
  { path: "/about", lastModified: "2026-09-07" },
  { path: "/work/first-table", lastModified: "2026-09-07" },
  { path: "/work/covid-tracer", lastModified: "2026-09-07" },
  { path: "/work/basis", lastModified: "2026-09-06" },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map(({ path, lastModified }) => ({
    url: `${siteUrl}${path}`,
    lastModified,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.8,
  }));
}
