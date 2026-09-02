"use client";

import { useEffect, useRef, useState } from "react";
import { RevealWords } from "./reveal";
import { TitleStars } from "./title-stars";

const TEXT_STYLE = {
  fontFamily: "var(--font-family-body)",
  fontWeight: "var(--font-weight-book)",
  lineHeight: 1.1,
  letterSpacing: "-0.02em",
} as const;

const HL = { color: "var(--text-primary-highlight)" };

// Share of the available height the binary search aims at, leaving slack under
// the last line. NOT a dial for how big the type reads: the search compares
// against scrollHeight, which jumps a whole line at a time, so this only
// changes the answer when it crosses a line-count step — 0.9 and 0.85 both
// return the same 64px at 1440. Use SCALE below for size.
const FILL = 0.9;

// Trim applied to the fitted size. The fit finds the largest type that clears
// the box; this is how far under that the headline actually sits, and unlike
// FILL it moves continuously, so it is the knob for how big the title reads.
// Every breakpoint scales by the same factor, so the relationship between them
// is unchanged.
//
// It costs lines as well as size — smaller type rewraps longer, and the reveal
// cascades per line — but nothing downstream is pinned to a line count any
// more: the headline publishes what it measured and the cat derives its
// entrance from that (see HeroClose), so the sequence re-times itself.
const SCALE = 0.94;

// Plain text for probe measurement — must match the visible content exactly
// (spans are inline and don't change line-wrap metrics).
const PLAIN =
  "I'm a Lead Product Designer specialising in product growth and optimisation with a track record of shipping delightful interfaces and research-backed experiences that move the numbers. Currently leading design at First Table.";

export function HeroText({
  className,
  revealDelay = 0,
}: {
  className?: string;
  revealDelay?: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const probeRef = useRef<HTMLParagraphElement>(null);
  const [fontSize, setFontSize] = useState(64);
  // Has the binary search below applied a size yet? The reveal groups the
  // headline by its measured line wrap, and the wrap at the placeholder size
  // above is not the wrap at the fitted size — so the cascade waits for this
  // rather than grouping whatever is on screen a frame after mount.
  const [fitted, setFitted] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const probe = probeRef.current;
    if (!wrap || !probe) return;

    const fit = () => {
      const cs = getComputedStyle(wrap);
      const availH =
        wrap.clientHeight -
        parseFloat(cs.paddingTop) -
        parseFloat(cs.paddingBottom);
      if (!availH) return;

      const targetH = availH * FILL;

      let lo = 16, hi = 300;
      for (let i = 0; i < 24; i++) {
        const mid = (lo + hi) / 2;
        probe.style.fontSize = `${mid}px`;
        if (probe.scrollHeight <= targetH) {
          lo = mid;
        } else {
          hi = mid;
        }
      }
      setFontSize(lo * SCALE);
      setFitted(true);
    };

    fit();
    // If the box never reports a height, fit() bails and `fitted` never flips.
    // Release the headline anyway rather than leaving it hidden until the CSS
    // safety floor: an unfitted headline at the placeholder size still reads,
    // and its line grouping is still internally consistent.
    const release = window.setTimeout(() => setFitted(true), 600);
    document.fonts.ready.then(fit);
    const ro = new ResizeObserver(fit);
    ro.observe(wrap);
    return () => {
      window.clearTimeout(release);
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={wrapRef} className={className} style={{ position: "relative" }}>
      {/* Hidden probe — same font metrics, used only for height measurement */}
      <p
        ref={probeRef}
        aria-hidden
        style={{
          ...TEXT_STYLE,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          visibility: "hidden",
          pointerEvents: "none",
          fontSize: `${fontSize}px`,
        }}
      >
        {PLAIN}
      </p>

      {/* TitleStars' wrapper hugs the h1's own box (unlike wrapRef, which is
          flex-centered and taller) so the twinkle stars anchor precisely to
          the rendered text at every breakpoint. */}
      <TitleStars placement="hero" revealDelay={revealDelay} className="relative w-full">
        <RevealWords
          immediate
          byLine
          ready={fitted}
          delay={revealDelay}
          as="h1"
          className="w-full"
          style={{
            ...TEXT_STYLE,
            fontSize: `${fontSize}px`,
            color: "var(--text-primary-overlay)",
          }}
        >
          I&apos;m a <span style={HL}>Lead Product Designer </span>specialising in{" "}
          <span style={HL}>product growth </span>and optimisation with a track record of shipping{" "}
          <span style={HL}>delightful interfaces</span> and research-backed experiences that{" "}
          <span style={HL}>move the numbers</span>. Currently <span style={HL}>leading design</span>{" "}
          at First Table.
        </RevealWords>
      </TitleStars>
    </div>
  );
}
