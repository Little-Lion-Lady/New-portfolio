"use client";

/*
  SyncedStar
  ──────────
  A twinkle star that reveals with the <RevealWords> word it sits nearest to.

  <TitleStars> handles the cluster pinned to a heading's own corner; this is
  for the loose stars placed elsewhere in the layout, whose nearest word is a
  matter of where they land rather than of what they are anchored to. The
  hero's third star sits below the headline inside the image row, so without
  this it would inherit that row's reveal and arrive well over a second before
  the line it points at.

  Renders nothing until the measurement lands, so it can't flash in at the
  wrong moment on first paint.
*/

import { useRef } from "react";
import { m, useReducedMotion } from "framer-motion";
import { Star } from "./dynamic-visuals";
import { useNearestWordDelay } from "./word-sync";
import { EASE } from "./motion-timing";

export function SyncedStar({
  variant = 1,
  className,
  headingSelector = "h1",
  revealDelay = 0,
}: {
  variant?: 1 | 2 | 3 | 4;
  className?: string;
  /** Heading whose word tokens this star times itself against. */
  headingSelector?: string;
  /** That heading's own reveal delay. */
  revealDelay?: number;
}) {
  // Measured before the star is visible, so the box has to be in the layout
  // from the start — hence the wrapper animating opacity rather than the star
  // being conditionally rendered.
  const ref = useRef<HTMLDivElement>(null);
  const { delay, clearance } = useNearestWordDelay(ref, { headingSelector, revealDelay });
  const reducedMotion = useReducedMotion();

  return (
    <m.div
      ref={ref}
      className={className}
      // marginTop, not a transform: the y animation below owns transform, and
      // margin shifts an absolutely-positioned box just as well.
      style={clearance ? { marginTop: clearance } : undefined}
      initial={reducedMotion ? false : { opacity: 0, y: 8, filter: "blur(16px)" }}
      animate={
        delay === null
          ? { opacity: 0 }
          : { opacity: 1, y: 0, filter: "blur(0px)", transitionEnd: { filter: "none" } }
      }
      transition={{ duration: 0.8, ease: EASE, delay: delay ?? 0 }}
    >
      <Star variant={variant} className="w-full" />
    </m.div>
  );
}
