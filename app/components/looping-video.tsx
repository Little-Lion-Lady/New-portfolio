"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { useNearViewport } from "./use-near-viewport";

// A silent, endlessly looping screen recording — the moving equivalent of a
// GlassImage's photo, and deliberately the same shape of API: size the outer box
// with `className` + `aspectRatio`, and the video fills it with object-cover.
// Muted + playsInline so mobile browsers allow autoplay at all, and paused (on
// its first frame) under prefers-reduced-motion.
//
// ─── Why `src` is withheld until the box nears the viewport ──────────────────
// `preload="metadata"` is a hint that `autoplay` overrides: a browser told to
// autoplay fetches the whole file regardless. Measured on /work/first-table,
// mobile profile, before this gate: all four recordings started downloading
// ~410ms in and were still arriving at 6-7s — 899KB of the page's 1872KB, for
// content most of a screen below the fold, on a connection the hero was still
// competing for.
//
// An element with no `src` attribute fetches nothing at all, which is the only
// version of "don't download this yet" that autoplay cannot override. The
// attribute appears once the box is within useNearViewport's screen-ahead
// margin, and the recording loads and starts then.
//
// There are no poster frames, so a recording that has not loaded yet shows the
// frame's own background rather than its first frame. The near-viewport margin
// is a screen ahead, so in practice it has usually arrived; posters would close
// the gap on a slow connection and are worth adding if it shows.
export function LoopingVideo({
  src,
  label,
  aspectRatio,
  objectPosition,
  className = "",
}: {
  src: string;
  /** Describes what the recording shows — read out in place of the video. */
  label: string;
  /**
   * Ratio of the visible box. Give the recording's own W/H to show all of it;
   * give a slightly tighter one (plus `objectPosition`) to crop an edge off.
   */
  aspectRatio: string;
  /** object-position for the cropped video (e.g. "top", "left"). Defaults to center. */
  objectPosition?: string;
  className?: string;
}) {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);
  const [boxRef, near] = useNearViewport<HTMLDivElement>();

  useEffect(() => {
    const video = ref.current;
    if (!video || !near) return;
    if (reducedMotion) {
      video.pause();
    } else {
      // Autoplay can still be refused (low-power mode, data saver) — the
      // first frame stays on screen, which is the same result as the
      // reduced-motion branch, so there's nothing to recover from.
      void video.play().catch(() => {});
    }
  }, [reducedMotion, near]);

  return (
    <div ref={boxRef} className={`relative overflow-hidden ${className}`} style={{ aspectRatio }}>
      <video
        ref={ref}
        // Undefined renders no attribute at all, so nothing is fetched. See above.
        src={near ? src : undefined}
        autoPlay
        muted
        loop
        playsInline
        preload={near ? "auto" : "none"}
        role="img"
        aria-label={label}
        className="absolute inset-0 h-full w-full object-cover"
        style={objectPosition ? { objectPosition } : undefined}
      />
    </div>
  );
}
