"use client";

import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import { hex, remapColors, isDarkTheme, type ColorMap } from "./lottie-utils";

const DARK_MAP: ColorMap = [
  [hex("#000000"), hex("#BAB3BC")],
  [hex("#565656"), hex("#8AA7FF")],
  [hex("#BB9AFF"), hex("#0B0A4A")],
  [hex("#FFFFFF"), hex("#3744FF")],
  [hex("#FF1539"), hex("#150DF7")],
  [hex("#FF0000"), hex("#150DF7")],
];

export function HeroCat({ className }: { className?: string }) {
  const [rawData, setRawData] = useState<object | null>(null);
  const [dark, setDark] = useState(isDarkTheme);

  useEffect(() => {
    fetch("/home/hero-cat.json?v=8")
      .then((r) => r.json())
      .then(setRawData)
      .catch((err) => console.error("[HeroCat] Failed to load animation:", err));
  }, []);

  useEffect(() => {
    setDark(isDarkTheme());
    const observer = new MutationObserver(() => setDark(isDarkTheme()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  const animationData = rawData
    ? dark
      ? (remapColors(rawData, DARK_MAP) as object)
      : rawData
    : null;

  if (!animationData) return null;

  return (
    <Lottie
      animationData={animationData}
      loop
      className={className}
      style={{ aspectRatio: "1503/818", height: "auto" }}
    />
  );
}
