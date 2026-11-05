import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    // Avoid Turbopack inferring the wrong root when other lockfiles exist.
    root: path.resolve(__dirname),
  },
  images: {
    // 90 = the site default for all case-study/work imagery (DEFAULT_QUALITY in
    // app/components/work-image.tsx — keep the two in step); 75 is reserved for
    // BS4.jpg. Was 100, which cost ~2x the bytes for a difference that does not
    // show up in a 1:1 pixel comparison.
    // Keep source images near their rendered size: sharp's near-lossless encode
    // stalls on very large sources (FT1 was 3713px for a 560px slot).
    qualities: [75, 90],
    // WebP only, deliberately. AVIF is the usual next step, but its quality
    // scale is not WebP's: measured on this imagery at the widths it actually
    // renders, AVIF q90 came out LARGER than WebP q90 (FT3 at 1200px: 242KB vs
    // 165KB) and took ~5x as long to encode. Re-measure before enabling it.
    // Cache an optimised variant for a year instead of Next's 4-hour default.
    // The sources are content-stable: a replaced photo gets a new filename, and
    // the URL carries the path, so there is nothing to invalidate.
    minimumCacheTTL: 31536000,
    // Widths next/image may generate. The default list jumps from 2048 to
    // 3840, so a full-column image (about 1374px) on a 2x screen asked for
    // 3840. 1440, 2560 and 2880 give it a bucket close to what it shows, and
    // nothing on the site is wide enough to need 3840 (sources are capped at
    // 2560px by scripts/optimize-images.mjs).
    deviceSizes: [640, 660, 750, 828, 1080, 1200, 1440, 1920, 2048, 2560, 2880],
    // Default list plus 512. The case-study hero cards are 260px tall on a
    // phone, which works out to roughly 490px and 642px wide at a typical
    // 1.75x Android density; with only 384/640/750 on offer both rounded up a
    // whole bucket. 512 and 660 (above) catch them.
    imageSizes: [32, 48, 64, 96, 128, 256, 384, 512],
  },

  /*
    Baseline response headers.

    Deliberately NOT including a Content-Security-Policy. A meaningful CSP here
    needs `script-src` to cover both the inline theme script in layout.tsx and
    the inline bootstrap scripts Next emits for the RSC payload. Hashes change
    every build, so the only maintainable option is a nonce — and a nonce has to
    be generated per request, which forces every route out of static generation.
    That is precisely the trade layout.tsx already refused once, for the same
    reason: this site should be static HTML cached at the edge. A CSP is worth
    revisiting if the site ever renders dynamically; bolting one on now would
    cost the thing it was built for.

    The four below are all static-safe and cost nothing.
  */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Stop a browser second-guessing a declared Content-Type — the
          // mechanism behind a "harmless" upload being executed as script.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Send the full URL within the site, origin-only to other origins.
          // The default in modern browsers, stated explicitly so it does not
          // depend on the browser's own default.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // SAMEORIGIN rather than DENY: nothing embeds the site today, but
          // DENY would also break an embed in an application portal or a
          // prototype, and the clickjacking risk that matters is cross-origin.
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // The site asks for none of these; say so, so an injected script
          // cannot either.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
