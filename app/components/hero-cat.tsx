"use client";

import { useEffect, useState } from "react";
import Lottie from "lottie-react";

export function HeroCat({ className }: { className?: string }) {
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    fetch("/home/hero-cat.json?v=8")
      .then((r) => r.json())
      .then(setAnimationData);
  }, []);

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
