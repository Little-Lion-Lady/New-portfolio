"use client";

/*
  HeroLottie
  ──────────
  Renders the hero Lottie animation (Scene-1.json).
  - Respects prefers-reduced-motion: pauses on first frame when motion is reduced.
  - Transparent background — the animation's own red/orange strokes sit directly
    on the page background without any blend-mode manipulation.
  - Swaps the "-tap-" text fill from black → white in dark mode so it remains
    visible. All black [0,0,0] fills in the animation are text glyphs; the
    illustration strokes are red/orange so the replacement is safe.
*/

import Lottie from "lottie-react";
import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import heroAnimation from "../../public/hero-animation.json";

function withTextColor(dark: boolean) {
  const fill = dark ? [1, 1, 1] : [0, 0, 0];
  const raw = JSON.stringify(heroAnimation);
  // Replace every occurrence of the black fill [0,0,0] used on text glyphs.
  // The pattern "k\":[0,0,0]" is unique to the text layers; illustration
  // strokes use red [0.863,0,0] and orange [0.941,0.451,0].
  const patched = raw.replace(/"k":\[0,0,0\]/g, `"k":[${fill.join(",")}]`);
  return JSON.parse(patched);
}

export function HeroLottie() {
  const reducedMotion = useReducedMotion();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const read = () => setIsDark(root.getAttribute("data-theme") === "dark");
    read();
    const observer = new MutationObserver(read);
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  return (
    <Lottie
      animationData={withTextColor(isDark)}
      loop={!reducedMotion}
      autoplay={!reducedMotion}
      style={{ width: "100%", height: "100%" }}
      aria-hidden="true"
    />
  );
}
