"use client";

import { useEffect, useState } from "react";
import Lottie from "lottie-react";

// Lottie colors are normalized [r, g, b] in 0–1 range.
function hex(h: string): [number, number, number] {
  return [
    parseInt(h.slice(1, 3), 16) / 255,
    parseInt(h.slice(3, 5), 16) / 255,
    parseInt(h.slice(5, 7), 16) / 255,
  ];
}

const DARK_MAP: Array<[[number, number, number], [number, number, number]]> = [
  [hex("#000000"), hex("#BAB3BC")],
  [hex("#19161C"), hex("#BAB3BC")],
  [hex("#BB9AFF"), hex("#0B0A4A")],
  [hex("#FFFFFF"), hex("#3744FF")],
  [hex("#FF0000"), hex("#150DF7")],
];

function matchColor(
  arr: number[],
  src: [number, number, number],
  tol = 0.008,
): boolean {
  return (
    Math.abs(arr[0] - src[0]) < tol &&
    Math.abs(arr[1] - src[1]) < tol &&
    Math.abs(arr[2] - src[2]) < tol
  );
}

// Walks Lottie JSON and remaps color arrays found under 'c' keys.
// Handles both static (k: [r,g,b,a]) and animated (k: [{s:[r,g,b,a]}…]) forms.
function remapColors(obj: unknown): unknown {
  if (obj === null || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(remapColors);

  const node = obj as Record<string, unknown>;
  const out: Record<string, unknown> = {};

  for (const key of Object.keys(node)) {
    if (key === "c" && node[key] && typeof node[key] === "object") {
      // This is a color property — remap its k value
      out[key] = remapColorProp(node[key] as Record<string, unknown>);
    } else {
      out[key] = remapColors(node[key]);
    }
  }
  return out;
}

function remapColorProp(c: Record<string, unknown>): Record<string, unknown> {
  const animated = c["a"];
  const k = c["k"];

  if (!animated && Array.isArray(k) && k.length >= 3) {
    // Static color: k = [r, g, b] or [r, g, b, a]
    return { ...c, k: swapColor(k as number[]) };
  }

  if (animated && Array.isArray(k)) {
    // Animated: k = array of keyframes, each with s: [r, g, b, a]
    return {
      ...c,
      k: k.map((kf) => {
        if (kf && typeof kf === "object" && Array.isArray((kf as Record<string,unknown>)["s"])) {
          return { ...kf, s: swapColor((kf as Record<string, unknown>)["s"] as number[]) };
        }
        return kf;
      }),
    };
  }

  return c;
}

function swapColor(arr: number[]): number[] {
  for (const [src, dst] of DARK_MAP) {
    if (matchColor(arr, src)) {
      return arr.length === 4 ? [dst[0], dst[1], dst[2], arr[3]] : [...dst];
    }
  }
  return arr;
}

function isDarkTheme() {
  return document.documentElement.getAttribute("data-theme") === "dark";
}

export function AboutCat({ className }: { className?: string }) {
  const [rawData, setRawData] = useState<object | null>(null);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    fetch("/home/about-cat.json?v=2")
      .then((r) => r.json())
      .then(setRawData);
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
      ? (remapColors(rawData) as object)
      : rawData
    : null;

  if (!animationData) return null;

  return (
    <div className={className}>
      <Lottie
        animationData={animationData}
        loop
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
