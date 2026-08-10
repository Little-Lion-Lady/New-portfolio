import Image from "next/image";
import { GlassImage } from "./work-image";

// Figma image collages for §02 (100:6005), §04 (100:6193), §06 (495:3594).
// Corner radius follows Figma: main image blocks are sharp; §06 phone frames are rounded.

const COVID_ALT = "NZ COVID Tracer app screen";

// §02 Approach — a phone screen beside a wide screenshot. Stacks on mobile.
export function ApproachMedia() {
  return (
    <div className="flex flex-col gap-xs md:flex-row md:items-stretch md:gap-md lg:gap-lg">
      {/* MOH4 + MOH5 share one row height: flex-grow proportional to each
          image's own ratio (flex-basis 0) + matching frameAspectRatio makes
          the browser resolve a common height and correct, uncropped widths. */}
      <GlassImage
        src="/home/work/covid-tracer/MOH4.jpg"
        alt={COVID_ALT}
        frameAspectRatio="260/460"
        className="mx-auto w-[165px] shrink-0 md:mx-0 md:w-auto md:shrink md:flex-[0.5652]"
      />
      <GlassImage
        src="/home/work/covid-tracer/MOH5.jpg"
        alt={COVID_ALT}
        frameAspectRatio="1256/460"
        className="w-full md:w-auto md:flex-[2.7304]"
      />
    </div>
  );
}

// §04 Design — top-wide shot leading into the big-image-plus-stack row below.
export function FlowDiagram() {
  return (
    <GlassImage
      src="/home/work/covid-tracer/MOH6.jpg"
      alt={COVID_ALT}
      aspectRatio="1560/513"
      className="w-full"
    />
  );
}

// §04 Design — big image beside a stacked pair, then a wide full-width shot below.
export function DesignMedia() {
  return (
    <div className="flex flex-col gap-xs md:gap-md lg:gap-xl">
      <div className="flex gap-xs md:gap-md lg:gap-lg">
        <GlassImage
          src="/home/work/covid-tracer/MOH7.jpg"
          alt={COVID_ALT}
          aspectRatio="873/969"
          className="flex-[5] self-start lg:flex-1"
        />
        <div className="flex flex-[4] flex-col gap-xs md:gap-md lg:flex-1 lg:gap-xl">
          <GlassImage
            src="/home/work/covid-tracer/MOH8.jpg"
            alt={COVID_ALT}
            className="h-[150px] flex-1 md:h-[192px] lg:h-[500px]"
          />
          <GlassImage
            src="/home/work/covid-tracer/MOH9.jpg"
            alt={COVID_ALT}
            className="h-[150px] flex-1 md:h-[192px] lg:h-[500px]"
          />
        </div>
      </div>
      <GlassImage
        src="/home/work/covid-tracer/MOH10.jpg"
        alt={COVID_ALT}
        aspectRatio="1560/768"
        className="w-full"
      />
    </div>
  );
}

