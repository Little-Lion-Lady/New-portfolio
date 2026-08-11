"use client";

import { useEffect, useMemo, useState } from "react";
import Lottie from "lottie-react";
import { useReducedMotion } from "framer-motion";
import star1Raw from "@/public/home/star1.json";
import star2Raw from "@/public/home/star2.json";
import star3Raw from "@/public/home/star3.json";
import star4Raw from "@/public/home/star4.json";
import { hex, remapColors, isDarkTheme, type ColorMap } from "./lottie-utils";

const DARK_MAP: ColorMap = [
  [hex("#000000"), hex("#FFFFFF")],
  [hex("#1A171C"), hex("#FFFFFF")],
  [hex("#FFFFFF"), hex("#3744FF")],
];

const STARS = [star1Raw, star2Raw, star3Raw, star4Raw];

export function Star({
  variant = 1,
  className,
}: {
  variant?: 1 | 2 | 3 | 4;
  className?: string;
}) {
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

  const raw = STARS[variant - 1];
  const animationData = useMemo(
    () => (dark ? (remapColors(raw, DARK_MAP) as object) : raw),
    [dark, raw],
  );

  return (
    <Lottie
      animationData={animationData}
      loop
      autoplay={!reducedMotion}
      aria-hidden
      className={className}
      style={{ aspectRatio: "1/1", height: "auto" }}
    />
  );
}
