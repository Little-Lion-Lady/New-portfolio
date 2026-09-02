/*
  The site's absolute origin, shared by metadataBase, the sitemap and robots.

  Derived rather than hard-coded: Vercel injects VERCEL_PROJECT_PRODUCTION_URL
  at build time, so this is correct on the deployed site with no configuration.
  Set NEXT_PUBLIC_SITE_URL to override it once a custom domain is attached.
*/
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");
