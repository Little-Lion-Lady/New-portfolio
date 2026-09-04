"use client";

import Image from "next/image";
// Static imports rather than string paths: they put a content hash in the URL,
// so a re-exported asset gets a new URL. With "/home/Gettouch_light.png" the
// optimizer URL keys on path + width + quality only, so replacing the file
// leaves every cached copy — browser, CDN — serving the previous artwork.
import gettouchLight from "@/public/home/Gettouch_light.png";
import gettouchDark from "@/public/home/Gettouch_dark.png";
import { Button } from "./button";
import { CyclingWord } from "./cycling-word";
import { Star } from "./dynamic-visuals";
import { useIsDark } from "./use-is-dark";
import { useNearViewport } from "./use-near-viewport";

const CYCLING_WORDS = ["love", "hate", "AI", "coffee", "mischief", "claude", "care", "passion"];

// Figma "Footer" (node 361:4884) — the wordmark now leads the block rather than
// closing it, and everything else hangs beneath it:
//   desktop 6-col/3-row: wordmark(c1-6,r1) · socials(c2-3,r2) · made-with-love(c5-6,r2,
//                        bottom-aligned) · colophon(c5-6,r3)
//   tablet  4-col/4-row: wordmark · socials(side by side) · made-with-love · colophon
//   mobile  4-col/4-row: same stacking, socials stack vertically
//
// The wordmark is an exported PNG, not live text. Its glow is six coloured
// shadows in the same palette as the CTA's halo, which no amount of text-shadow
// tuning would keep identical between the two — baking it means one source of
// truth for the artwork and one for the colour cycle (see .wordmark-hue in
// globals.css, which rotates the export's hue exactly as the CTA rotates its
// halo's). A fixed-ratio image also needs no measuring pass, which is what the
// old live-text wordmark scaled itself with.
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
      <footer className="grid w-full grid-cols-4 gap-x-lg pt-4xl pb-4xs md:gap-y-xl md:pb-2xl dt:grid-cols-6 dt:gap-y-0 dt:pt-0 dt:pb-4xl">
        {/* Wordmark — the lettering meets the page gutters, not the image box.
            The export is 1683px wide but its glow occupies 80px of that on each
            side, leaving the letterforms themselves spanning 1523px (measured
            off the exported pixels; both the light and dark files carry
            identical bounds). Sizing the image to the cell would therefore inset
            the "g" and the "h" by the width of their own glow, so it is blown up
            by 1683/1523 and pulled left by the 80px margin, both as ratios of
            the cell so they hold at every breakpoint.

            Re-derive all three numbers whenever the asset is re-exported — the
            glow padding has changed between exports while the 1523px lettering
            stayed put, and stale numbers here shift the wordmark off the gutter
            rather than failing visibly.

            The glow now spills past the page gutters. That is the point — it is
            also why <footer> can no longer clip its overflow. Nothing scrolls:
            html and body already clip horizontally (globals.css), so the bleed
            is cut at the viewport rather than at the content edge. */}
        <div
          ref={wordmarkRef}
          className="col-start-1 col-span-4 row-start-1 dt:col-span-6"
        >
          <Image
            src={dark ? gettouchDark : gettouchLight}
            alt="Get in touch"
            sizes="115vw"
            loading={wordmarkNear ? "eager" : "lazy"}
            // height and max-width belong here rather than in className: as
            // Tailwind utilities they lost to next/image's own sizing and the
            // element computed to 0×0, which silently collapsed the wordmark.
            style={{
              width: "calc(100% * 1683 / 1523)",
              maxWidth: "none",
              height: "auto",
              marginLeft: "calc(-100% * 80 / 1523)",
            }}
            className={wordmarkNear ? "wordmark-hue" : undefined}
          />
        </div>

        {/* Socials — vertical on mobile, horizontal md+. Indents to column 2 on
            desktop, where the design sets them in from the wordmark's edge.

            The mobile top padding is Figma's 72px minus the wordmark's own
            bottom glow padding, which the image box carries as layout space and
            Figma's live text does not: 150px of the 426px export sits under the
            letterforms, which is 150/1523 of the cell once the image is scaled.
            Subtracting it puts 72px between the lettering and the links rather
            than 72px plus a variable gap. Re-derive the 150 on re-export, as
            with the width and margin above. */}
        <div className="col-start-1 col-span-4 row-start-2 flex flex-col items-start gap-xl pt-[calc(var(--spacing-5xl)_-_100%*150/1523)] md:flex-row md:items-center md:gap-6xl md:pt-0 dt:col-start-2 dt:col-span-2 dt:self-start dt:pt-10xl">
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

      {/* Stars — top right, breaking above the wordmark. Outside <footer> so its
          overflow-x-clip cannot cut them. */}
      <div className="pointer-events-none absolute right-0 top-0">
        <Star
          variant={4}
          className="absolute right-[26px] top-[6px] w-7 md:right-[46px] md:top-0 md:w-12 lg:!right-[50px] lg:!w-16"
        />
        <Star
          variant={4}
          className="absolute right-0 top-[26px] w-7 md:top-[30px] md:w-12 lg:!top-[40px] lg:!w-16"
        />
      </div>
    </div>
  );
}
