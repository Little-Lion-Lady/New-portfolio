"use client";

import { useEffect, useRef, useState } from "react";
import { RevealWords } from "./reveal";

const TEXT_STYLE = {
  fontFamily: "var(--font-family-body)",
  fontWeight: "var(--font-weight-medium)",
  lineHeight: 1.2,
  letterSpacing: "-0.02em",
} as const;

const HL = { color: "var(--text-primary-highlight)" };

// Plain text for probe measurement — must match the visible content exactly
// (spans are inline and don't change line-wrap metrics).
const PLAIN =
  "I'm an IC Product Designer specialising in product growth and optimisation with a track record of shipping highly crafted interfaces and dynamic interactions that elevate user experience. Currently leading design at First Table.";

export function HeroText({ className }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const probeRef = useRef<HTMLParagraphElement>(null);
  const [fontSize, setFontSize] = useState(64);

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
    </div>
  );
}
