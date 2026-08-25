"use client";

import { useMemo } from "react";
import Lottie from "lottie-react";
import { useReducedMotion } from "framer-motion";
import aboutCatRaw from "@/public/home/about-cat.json";
import { hex, remapColors, type ColorMap } from "./lottie-utils";
import { useIsDark } from "./use-is-dark";
import { useSectionReveal } from "./section-reveal-context";

const DARK_MAP: ColorMap = [
  [hex("#000000"), hex("#FFFFFF")],
  [hex("#19161C"), hex("#FFFFFF")],
  [hex("#FFFFFF"), hex("#3744FF")],
  [hex("#BB9AFF"), hex("#A473FF")],
];

export function AboutCat({ className }: { className?: string }) {
  const dark = useIsDark();
  const reducedMotion = useReducedMotion();
  // Backstory is a scroll-gated (non-immediate) SectionReveal on the homepage,
  // so this defers the Lottie mount until the section actually scrolls into
  // view instead of paying its init cost on initial page load.
  const { active } = useSectionReveal();


  // Bundled at build time (content-hashed by Next automatically) instead of
  // fetched at runtime with a hand-maintained ?v=N cache-busting param.
  const animationData = useMemo(
    () => (dark ? (remapColors(aboutCatRaw, DARK_MAP) as object) : aboutCatRaw),
    [dark],
  );

  return (
    <div className={className}>
      {active && (
        <Lottie
          animationData={animationData}
          loop
          autoplay={!reducedMotion}
          style={{ width: "100%", height: "100%" }}
        />
      )}
    </div>
  );
}
