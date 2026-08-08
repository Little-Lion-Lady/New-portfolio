"use client";

import { useState } from "react";
import { useReducedMotion } from "framer-motion";
import { GlassImage } from "./work-image";

const CARD_CLASS = "h-[300px] w-[210px] shrink-0 md:h-[600px] md:w-[420px] lg:h-[600px] lg:w-[420px]";

function Card({ name }: { name: string }) {
  return (
    <GlassImage
      src={`/home/about/${name}.jpg`}
      alt="Original artwork by Maryna Babych"
      className={CARD_CLASS}
    />
  );
}

// Full-bleed, edge-to-edge past <main>'s own px-md/xl/5xl gutter — see the
// about page comment this replaced. Bleeds via a matching negative margin.
const BLEED_CLASS = "-mx-md md:-mx-xl lg:-mx-5xl";

// Continuous right-to-left loop. Reduced-motion users get the original
// manually-scrollable single-set strip back instead — freezing the animated
// (duplicated, overflow-hidden) track would otherwise make artwork 2-7
// unreachable for them, since there'd be no scroll and no motion to reveal it.
export function ArtworkStrip({ names }: { names: string[] }) {
  const reducedMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);

  if (reducedMotion) {
    return (
      <div className={BLEED_CLASS}>
        <div className="-my-md flex w-full gap-sm overflow-x-auto py-md md:gap-lg lg:gap-xl">
          {names.map((name) => (
            <Card key={name} name={name} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`${BLEED_CLASS} overflow-hidden`}>
      <div
        className="artwork-marquee-track -my-md flex w-max gap-sm py-md md:gap-lg lg:gap-xl"
        style={{ animationPlayState: paused ? "paused" : "running" }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {names.map((name) => (
          <Card key={`${name}-a`} name={name} />
        ))}
        {names.map((name) => (
          <Card key={`${name}-b`} name={name} />
        ))}
      </div>
    </div>
  );
}
