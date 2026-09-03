import { GlassFrame, GlassImage } from "./work-image";
import { HighlightPill } from "./tag";
import { MeCat } from "./dynamic-visuals";

// Figma "02 Biography" image container — 1144:18610 (mobile), 1523:63351
// (tablet), 1144:9241 (desktop).
//
// Two equal-width cards side by side: gap = responsive 2xs (6 / 8 / 12), radius
// size-lg on mobile and size-xl from tablet up (one step larger than the shared
// Image wrapper default, hence the radiusClassName override). Container height
// is Figma's own: 267.319 / 384 / 496.967.
//
// The right-hand card is not a photo — it's a flat gradient with the cat drawn
// over it, so it's built from the tokens rather than the baked
// ABOUT2.jpg/ABOUT2_Dark.jpg pair. Each mode gets its own stops, sampled from
// those two exports: blue-200 → red-light-200 in light, blue-600 →
// red-light-950 in dark.
//
// Tablet is the only step where the two cards don't share a height: both are
// 300px tall inside a 384px container, with the right card bottom-aligned so it
// sits 84px lower than the left.
//
// Each card carries a HighlightPill in its top-left corner — the same pill the
// Basis process columns use for "Chosen" — inset by spacing-sm (12) on both
// axes. The pill sits inside the clipped inner box, so it rounds with the card.
const CARD_RADIUS = "rounded-lg md:rounded-xl";
const CARD_HEIGHT = "h-full md:h-[300px] lg:h-full";
const PILL_POSITION = "pointer-events-none absolute left-sm top-sm z-10";

export function BioCollage() {
  return (
    <div className="relative flex h-[267.319px] w-full items-stretch gap-r-2xs md:h-[384px] lg:h-[496.967px]">
      <GlassImage
        src="/home/about/ME1.JPG"
        alt="Maryna Babych"
        radiusClassName={CARD_RADIUS}
        sizes="(min-width: 1400px) 320px, (min-width: 768px) 200px, 50vw"
        className={`flex-1 self-start ${CARD_HEIGHT}`}
      >
        <HighlightPill tone="muted" className={PILL_POSITION}>Outside me</HighlightPill>
      </GlassImage>

      {/* Bottom-aligned on tablet; full height everywhere else. */}
      <div className="flex flex-1 flex-col justify-end">
        <GlassFrame
          radiusClassName={CARD_RADIUS}
          className={CARD_HEIGHT}
          innerClassName="bg-gradient-to-b from-[var(--colour-blue-200)] to-[var(--colour-red-light-200)] dark:from-[var(--colour-blue-600)] dark:to-[var(--colour-red-light-950)]"
        >
          <HighlightPill tone="muted" className={PILL_POSITION}>Inner me</HighlightPill>
          {/* Cat overlay — a child of the card, so it is positioned and clipped
              by the frame rather than floating over the whole collage.
              It is given a box with BOTH a width and a height (as a share of
              the card) and `fit`, so the animation is contained by that box:
              its height is whatever the box allows, never whatever the export's
              own ratio dictates. Widths are Figma's painted sizes; the height
              caps are the slack the -7° rotation needs for its bounding box to
              stay inside the frame. Figma leaves the cat upright on mobile.
              The box is centred vertically at every breakpoint — the height
              caps shrink it, so it stays optically centred rather than riding
              lower as the card grows. */}
          <div className="pointer-events-none absolute left-[51%] top-1/2 h-[80%] w-[94%] -translate-x-1/2 -translate-y-1/2 md:left-1/2 md:h-[70%] md:w-[86%] lg:h-[60%] lg:w-[77%]">
            <div className="h-full w-full md:-rotate-7">
              <MeCat fit className="h-full w-full" />
            </div>
          </div>
        </GlassFrame>
      </div>
    </div>
  );
}
