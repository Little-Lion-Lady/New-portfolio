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

export function MeCat({ className, fit = false }: { className?: string; fit?: boolean }) {
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
        // `fit` fills the parent box in BOTH axes instead of deriving height
        // from the artwork's own ratio. lottie-web renders with the default
        // "xMidYMid meet", so the animation scales down to be *contained* by
        // that box — which lets a caller cap the height and know the cat can
        // never outgrow the frame it sits in, whatever ratio the export has.
        style={fit ? { width: "100%", height: "100%" } : { width: "100%", height: "auto" }}
      />
    </div>
  );
}
