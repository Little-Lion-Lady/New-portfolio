"use client";

import { useMemo } from "react";
import Lottie from "lottie-react";
import { useReducedMotion } from "framer-motion";
import meCatRaw from "@/public/home/me-cat.json";
import { hex, remapColors, type ColorMap } from "./lottie-utils";
import { useIsDark } from "./use-is-dark";

const DARK_MAP: ColorMap = [
  [hex("#000000"), hex("#FFFFFF")],
  [hex("#19161C"), hex("#FFFFFF")],
  [hex("#FFFFFF"), hex("#3744FF")],
  [hex("#BB9AFF"), hex("#A473FF")],
];

export function MeCat({ className }: { className?: string }) {
  const dark = useIsDark();
  const reducedMotion = useReducedMotion();


  // Bundled at build time (content-hashed by Next automatically) instead of
  // fetched at runtime with a hand-maintained ?v=N cache-busting param.
  const animationData = useMemo(
    () => (dark ? (remapColors(meCatRaw, DARK_MAP) as object) : meCatRaw),
    [dark],
  );

  return (
    <div className={className}>
      <Lottie
        animationData={animationData}
        loop
        autoplay={!reducedMotion}
        style={{ width: "100%", height: "auto" }}
      />
    </div>
  );
}
