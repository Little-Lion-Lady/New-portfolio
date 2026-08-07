"use client";

import { useEffect, useMemo, useState } from "react";
import Lottie from "lottie-react";
import { useReducedMotion } from "framer-motion";
import meCatRaw from "@/public/home/me-cat.json";
import { hex, remapColors, isDarkTheme, type ColorMap } from "./lottie-utils";

const DARK_MAP: ColorMap = [
  [hex("#000000"), hex("#BAB3BC")],
  [hex("#19161C"), hex("#BAB3BC")],
  [hex("#FFFFFF"), hex("#3744FF")],
  [hex("#BA9AFF"), hex("#0B0A4A")],
  [hex("#FFE600"), hex("#FFE600")],
];

export function MeCat({ className }: { className?: string }) {
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
