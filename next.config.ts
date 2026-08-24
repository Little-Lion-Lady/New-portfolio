import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    // Avoid Turbopack inferring the wrong root when other lockfiles exist.
    root: path.resolve(__dirname),
  },
  images: {
    // 100 = full quality (default for all case-study/work imagery, per audit
    // fix — don't compress further); 75 = Next's default, reserved for BS4.png.
    // Keep source images near their rendered size: sharp's near-lossless encode
    // at 100 stalls on very large sources (FT1 was 3713px for a 560px slot).
    qualities: [75, 100],
  },
};

export default nextConfig;