// §06 Outcome — two rows: pair of wide shots, then phone frames + wide shot.
// (A third image, the section's "headline" shot, is inline in page.tsx.)
export function OutcomeMedia() {
  return (
    <div className="flex flex-col gap-xs md:gap-md lg:gap-xl">
      {/* Row 1 — stacks through tablet, side-by-side only at desktop */}
      <div className="flex flex-col gap-xs md:gap-md lg:flex-row lg:items-stretch lg:gap-lg">
        {/* MOH12 + MOH13 share one row height from lg up — same justified-row
            technique as MOH4/MOH5 above. */}
        <GlassImage
          src="/home/work/covid-tracer/MOH12.jpg"
          alt={COVID_ALT}
          frameAspectRatio="647/420"
          className="w-full lg:w-auto lg:flex-[1.5405]"
        />
        <GlassImage
          src="/home/work/covid-tracer/MOH13.jpg"
          alt={COVID_ALT}
          frameAspectRatio="884/420"
          className="w-full lg:w-auto lg:flex-[2.1048]"
        />
      </div>
      {/* Row 2 — MOH14, MOH15 and MOH16 all share one row height from md up.
          Nesting MOH14+MOH15 in their own sub-row and stretching that whole
          sub-row against MOH16 doesn't resolve correctly: the outer stretch
          gives the sub-row a height taken from its own aspect-ratio, but
          when that gets rounded up to match MOH16's taller hypothetical
          height, the sub-row's *own* children re-stretch to the new (taller)
          height and overflow the sub-row's already-fixed width — MOH15 spills
          under MOH16. A flat, single-level row (all three as direct
          flex-basis:0 siblings) resolves one consistent height for all three
          at once, same as the MOH4/MOH5 and MOH12/MOH13 pairs above — so md+
          uses that flat row, and only mobile (where MOH14/MOH15 must stay
          paired above MOH16) keeps the nested layout. */}
      <div className="flex flex-col gap-xs md:hidden">
        <div className="flex gap-xs">
          <GlassImage
            src="/home/work/covid-tracer/MOH14.jpg"
            alt={COVID_ALT}
            frameAspectRatio="226/457"
            className="flex-[0.4945]"
          />
          <GlassImage
            src="/home/work/covid-tracer/MOH15.jpg"
            alt={COVID_ALT}
            frameAspectRatio="226/458"
            className="flex-[0.4934]"
          />
        </div>
        <GlassImage
          src="/home/work/covid-tracer/MOH16.jpg"
          alt={COVID_ALT}
          frameAspectRatio="1013/470"
          objectPosition="left"
          className="w-full"
        />
      </div>
      <div className="hidden md:flex md:items-stretch md:gap-md lg:gap-lg">
        <GlassImage
          src="/home/work/covid-tracer/MOH14.jpg"
          alt={COVID_ALT}
          frameAspectRatio="226/457"
          className="flex-[0.4945]"
        />
        <GlassImage
          src="/home/work/covid-tracer/MOH15.jpg"
          alt={COVID_ALT}
          frameAspectRatio="226/458"
          className="flex-[0.4934]"
        />
        <GlassImage
          src="/home/work/covid-tracer/MOH16.jpg"
          alt={COVID_ALT}
          frameAspectRatio="1013/470"
          objectPosition="left"
          className="flex-[2.1553]"
        />
      </div>
    </div>
  );
}

/* ── BASIS case study media blocks ──────────────────────────────────────── */

const BASIS_ALT = "Basis home app screen";

// §03 Research — a stacked column of 3 result shots beside a wide detail image.
// Column stacks above the detail image through tablet, sits beside it only from desktop up.
export function ResearchMedia() {
  return (
    <div className="flex flex-col gap-xs lg:flex-row lg:items-stretch lg:gap-lg">
      <div className="flex flex-col gap-3xs lg:w-1/3 lg:gap-xs">
        <GlassImage src="/home/work/basis/BS4.jpg" alt={BASIS_ALT} className="h-[158px] w-full lg:h-auto lg:flex-1" />
        <GlassImage src="/home/work/basis/BS5.jpg" alt={BASIS_ALT} className="h-[158px] w-full lg:h-auto lg:flex-1" />
        <GlassImage src="/home/work/basis/BS6.jpg" alt={BASIS_ALT} className="h-[158px] w-full lg:h-auto lg:flex-1" />
      </div>
      {/* 931×601 is BS7's real ratio — aspect-[931/601] through tablet
          (matching lg's already-correct value) shows the whole photo
          instead of cropping to a fixed 227px. */}
      <GlassImage
        src="/home/work/basis/BS7.jpg"
        alt={BASIS_ALT}
        className="aspect-[931/601] w-full lg:aspect-[931/601] lg:h-auto lg:w-2/3 lg:flex-none"
      />
    </div>
  );
}

