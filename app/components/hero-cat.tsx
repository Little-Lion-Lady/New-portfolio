"use client";

import { useEffect, useMemo, useState } from "react";
import Lottie from "lottie-react";
import { useReducedMotion } from "framer-motion";
import heroCatRaw from "@/public/home/hero-cat.json";
import { hex, remapColors, isDarkTheme, type ColorMap } from "./lottie-utils";

const DARK_MAP: ColorMap = [
  [hex("#000000"), hex("#FFFFFF")],
  [hex("#565656"), hex("#8AA7FF")],
  [hex("#FFFFFF"), hex("#3744FF")],
  [hex("#BB9AFF"), hex("#A473FF")],
];

export function HeroCat({ className }: { className?: string }) {
  const [dark, setDark] = useState(isDarkTheme);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    setDark(isDarkTheme());
    const observer = new MutationObserver(() => setDark(isDarkTheme()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

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
      style={{ aspectRatio: "1503/818", height: "auto" }}
    />
  );
}
