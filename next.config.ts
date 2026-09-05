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
  },
};

export default nextConfig;
