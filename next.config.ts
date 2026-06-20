import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    // Avoid Turbopack inferring the wrong root when other lockfiles exist.
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
