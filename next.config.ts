import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    // Avoid Turbopack inferring the wrong root when other lockfiles exist.
    root: path.resolve(__dirname),

    /*
      Ship lottie-web's LIGHT build instead of its default one.

      lottie-react does a plain `require('lottie-web')`, which resolves to the
      package's `main` — build/player/lottie.js, the everything build. The only
      thing that build adds over lottie_light is the expression engine (plus the
      canvas and HTML renderers, which are dead weight for a `renderer: 'svg'`
      call site).

      None of the four animations on this site use any of it. Checked directly
      against the JSON — hero-cat, about-cat, me-cat and star1 all report zero
      expressions, zero effects, zero image assets, zero text layers, zero track
      mattes and zero masks. They are pure vector shape layers, which is exactly
      the case lottie_light exists for.

      Verified equivalent rather than assumed: rendering hero-cat.json through
      both builds and hashing the produced SVG markup at frames 0, 6, 12, 18,
      24, 30 and 35 of 36 gives byte-identical output at every one.

      Measured on a clean build — the library chunk drops 306.8KB -> 170.4KB raw
      (77.4KB -> 47.6KB gzipped), around 10% off all client JS. The animation
      data is untouched; it was never the expensive half.

      Aliased to the ESM build rather than the UMD one: it ends in
      `export { lottie as default }`, which is the shape lottie-react's default
      import wants, and it lets the bundler see through it.

      Turbopack only, because that is what builds this project. If a build is
      ever run with `--webpack`, add the matching `resolve.alias` there or it
      will silently go back to the full build — the site still WORKS either way,
      which is what makes it silent.
    */
    resolveAlias: {
      "lottie-web": "lottie-web/build/player/esm/lottie_light.min.js",
    },
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
