"use client";

/*
  AboutLottie
  ───────────
  Renders the about-section Lottie animation (about-animation.json).
  - Respects prefers-reduced-motion: pauses on first frame when motion is reduced.
  - Transparent background — purely decorative, sits beside the "02" label.
*/

import Lottie from "lottie-react";
import { useReducedMotion } from "framer-motion";
import aboutAnimation from "../../public/about-animation.json";

export function AboutLottie() {
  const reducedMotion = useReducedMotion();

  return (
    <Lottie
      animationData={aboutAnimation}
      loop={!reducedMotion}
      autoplay={!reducedMotion}
      style={{ width: "100%", height: "100%" }}
      aria-hidden="true"
    />
  );
}
