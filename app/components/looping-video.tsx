"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

// A silent, endlessly looping screen recording — the moving equivalent of a
// GlassImage's photo, and deliberately the same shape of API: size the outer box
// with `className` + `aspectRatio`, and the video fills it with object-cover.
// Muted + playsInline so mobile browsers allow autoplay at all, and paused (on
// its first frame) under prefers-reduced-motion.
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

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (reducedMotion) {
      video.pause();
    } else {
      // Autoplay can still be refused (low-power mode, data saver) — the
      // first frame stays on screen, which is the same result as the
      // reduced-motion branch, so there's nothing to recover from.
      void video.play().catch(() => {});
    }
  }, [reducedMotion]);

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ aspectRatio }}>
      <video
        ref={ref}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        role="img"
        aria-label={label}
        className="absolute inset-0 h-full w-full object-cover"
        style={objectPosition ? { objectPosition } : undefined}
      />
    </div>
  );
}
