"use client";

import { useReducedMotion } from "framer-motion";
import { GlassImage } from "./work-image";

// Figma "Image wrapper" sizes for the §03 strip: 210×340 mobile, 420×600 from tablet up.
const CARD_CLASS = "h-[340px] w-[210px] shrink-0 md:h-[600px] md:w-[420px] lg:h-[600px] lg:w-[420px]";

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
const BLEED_CLASS = "-mx-md md:-mx-3xl lg:-mx-3xl";

// Continuous right-to-left loop. Reduced-motion users get the original
// manually-scrollable single-set strip back instead — freezing the animated
// (duplicated, overflow-hidden) track would otherwise make artwork 2-7
// unreachable for them, since there'd be no scroll and no motion to reveal it.
export function ArtworkStrip({ names }: { names: string[] }) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return (
      <div className={BLEED_CLASS}>
        <div className="-my-md flex w-full gap-sm overflow-x-auto py-md md:gap-md lg:gap-xl">
          {names.map((name) => (
            <Card key={name} name={name} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`${BLEED_CLASS} -my-md overflow-hidden py-md`}>
      <div className="artwork-marquee-track flex w-max gap-sm md:gap-md lg:gap-xl">
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