// §05 Process — a wide flow diagram above a taller detail shot.
export function ProcessMedia() {
  return (
    <div className="flex flex-col gap-xs lg:gap-lg">
      <GlassImage src="/home/work/basis/BS8.jpg" alt={BASIS_ALT} className="aspect-[3168/1235] w-full" />
      {/* BS9's real ratio is 1600×1395 — aspect-[1600/1395] replaces the
          mobile/tablet fixed heights (306/524px) that were cropping it.
          Desktop keeps its own lg:h-[1414px]: an explicit height still wins
          over aspect-ratio for that axis, so lg is unaffected. */}
      <GlassImage src="/home/work/basis/BS9.jpg" alt={BASIS_ALT} className="aspect-[1600/1395] w-full lg:h-[1414px]" />
    </div>
  );
}

// §06 Solution design — row of two shots.
export function SolutionMedia() {
  return (
    <div className="flex flex-col gap-xs">
      {/* BS12 (near-square, 1866×1812) and BS13 (wide, 1600×1092) share one
          row height from md up via the justified-row technique: flex-basis:0
          + flex-grow proportional to each image's own ratio, with a matching
          frameAspectRatio on each. A fixed width on BS12 (the old approach)
          stretched BS13's outer frame to match BS12's tall height while its
          inner photo only filled its own shorter aspect-derived height,
          leaving BS13 visibly padded with empty space — flex-grow removes
          that gap by giving both a shared height and proportional width. */}
      <div className="flex flex-col gap-xs lg:flex-row lg:items-stretch lg:gap-lg">
        <GlassImage
          src="/home/work/basis/BS12.jpg"
          alt={BASIS_ALT}
          frameAspectRatio="1866/1812"
          className="w-full lg:w-auto lg:flex-[1.0298]"
        />
        <GlassImage
          src="/home/work/basis/BS13.jpg"
          alt={BASIS_ALT}
          frameAspectRatio="1600/1092"
          className="w-full lg:w-auto lg:flex-[1.4652]"
        />
      </div>
    </div>
  );
}

// §06 Prototype testing — a strip of four screenshots, with two participant
// photos (plain rounded images, no glass frame). Below the strip on mobile
// (side by side), pinned to the right of it from tablet up.
export function PrototypeMedia() {
  return (
    <div className="flex flex-col gap-xs lg:flex-row lg:items-end lg:justify-between lg:gap-2xl">
      {/* BS14–BS17 are all effectively the same 219×478 ratio, so a single
          aspectRatio (inner-box, no-crop) per image plus width-only classes
          is enough — height always derives correctly from whatever width
          each breakpoint's layout resolves to. Always a single row of four
          (w-1/4 each) at every breakpoint — no 2×2 grid fallback. lg:flex-1
          is needed once the outer container becomes lg:flex-row: without it
          this div has no width source of its own (children are all
          percentage-based, so they can't contribute one), and collapses to 0. */}
      <div className="flex gap-xs overflow-hidden lg:flex-1">
        <GlassImage src="/home/work/basis/BS14.jpg" alt={BASIS_ALT} aspectRatio="219/478" className="w-1/4" />
        <GlassImage src="/home/work/basis/BS15.jpg" alt={BASIS_ALT} aspectRatio="219/478" className="w-1/4" />
        <GlassImage src="/home/work/basis/BS16.jpg" alt={BASIS_ALT} aspectRatio="219/478" className="w-1/4" />
        <GlassImage src="/home/work/basis/BS17.jpg" alt={BASIS_ALT} aspectRatio="219/477" className="w-1/4" />
      </div>
      {/* max-w-[190px] on mobile/tablet caps each participant photo's width;
          lg's own layout (fixed 243px column, flex-none) needs it
          cancelled, but lg:max-w-none didn't win the cascade against the
          arbitrary mobile value (computed max-width stuck at 0px) — an
          arbitrary lg value of its own avoids that named-vs-arbitrary-value
          ordering conflict. */}
      <div className="flex justify-center gap-xs lg:w-[243px] lg:shrink-0 lg:flex-col lg:gap-[10px]">
        <div className="relative max-w-[190px] flex-1 aspect-[243/160] overflow-hidden rounded-lg lg:aspect-auto lg:h-[160px] lg:max-w-[400px] lg:flex-none">
          <Image src="/home/work/basis/BS18.jpg" alt="Basis prototype testing participant" fill quality={100} sizes="243px" className="object-cover" />
        </div>
        <div className="relative max-w-[190px] flex-1 aspect-[243/160] overflow-hidden rounded-lg lg:aspect-auto lg:h-[160px] lg:max-w-[400px] lg:flex-none">
          <Image src="/home/work/basis/BS19.jpg" alt="Basis prototype testing participant" fill quality={100} sizes="243px" className="object-cover" />
        </div>
      </div>
    </div>
  );
}

