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
  decorative = false,
  loading,
}: {
  name: string;
  margin?: boolean;
  /*
    The marquee renders the set twice so the loop has no seam. Only the first
    set is real content; the second is the same artwork again, so it is hidden
    from assistive tech rather than announced a second time.
  */
  decorative?: boolean;
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
      alt={ART_ALT[name] ?? "Original artwork by Maryna Babych"}
      ariaHidden={decorative}
      loading={loading}
      /* Low priority: even once released, the strip sits below the bio collage
         and should not compete with it. */
      fetchPriority="low"
      className={margin ? `${CARD_CLASS} ${CARD_MARGIN}` : CARD_CLASS}
    />
  );
}

// Full-bleed, edge-to-edge past <main>'s own gutter. Sized to the viewport
// rather than to the page shell (see `.rail-bleed` in globals.css): a negative
// margin matching the gutter stops at the shell's 1440px cap, which left the
// strip cropped inboard with dead space either side on a wide screen.
// One description per piece. A single shared string meant the strip announced
// the same seven words fourteen times — once per card, twice per artwork,
// because the marquee renders the set twice. The duplicate set is now hidden
// from assistive tech (see `decorative` below), and each piece describes itself.
const ART_ALT: Record<string, string> = {
  ART1: "Original artwork: a pale textured figure against a flat red ground",
  ART2: "Original artwork: a glowing figure at the centre of a dark storm",
  ART3: "Original artwork: a black ink form unfurling across white paper",
  ART4: "Original artwork: a framed pencil drawing of a cat, resting against a wall",
  ART5: "Original artwork: a stylised portrait cut through with red brushstrokes",
  ART6: "Original artwork: a black cat with red eyes against a red ground",
  ART7: "Original artwork: a watercolour bouquet of purple and pink flowers",
};

const BLEED_CLASS = "rail-bleed";

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
          <Card key={`${name}-b`} name={name} margin decorative loading={loading} />
        ))}
      </div>
    </div>
  );
}
