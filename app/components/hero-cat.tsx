"use client";

import { useMemo } from "react";
import Lottie from "lottie-react";
import { useReducedMotion } from "framer-motion";
import heroCatRaw from "@/public/home/hero-cat.json";
import { hex, remapColors, type ColorMap } from "./lottie-utils";
import { useIsDark } from "./use-is-dark";

const DARK_MAP: ColorMap = [
  [hex("#000000"), hex("#FFFFFF")],
  [hex("#565656"), hex("#8AA7FF")],
  [hex("#FFFFFF"), hex("#3744FF")],
  [hex("#BB9AFF"), hex("#A473FF")],
];

export function HeroCat({ className }: { className?: string }) {
  const dark = useIsDark();
  const reducedMotion = useReducedMotion();


  // Bundled at build time (content-hashed by Next automatically) instead of
  // fetched at runtime with a hand-maintained ?v=N cache-busting param.
  const animationData = useMemo(
    () => (dark ? (remapColors(heroCatRaw, DARK_MAP) as object) : heroCatRaw),
    [dark],
  );

  return (
    <Lottie
      animationData={animationData}
      loop
      autoplay={!reducedMotion}
      className={className}
      style={{ aspectRatio: "1632/818", height: "auto" }}
    />
  );
}
