import type { Metadata } from "next";

/*
  Per-route metadata, built in one place.
  ──────────────────────────────────────
  Next merges metadata SHALLOWLY, and both halves of that rule bite here:

  - A field a page does NOT define is inherited from the layout verbatim. That
    is what put `alternates.canonical: "/"` — declared once in the root layout —
    onto every page on the site, so /about and all three case studies told
    Google they were duplicates of the homepage. Nothing in the sitemap or the
    per-route titles could outvote that.

  - A nested object a page DOES define REPLACES the parent's copy wholesale
    rather than merging into it. So a page that sets `openGraph` just to correct
    the title silently drops siteName, locale and type along with it.

  The fix for both is the same: no URL-bearing or page-specific metadata in the
  root layout, and every route builds its block from this function. The layout
  keeps only what is genuinely site-wide and page-independent (metadataBase, and
  the fallback title/description a route would want if it forgot to set any).

  Deliberately NOT set here:

  - `openGraph.images` / `twitter.images`. Next wires app/opengraph-image.tsx in
    by file convention on every route that has no closer one, and naming an
    image here would override that. Drop an opengraph-image.tsx into a route's
    own folder to give it a bespoke card.
  - `openGraph.type: "article"` on the case studies. Defensible, but it invites
    the article:* properties (published_time, author) that would then need to be
    real and maintained. "website" is honest for all five routes as they stand.
*/
export function pageMetadata({
  path,
  title,
  description,
}: {
  /** Route path, leading slash, no origin — resolved against metadataBase. */
  path: string;
  title: string;
  description: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: "Maryna Babych",
      locale: "en_NZ",
      url: path,
      title,
      description,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}
