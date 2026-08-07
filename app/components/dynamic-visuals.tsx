"use client";

import dynamic from "next/dynamic";

// Code-split the Lottie-based illustrations out of the main page bundle.
// next/dynamic's ssr:false option only works from within a Client Component
// boundary, which is why this wrapping lives in its own "use client" file
// instead of directly in the (Server Component) pages that render these.
export const HeroCat = dynamic(() => import("./hero-cat").then((mod) => mod.HeroCat), { ssr: false });
export const AboutCat = dynamic(() => import("./about-cat").then((mod) => mod.AboutCat), { ssr: false });
export const MeCat = dynamic(() => import("./me-cat").then((mod) => mod.MeCat), { ssr: false });
