"use client";

import { useReducedMotion } from "framer-motion";
import { GlassImage } from "./work-image";
import { useNearViewport } from "./use-near-viewport";

// Figma "Image wrapper" sizes for the §03 strip: 210×340 mobile, 420×600 from tablet up.
const CARD_CLASS = "h-[340px] w-[210px] shrink-0 md:h-[600px] md:w-[420px] lg:h-[600px] lg:w-[420px]";

/*
  Card pitch, as a trailing margin rather than flex `gap` — the same mechanism
  <ImageCarousel> uses, and for the same reason.

  `gap` puts n-1 gaps in a set of n. On the doubled marquee track that makes
  half the track `n cards + (n - 0.5) gaps`, while one full set plus its own
  trailing gap is `n cards + n gaps`. Translating exactly -50% therefore lands
  half a gap short of where the duplicate set begins, and the loop shifts by
  that much every cycle. A per-card margin makes the two halves exactly equal,
  so the seam holds.
*/
const CARD_MARGIN = "mr-xs md:mr-sm lg:mr-lg";

function Card({
  name,
  margin = false,
  loading,
}: {
  name: string;
  margin?: boolean;
  /*
    Set by the strip, not per card. Lazy loading cannot work card-by-card here
    (this is a translated marquee track, and the cards past the viewport's right
    edge never report an intersection — ART6 and ART7 stayed blank every time
    the loop carried them into view), so the whole strip releases at once when
    its un-translated wrapper nears the viewport. See ./use-near-viewport.
  */
  loading: "eager" | "lazy";
}) {
  return (
    <GlassImage
      src={`/home/about/${name}.jpg`}
      alt="Original artwork by Maryna Babych"
      loading={loading}
      /* Low priority: even once released, the strip sits below the bio collage
         and should not compete with it. */
      fetchPriority="low"
      className={margin ? `${CARD_CLASS} ${CARD_MARGIN}` : CARD_CLASS}
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
  const [stripRef, stripNear] = useNearViewport<HTMLDivElement>();
  const loading = stripNear ? "eager" : "lazy";

  if (reducedMotion) {
    // A single, non-translated set — no seam to hold, so plain flex `gap` is
    // correct here and avoids a stray trailing margin at the scroll end.
    return (
      <div ref={stripRef} className={BLEED_CLASS}>
        <div className="-my-md flex w-full gap-xs overflow-x-auto py-md md:gap-sm lg:gap-lg">
          {names.map((name) => (
            <Card key={name} name={name} loading={loading} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={stripRef} className={`${BLEED_CLASS} -my-md overflow-hidden py-md`}>
      <div className="artwork-marquee-track flex w-max">
        {names.map((name) => (
          <Card key={`${name}-a`} name={name} margin loading={loading} />
        ))}
        {names.map((name) => (
          <Card key={`${name}-b`} name={name} margin loading={loading} />
        ))}
      </div>
    </div>
  );
}
