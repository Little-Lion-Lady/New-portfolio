"use client";

import { Button } from "./button";
import { CyclingWord } from "./cycling-word";
import { Star } from "./dynamic-visuals";
import { useIsDark } from "./use-is-dark";
import { useNearViewport } from "./use-near-viewport";

const CYCLING_WORDS = ["love", "hate", "AI", "coffee", "mischief", "claude", "care", "passion"];

// "get in touch" set in GeistSans SemiBold at -0.06em tracking, measured off
// the rendered glyphs: the lettering is 4.94x the font size wide, and its left
// edge sits 0.04em right of where the text starts. Sizing the type at
// 100cqw/4.94 therefore makes the lettering exactly as wide as its cell, and
// the -0.04em pull puts the "g" on the gutter rather than the "g"'s bearing.
// Re-measure both if the display face or the tracking changes.
const INK_WIDTH_PER_EM = 4.94;
const INK_LEFT_BEARING_EM = 0.04;

export function SiteFooter() {
  const dark = useIsDark();
  // Gates two things, both because the footer sits below every page's fold.
  // The hue animation, which repaints a large image every frame and has no
  // reason to run before the reader is near it — one-shot, so once started it
  // keeps running rather than stopping on scroll away. And the image's own
  // loading: left to next/image's default the wordmark lazy-loads on
  // intersection, which is too late for something this large and central, and
  // it paints blank into a box the layout has already reserved. Flipping to
  // eager a screen early is the same trick the rails use.
  const [wordmarkRef, wordmarkNear] = useNearViewport<HTMLDivElement>();

  return (
    <div className="relative w-full">
      {/* Desktop gains top padding where it previously had none. It also gives
          the star cluster somewhere to live: the stars hang off the wordmark
          cell's top edge, so with pt-0 they broke out above the footer and into
          the section before it. 7xl is just enough at this size: the cluster is
          104px tall but sits 8px lower for its own nudge, so it lands inside
          the 96px padding with nothing to spare. Reducing either this or the
          nudge puts the stars back over the section above.
          The padding belongs on the grid rather than the wordmark cell — inside
          the cell it would push the stars away from the lettering they sit on. */}
      <footer className="grid w-full grid-cols-4 gap-x-lg pt-4xl pb-4xs md:gap-y-xl md:pb-2xl dt:grid-cols-6 dt:gap-y-0 dt:pt-7xl dt:pb-4xl">
        {/* Wordmark — live text rather than an exported asset, so it stays sharp
            at any width and there is no export to keep the layout in step with.
            The glow is .wordmark in globals.css, rebuilt from the Figma spec.

            The cell is a container so the type can be sized from its width:
            100cqw/4.94 makes the lettering exactly fill it, and .wordmark-trim-*
            pulls the line box down to the letterforms so the cell's top edge is
            the cap line — which is what the stars hang off and what the socials
            padding measures from.

            The glow spills past the page gutters, which is the point and also
            why <footer> cannot clip its overflow. Nothing scrolls: html and body
            already clip horizontally. */}
        <div
          ref={wordmarkRef}
          className="relative col-start-1 col-span-4 row-start-1 dt:col-span-6 [container-type:inline-size]"
        >
          {/* Stars — anchored to the wordmark's top edge rather than the
              footer's. Pinned to the footer they sat on the lettering at wide
              widths: the desktop footer has no top padding, so "top-0" put them
              inside the type rather than above it. bottom-full lands the
              cluster's base on the cap line at every width.

              The box needs explicit dimensions for bottom-full to have a height
              to work from — the two stars inside are absolutely positioned, so
              it has no size of its own. Each size is the cluster's own extent:
              the offset of the lower-left star plus a star's width.

              The nudge left and down is a percentage of that box rather than a
              pixel value, so one pair of numbers holds at all three sizes
              instead of three pairs drifting apart. */}
          <div className="pointer-events-none absolute bottom-full right-0 h-[54px] w-[54px] -translate-x-[8%] translate-y-[8%] md:h-[78px] md:w-[94px] lg:h-[104px] lg:w-[114px]">
            <Star
              variant={4}
              className="absolute right-[26px] top-[6px] w-7 md:right-[46px] md:top-0 md:w-12 lg:!right-[50px] lg:!w-16"
            />
            <Star
              variant={4}
              className="absolute right-0 top-[26px] w-7 md:top-[30px] md:w-12 lg:!top-[40px] lg:!w-16"
            />
          </div>
          <p
            className={`wordmark wordmark-trim-getintouch lowercase ${wordmarkNear ? "wordmark-hue" : ""}`}
            style={{
              fontSize: `calc(100cqw / ${INK_WIDTH_PER_EM})`,
              marginLeft: `-${INK_LEFT_BEARING_EM}em`,
            }}
          >
            get in touch
          </p>
        </div>

        {/* Socials — vertical on mobile, horizontal md+. Indents to column 2 on
            desktop, where the design sets them in from the wordmark's edge.

            Desktop top padding is half Figma's 10xl (224px). Written as the
            token halved rather than a flat 112px, since there is no token at
            that step and the relationship to the spec is the point.

            Top padding steps 72 / 96 / 168 across the breakpoints. The desktop
            value is three quarters of Figma's 224, arrived at by eye rather
            than from the spec. It used to
            subtract the wordmark's glow padding, which an exported image carried
            as layout space; trimmed live text carries none, so these are the
            spacing tokens as written. */}
        <div className="col-start-1 col-span-4 row-start-2 flex flex-col items-start gap-xl pt-5xl md:flex-row md:items-center md:gap-6xl md:pt-7xl dt:col-start-2 dt:col-span-2 dt:self-start dt:pt-[calc(var(--spacing-10xl)*0.75)]">
          <Button variant="link" label="LinkedIn" href="https://www.linkedin.com/in/marynababych/" target="_blank" rel="noopener noreferrer" />
          <Button variant="link" label="Email" href="mailto:maryna.babych@gmail.com" target="_blank" rel="noopener noreferrer" />
        </div>

        {/* Made with love — its own row until desktop, where it moves up beside
            the socials and shares their baseline: self-end against a row whose
            height the socials' tall top padding sets.

            The nudge is CyclingWord's doing. It pads itself 1em top and bottom
            so its mask has room to fade words in and out, which makes this <p>
            3.2em tall while the text is a single line inside it — bottom-align
            the box and the text lands ~1em high (measured: 42px at the 44px
            desktop size). Translating rather than using a margin keeps that
            correction out of the row's height, and the space it moves into is
            the padding's own, so nothing below it shifts. */}
        <div className="col-start-1 col-span-4 row-start-3 flex items-center dt:col-start-5 dt:col-span-2 dt:row-start-2 dt:self-end">
          <p className="whitespace-nowrap text-[32px] leading-[48px] text-text-tertiary md:text-[44px] md:leading-[1.1] dt:translate-y-[1em]">
            Made with <CyclingWord words={CYCLING_WORDS} className="text-text-primary-highlight" />
          </p>
        </div>

        {/* Colophon — left-aligned within its cell at every breakpoint, so on
            desktop it stacks directly under "Made with", not against the page
            edge as it did when it was the wordmark's signature. */}
        <div className="col-start-1 col-span-4 row-start-4 flex items-center dt:col-start-5 dt:col-span-2 dt:row-start-3 dt:pt-5xl">
          <p className="b-3xs text-text-tertiary md:b-sm lg:b-xs dt:b-sm">©2026_Maryna_Babych</p>
        </div>
      </footer>
    </div>
  );
}
