"use client";

/*
  CursorArrow
  ───────────
  The default arrow, redrawn as a DOM element so it can rotate.

  Why this exists at all: the rest of the cursor system is a native
  `cursor: url()` (see CUSTOM CURSORS in globals.css). The browser rasterises
  that and the OS composites it — nothing in the document can transform it, so
  a swing is impossible without taking the arrow out of the OS's hands. Only
  the DEFAULT arrow moves here. The hand and the I-beam stay native: body gets
  `cursor: none`, and every element that already declares its own cursor keeps
  it, so hover states are untouched and there is exactly one seam to manage —
  hiding this element wherever the native cursor takes over.

  The swing fires at rest, not on movement: the frame after the pointer stops,
  the arrow rocks through one cycle and settles. Moving again springs it back
  to 0 rather than cutting.

  Two nested elements, deliberately. The outer one carries position, written
  straight to motion values from the pointermove listener with no smoothing —
  this IS the cursor, so anything that lags puts the drawn tip somewhere other
  than where a click lands. The inner one carries rotation. Separate elements
  mean separate transform matrices, so the animation engine driving rotation
  can never contend with the per-move writes driving position.
*/

import { useEffect, useRef, useState } from "react";
import { m, useMotionValue, useReducedMotion, type Easing, type Variants } from "framer-motion";

// Matches useWorkMenu's gate, and the `@media (hover: none)` reset in the CSS:
// no cursor to replace where there is no cursor.
const HOVER_QUERY = "(hover: hover) and (pointer: fine)";

// The hotspot the native cursor was mapped to — the furthest up-left opaque
// pixel of the 32x32 raster, i.e. the arrow's tip. It does double duty here:
// the offset that puts the tip on the pointer's true coordinate, and the pivot
// the swing turns around.
const HOTSPOT_X = 7;
const HOTSPOT_Y = 3;

// One full cycle, +3 out and -2.5 back. The three legs are 3, 5.5 and 2.5
// degrees, so `times` splits the duration in those proportions (3/11, 5.5/11,
// 2.5/11) rather than evenly, which would run the long middle leg at more than
// twice the speed of the short return and lurch through the crossing.
const SWING = [0, 3, -2.5, 0];
const SWING_TIMES = [0, 0.273, 0.773, 1];
const SWING_DURATION = 0.3;

// Easing per leg, and the first leg is the whole point. A pendulum leaves rest
// at zero velocity, which is what easeInOut models and what it looked like
// here — but a 32px arrow has to turn something like a degree before the eye
// catches it, and easeInOut spent 48ms getting there. The trigger was already
// one frame; the rest of the delay was this curve. circOut leaves at maximum
// velocity instead and crosses 1deg in 19ms, so the swing starts when the
// pointer stops rather than shortly afterwards. The other two legs keep
// easeInOut — nothing is waiting on them, and the pendulum reading is free.
const SWING_EASE: Easing[] = ["circOut", "easeInOut", "easeInOut"];

// The exit. Damping sits just past critical for this stiffness and mass —
// 2*sqrt(k*m) = 2*sqrt(260*0.6) = 24.98 — so the return to 0 is monotonic and
// cannot cross it. Carried velocity can still take the arrow a hair further
// out before it turns, which is the interruption being absorbed rather than
// the spring overshooting.
const SPRING = { type: "spring" as const, stiffness: 260, damping: 26, mass: 0.6 };

const VARIANTS: Variants = {
  rest: { rotate: 0, transition: SPRING },
  swing: {
    rotate: SWING,
    transition: { duration: SWING_DURATION, times: SWING_TIMES, ease: SWING_EASE },
  },
};

// Whether this element is one the DOM arrow is responsible for. `cursor`
// inherits, so with `cursor: none` on body every element resolves to "none"
// except the ones the stylesheet gives a cursor of their own — links and
// buttons (the hand), text fields (the I-beam). Reading the computed value
// rather than re-listing those selectors keeps the CSS the single source of
// truth: add a rule there and this follows it.
function ownsCursor(el: Element) {
  return getComputedStyle(el).cursor === "none";
}

export function CursorArrow() {
  const reducedMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [swinging, setSwinging] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Both booleans are mirrored in refs so the move handler can skip a setState
  // that would not change anything. pointermove fires per frame; React state
  // must not.
  const visibleRef = useRef(false);
  const swingRef = useRef(false);

  useEffect(() => {
    const fine = window.matchMedia(HOVER_QUERY);
    const sync = () => setEnabled(fine.matches);
    sync();
    fine.addEventListener("change", sync);
    return () => fine.removeEventListener("change", sync);
  }, []);

  // Added here rather than in the stylesheet so a no-JS visit — or a hydration
  // failure — keeps the native arrow instead of no cursor at all.
  useEffect(() => {
    if (!enabled) return;
    document.body.classList.add("cursor-none");
    return () => document.body.classList.remove("cursor-none");
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    // getComputedStyle forces a style recalc, so it runs only when the element
    // under the pointer actually changes — not on every frame of a sweep.
    let lastTarget: Element | null = null;
    let owns = false;

    // There is no delay to tune here, and deliberately no timer. A stop is the
    // absence of movement, and the soonest that absence can be observed is the
    // first frame that records none — so the frame clock IS the trigger. A
    // timeout could only ever be slower, and a short one would arm between the
    // pointermoves of a slow sweep, restarting the swing on every frame.
    //
    // Chrome dispatches input ahead of rAF within a frame, so the tick that
    // follows the last move clears the flag and the next one fires: ~16.7ms at
    // 60Hz, one frame, the floor. The loop runs only between a move and the
    // swing arming — once it fires there is nothing to poll until the pointer
    // moves again.
    let frame = 0;
    let movedSinceTick = false;

    const show = (next: boolean) => {
      if (visibleRef.current === next) return;
      visibleRef.current = next;
      setVisible(next);
    };

    const stopSwing = () => {
      if (!swingRef.current) return;
      swingRef.current = false;
      setSwinging(false);
    };

    const tick = () => {
      if (movedSinceTick) {
        movedSinceTick = false;
        frame = requestAnimationFrame(tick);
        return;
      }
      frame = 0;
      swingRef.current = true;
      setSwinging(true);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;

      x.set(event.clientX - HOTSPOT_X);
      y.set(event.clientY - HOTSPOT_Y);

      const target = event.target as Element | null;
      if (target !== lastTarget) {
        lastTarget = target;
        owns = !!target && ownsCursor(target);
      }
      show(owns);

      stopSwing();
      if (reducedMotion) return;
      movedSinceTick = true;
      // requestAnimationFrame never returns 0, so it doubles as "not running".
      if (!frame) frame = requestAnimationFrame(tick);
    };

    // Pointer off the document, or the window losing focus: the OS is drawing
    // a cursor somewhere else now, so stop drawing one here.
    const onLeave = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      movedSinceTick = false;
      lastTarget = null;
      stopSwing();
      show(false);
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, [enabled, reducedMotion, x, y]);

  if (!enabled) return null;

  return (
    <m.div aria-hidden className="cursor-arrow-root" style={{ x, y, opacity: visible ? 1 : 0 }}>
      <m.div
        className="cursor-arrow"
        variants={VARIANTS}
        initial="rest"
        animate={swinging ? "swing" : "rest"}
      />
    </m.div>
  );
}
