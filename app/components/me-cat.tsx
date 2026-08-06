"use client";

import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import { hex, remapColors, isDarkTheme, type ColorMap } from "./lottie-utils";

const DARK_MAP: ColorMap = [
  [hex("#000000"), hex("#BAB3BC")],
  [hex("#19161C"), hex("#BAB3BC")],
  [hex("#FFFFFF"), hex("#3744FF")],
  [hex("#BA9AFF"), hex("#0B0A4A")],
  [hex("#FFE600"), hex("#FFE600")],
];

export function MeCat({ className }: { className?: string }) {
  const [rawData, setRawData] = useState<object | null>(null);
  const [dark, setDark] = useState(isDarkTheme);

  useEffect(() => {
    fetch("/home/me-cat.json?v=4")
      .then((r) => r.json())
      .then(setRawData)
      .catch((err) => console.error("[MeCat] Failed to load animation:", err));
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
    <div className={className}>
      <Lottie
        animationData={animationData}
        loop
        style={{ width: "100%", height: "auto" }}
      />
    </div>
  );
}