// §07 Outcome — a hero shot (BS20) above the screenshot strip. Strip is a
// single horizontal scroll row on mobile; from tablet up it splits into two
// centred, non-scrolling stacked rows (cards may bleed past the content edge
// since row 2's 5 cards don't fit the content width even at desktop).
const OUTCOME_ROW1 = ["BS21", "BS22", "BS23", "BS24"];
const OUTCOME_ROW2 = ["BS25", "BS26", "BS27", "BS28", "BS29"];

// All nine strip photos are ~390×844 (BS29 is 390×853) — near-identical
// ratios, so independent per-image aspectRatio (width-driven, no crop)
// naturally gives matching heights too, with no justified-row trick needed.
const OUTCOME_STRIP_RATIO: Record<string, string> = {
  BS21: "390/844",
  BS22: "390/844",
  BS23: "390/844",
  BS24: "390/844",
  BS25: "390/844",
  BS26: "390/844",
  BS27: "390/844",
  BS28: "390/844",
  BS29: "390/853",
};

function OutcomeStripImage({ name }: { name: string }) {
  return (
    <GlassImage
      src={`/home/work/basis/${name}.jpg`}
      alt={BASIS_ALT}
      aspectRatio={OUTCOME_STRIP_RATIO[name]}
      className="w-[220px] shrink-0 md:w-[281px] lg:w-[332px]"
    />
  );
}

export function BasisOutcomeMedia() {
  return (
    <div className="flex flex-col gap-xl md:gap-2xl">
      <GlassImage src="/home/work/basis/BS20.jpg" alt={BASIS_ALT} className="h-[198px] w-full md:h-[331px] lg:h-[540px]" />
      {/* Mobile — single continuous scroll strip, bled full-bleed past
          <main>'s own px-md gutter (-mx-md) so cards aren't cropped at the
          page's edges and can scroll all the way to the true screen edge —
          same technique as ArtworkStrip's BLEED_CLASS. overflow-x-auto
          forces overflow-y to auto too (can't have one axis scrollable and
          the other visible), which clips each card's box-shadow at the top/
          bottom edge — py-sm gives the shadow's ~10px blur room to render
          inside the scroll box instead of being cut off. */}
      <div className="-mx-md flex gap-xs overflow-x-auto py-sm md:hidden">
        {[...OUTCOME_ROW1, ...OUTCOME_ROW2].map((name) => (
          <OutcomeStripImage key={name} name={name} />
        ))}
      </div>
      {/* Tablet/desktop — two stacked rows, centred, no horizontal scroll */}
      <div className="hidden flex-col items-center gap-xs md:flex md:gap-lg">
        <div className="flex justify-center gap-xs md:gap-lg">
          {OUTCOME_ROW1.map((name) => (
            <OutcomeStripImage key={name} name={name} />
          ))}
        </div>
        <div className="flex justify-center gap-xs md:gap-lg">
          {OUTCOME_ROW2.map((name) => (
            <OutcomeStripImage key={name} name={name} />
          ))}
        </div>
      </div>
    </div>
  );
}
