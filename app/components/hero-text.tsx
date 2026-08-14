"use client";

import { useEffect, useRef, useState } from "react";
import { m, useReducedMotion, type Variants } from "framer-motion";
import { RevealWords } from "./reveal";
import { Star } from "./dynamic-visuals";

const TEXT_STYLE = {
  fontFamily: "var(--font-family-body)",
  fontWeight: "var(--font-weight-medium)",
  lineHeight: 1.2,
  letterSpacing: "-0.02em",
} as const;

const HL = { color: "var(--text-primary-highlight)" };

// Matches RevealWords' own blur-in look, timed via `custom` so the stars
// settle right as the last word of line 1 finishes animating in.
const STAR_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 8, filter: "blur(16px)" },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      delay,
    },
    transitionEnd: { filter: "none" },
  }),
};

// Plain text for probe measurement — must match the visible content exactly
// (spans are inline and don't change line-wrap metrics).
const PLAIN =
  "I'm an IC Product Designer specialising in product growth and optimisation with a track record of shipping highly crafted interfaces and dynamic interactions that elevate user experience. Currently leading design at First Table.";

export function HeroText({ className }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const probeRef = useRef<HTMLParagraphElement>(null);
  const textBoxRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(64);
  const [starAnchor, setStarAnchor] = useState<{ top: number; left: number; delay: number } | null>(
    null,
  );
  const reducedMotion = useReducedMotion();

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

      let lo = 16, hi = 300;
      for (let i = 0; i < 24; i++) {
        const mid = (lo + hi) / 2;
        probe.style.fontSize = `${mid}px`;
        probe.scrollHeight <= availH ? (lo = mid) : (hi = mid);
      }
      setFontSize(lo);
    };

    fit();
    document.fonts.ready.then(fit);
    const ro = new ResizeObserver(fit);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  // Finds the last word of the first rendered line, so the star cluster can
  // anchor to it directly instead of the text box's corner — the wrap point
  // moves with viewport width and font-fit, independent of fontSize changes.
  useEffect(() => {
    const box = textBoxRef.current;
    if (!box) return;

    const measure = () => {
      const h1 = box.querySelector("h1");
      const words = h1 ? Array.from(h1.children) : [];
      if (!words.length) return;

      const boxRect = box.getBoundingClientRect();
      const firstTop = words[0].getBoundingClientRect().top;
      let lastOnLine1 = words[0];
      let lastIndex = 0;
      words.forEach((word, i) => {
        if (Math.abs(word.getBoundingClientRect().top - firstTop) < 1) {
          lastOnLine1 = word;
          lastIndex = i;
        }
      });
      const r = lastOnLine1.getBoundingClientRect();
      // RevealWords staggers each word by 0.06s and animates over 0.6s, so
      // the last word on line 1 finishes at roughly this offset.
      const delay = lastIndex * 0.06 + 0.6;
      setStarAnchor({ top: r.top - boxRect.top, left: r.right - boxRect.left, delay });
    };

    const raf = () => requestAnimationFrame(measure);
    raf();
    const ro = new ResizeObserver(raf);
    ro.observe(box);
    return () => ro.disconnect();
  }, [fontSize]);

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

      {/* Relative wrapper hugs the h1's own box (unlike wrapRef, which is
          flex-centered and taller) so the twinkle stars anchor precisely to
          the rendered text at every breakpoint. */}
      <div ref={textBoxRef} className="relative w-full">
        <RevealWords
          as="h1"
          className="w-full"
          style={{
            ...TEXT_STYLE,
            fontSize: `${fontSize}px`,
            color: "var(--text-primary-overlay)",
          }}
        >
          I&apos;m an <span style={HL}>IC Product Designer </span>specialising in{" "}
          <span style={HL}>product growth </span>and optimisation with a track record of shipping{" "}
          <span style={HL}>highly crafted interfaces</span> and dynamic interactions that elevate
          user experience. Currently <span style={HL}>leading design</span> at First Table.
        </RevealWords>
        {/* Clustered around the top-right corner of the last word of line 1.
            Blur-reveals in once that word finishes animating, via `delay`. */}
        {starAnchor && (
          <m.div
            className="pointer-events-none absolute"
            style={{ top: starAnchor.top, left: starAnchor.left }}
            initial={reducedMotion ? false : "hidden"}
            animate="visible"
            custom={starAnchor.delay}
            variants={STAR_VARIANTS}
          >
            <Star
              variant={1}
              className="absolute top-[2px] left-[22px] w-9 md:top-[4px] md:left-[28px] md:w-12 lg:top-[6px] lg:left-[36px] lg:w-16"
            />
            <Star
              variant={2}
              className="absolute -top-[18px] -left-[8px] w-9 md:-top-[24px] md:-left-[12px] md:w-12 lg:-top-[30px] lg:-left-[16px] lg:w-16"
            />
          </m.div>
        )}
      </div>
    </div>
  );
}
