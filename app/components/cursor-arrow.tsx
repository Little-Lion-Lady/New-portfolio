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

  The swing fires the frame the pointer stops, and it reads the gesture that
  just ended: it leads in the direction of travel, scales with how fast the
  pointer was going, and does not fire at all for a slow drift or for movement
  that was mostly vertical. Moving again springs it back to 0 rather than
  cutting.

  Two nested elements, deliberately. The outer one carries position, written
  straight to motion values from the pointermove listener with no smoothing —
  this IS the cursor, so anything that lags puts the drawn tip somewhere other
  than where a click lands. The inner one carries rotation. Separate elements
  mean separate transform matrices, so the animation engine driving rotation
  can never contend with the per-move writes driving position.
*/

import { useEffect, useRef, useState } from "react";
import { m, useMotionValue, useReducedMotion } from "framer-motion";

// Matches useWorkMenu's gate, and the `@media (hover: none)` reset in the CSS:
// no cursor to replace where there is no cursor.
const HOVER_QUERY = "(hover: hover) and (pointer: fine)";

// The hotspot the native cursor was mapped to — the furthest up-left opaque
// pixel of the 32x32 raster, i.e. the arrow's tip. It does double duty here:
// the offset that puts the tip on the pointer's true coordinate, and the pivot
// the swing turns around.
const HOTSPOT_X = 7;
const HOTSPOT_Y = 3;

// One cycle: out the way the pointer was travelling, back through to the far
// side, then home.
//
// The shape is a damped sine sampled into keyframes, not three eased legs. A
// three-keyframe swing has to pick an easing per leg, and every choice was a
// compromise: the curve that left 0 fast enough to be seen departed like a
// flick, and the one that departed gently spent 45ms below the angle the eye
// can resolve. A sine has neither problem — it leaves equilibrium at its
// maximum speed and slows into each extreme on its own, because that is what
// the motion actually is, and its velocity is continuous the whole way rather
// than being pinned to zero at each keyframe.
//
// It also produces the return ratio for free. With envelope e^(-DECAY*u) over
// one period, the second extreme is e^(-DECAY/2) of the first, so DECAY =
// -2*ln(2.5/3) = 0.3646 reproduces the 2.5/3 that was tuned by hand.
// Duration runs the other way to amplitude: fastest flicks keep the tight
// 0.38s cycle, and slower ones stretch. A small arc played at the fast cycle's
// pace reads as a twitch rather than a swing — the eye has less angle to
// follow, so the same duration feels hurried. Stretching it back out keeps a
// gentle flick gentle instead of merely small.
//
// Interpolated on the raw speed fraction, not the squared one used for
// amplitude: the point here is a steady spread across the range rather than a
// flat low end.
const MIN_DURATION = 0.38;
const MAX_DURATION = 0.58;

const DECAY = -2 * Math.log(2.5 / 3);

// Samples per cycle. Sized against the LONGEST cycle, not the shortest: at 44
// samples the spacing is 13ms at MAX_DURATION and 9ms at MIN_DURATION, both
// comfortably under a frame, so the linear interpolation between them is finer
// than the display can show and the result is the curve itself rather than an
// approximation of it.
const SWING_SAMPLES = 44;

// The envelope has already decayed a little by the time the sine reaches its
// first extreme at a quarter period, so divide it out — otherwise `amp` would
// undershoot the amplitude the speed ramp asked for.
const PEAK_NORM = Math.exp(-DECAY * 0.25);

function swingKeyframes(dir: number, amp: number) {
  const frames: number[] = [];
  for (let i = 0; i <= SWING_SAMPLES; i++) {
    const u = i / SWING_SAMPLES;
    frames.push(
      (dir * amp * Math.exp(-DECAY * u) * Math.sin(2 * Math.PI * u)) / PEAK_NORM,
    );
  }
  // sin(2*pi) is 0 to floating-point noise; land on exactly rest.
  frames[frames.length - 1] = 0;
  return frames;
}

// ─── Reading the gesture ─────────────────────────────────────────────────────

// Pixels the pointer must cover within a frame to still count as moving. A
// hand does not stop cleanly: a trackpad keeps reporting sub-pixel motion
// through the finger settling and lifting, and counting bare events let every
// one of those postpone the swing. Measuring distance ignores the jitter.
//
// 2px per frame is 120px/s. That is well under MIN_SPEED, so the two rules
// cooperate: a drift slower than this is called a stop, and a stop that slow
// does not swing anyway.
const STOP_DISTANCE = 2;

// Velocity is measured as displacement over a span of at least VELOCITY_SPAN,
// never per event. Per-event velocity is meaningless here — a 1ms gap between
// two coalesced samples reports thousands of px/s — and a low-pass filter over
// it was worse, because it assumes a steady event rate. Real devices do not
// deliver one event per frame: a trackpad, a lower-polling mouse, or a busy
// frame all produce gaps, and a filter that gets reset on those gaps never
// accumulates. That is what made the swing stop firing entirely.
//
// Instead, keep raw positions for GESTURE_WINDOW and, at the stop, take the
// fastest pair of samples spanning at least VELOCITY_SPAN. That is independent
// of how often events arrive, and it ignores the settling tail for free: the
// tail covers almost no distance, so it can never be the fastest span.
const GESTURE_WINDOW = 250;
const VELOCITY_SPAN = 40;

// Below MIN_SPEED there is no swing at all. Between it and MAX_SPEED the lead
// amplitude ramps to MAX_AMP, and above MAX_SPEED it clamps.
//
// The ramp is exponential: amplitude multiplies rather than adds as speed
// climbs, so the arc is nearly flat through the bottom of the band and then
// runs away at the top. That is what lets the floor sit low enough to catch a
// gentle flick without the band between there and a real throw feeling busy —
// a slow flick gets a fraction of a degree, a fast one gets the lot.
//
// RAMP_CURVE is the steepness. It is an exponent, so it bites hard: 3 puts the
// midpoint of the speed band at about a fifth of MAX_AMP, where a straight
// ramp would put it at half. Raise it to quieten the bottom further, lower it
// towards 0 to approach a straight line.
//
// Amplitude leaves 0 at the floor, so the swing grows out of nothing rather
// than appearing at a step; with MIN_VISIBLE_AMP the first swing you can
// actually see starts near 850px/s.
const MIN_SPEED = 800;
const MAX_SPEED = 1700;
const MIN_AMP = 0;
const MAX_AMP = 10;
const RAMP_CURVE = 3;
// e**RAMP_CURVE - 1, so the curve below lands exactly on MAX_AMP at t = 1.
const RAMP_NORM = Math.exp(RAMP_CURVE) - 1;

// A 32px arrow turning less than this cannot be seen — under a tenth of a
// pixel at the tail — so there is nothing to animate. Without it, every stop
// just above MIN_SPEED would still queue a render and a 44-keyframe animation
// for motion no one can perceive.
const MIN_VISIBLE_AMP = 0.1;

// The swing leads horizontally, so a gesture with more vertical than
// horizontal travel has no side to lead towards. Comparing the components of
// the displacement is a 45-degree cone around straight up and straight down.
function leadFor(dx: number, dy: number, speed: number) {
  if (speed < MIN_SPEED) return null;
  if (Math.abs(dx) <= Math.abs(dy)) return null;
  const t = Math.min(1, (speed - MIN_SPEED) / (MAX_SPEED - MIN_SPEED));
  const amp =
    MIN_AMP + ((MAX_AMP - MIN_AMP) * (Math.exp(RAMP_CURVE * t) - 1)) / RAMP_NORM;
  if (amp < MIN_VISIBLE_AMP) return null;
  return {
    dir: Math.sign(dx),
    amp,
    duration: MAX_DURATION + (MIN_DURATION - MAX_DURATION) * t,
  };
}

// The exit. Damping sits just past critical for this stiffness and mass —
// 2*sqrt(k*m) = 2*sqrt(260*0.6) = 24.98 — so the return to 0 is monotonic and
// cannot cross it. Carried velocity can still take the arrow a hair further
// out before it turns, which is the interruption being absorbed rather than
// the spring overshooting.
const SPRING = { type: "spring" as const, stiffness: 260, damping: 26, mass: 0.6 };

// Whether this element is one the DOM arrow is responsible for. `cursor`
// inherits, so with `cursor: none` on body every element resolves to "none"
// except the ones the stylesheet gives a cursor of their own — links and
// buttons (the hand), text fields (the I-beam). Reading the computed value
// rather than re-listing those selectors keeps the CSS the single source of
// truth: add a rule there and this follows it.
function ownsCursor(el: Element) {
  return getComputedStyle(el).cursor === "none";
}

type Lead = { dir: number; amp: number; duration: number };

export function CursorArrow() {
  const reducedMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [swing, setSwing] = useState<Lead | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Mirrored in refs so the move handler can skip a setState that would not
  // change anything. pointermove fires per frame; React state must not.
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
    // follows the last move clears the counter and the next one fires: ~16.7ms
    // at 60Hz, one frame, the floor. The loop runs only between a move and the
    // swing arming — once it fires there is nothing to poll until the pointer
    // moves again.
    let frame = 0;
    let movedSinceTick = 0;

    let lastX = 0;
    let lastY = 0;
    let lastT = 0;
    let havePos = false;

    // Raw positions over the last GESTURE_WINDOW. Nothing here is reset when a
    // stop is declared — a quiet frame is not evidence that the preceding
    // gesture never happened, and wiping the history on one was what stopped
    // the swing firing at all. The window trims itself by time instead, so a
    // gesture ages out on its own and a stop that follows a long drift finds
    // nothing fast enough to swing about.
    const samples: { t: number; x: number; y: number }[] = [];

    const show = (next: boolean) => {
      if (visibleRef.current === next) return;
      visibleRef.current = next;
      setVisible(next);
    };

    const stopSwing = () => {
      if (!swingRef.current) return;
      swingRef.current = false;
      setSwing(null);
    };

    // Both edges of the swing are gated on the same distance test, and that is
    // the point: cancelling on any pointermove let a settling trackpad kill the
    // swing ~8ms after it started, over and over, so a fast flick followed by a
    // normal hand-settle produced no visible swing at all. Real movement exits
    // the swing; jitter is not real movement.
    const tick = () => {
      if (movedSinceTick >= STOP_DISTANCE) {
        movedSinceTick = 0;
        stopSwing();
        frame = requestAnimationFrame(tick);
        return;
      }
      movedSinceTick = 0;
      frame = 0;
      // Already swung for this stop — jitter must not restart it.
      if (swingRef.current) return;

      // Fastest pair spanning at least VELOCITY_SPAN. The window holds ~20
      // samples at most, so the pairwise scan is a few hundred comparisons,
      // once, at the moment the pointer stops.
      let bestSpeed = 0;
      let bestDx = 0;
      let bestDy = 0;
      for (let i = 0; i < samples.length; i++) {
        for (let j = i + 1; j < samples.length; j++) {
          const span = samples[j].t - samples[i].t;
          if (span < VELOCITY_SPAN) continue;
          const dx = samples[j].x - samples[i].x;
          const dy = samples[j].y - samples[i].y;
          const speed = (Math.hypot(dx, dy) / span) * 1000;
          if (speed > bestSpeed) {
            bestSpeed = speed;
            bestDx = dx;
            bestDy = dy;
          }
        }
      }
      const lead = leadFor(bestDx, bestDy, bestSpeed);
      if (!lead) return;
      swingRef.current = true;
      setSwing(lead);
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

      if (reducedMotion) return;

      const now = performance.now();
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      const dt = now - lastT;
      lastX = event.clientX;
      lastY = event.clientY;
      lastT = now;

      // dt over ~100ms means the pointer re-entered rather than travelled;
      // that displacement is not a velocity.
      // dt over ~100ms means the pointer re-entered rather than travelled;
      // that displacement is not a velocity, so drop the history and start the
      // window fresh from here.
      if (havePos && dt >= 100) samples.length = 0;
      if (havePos && dt > 0) movedSinceTick += Math.hypot(dx, dy);
      havePos = true;

      samples.push({ t: now, x: event.clientX, y: event.clientY });
      const cutoff = now - GESTURE_WINDOW;
      while (samples.length && samples[0].t < cutoff) samples.shift();

      // requestAnimationFrame never returns 0, so it doubles as "not running".
      if (!frame) frame = requestAnimationFrame(tick);
    };

    // Pointer off the document, or the window losing focus: the OS is drawing
    // a cursor somewhere else now, so stop drawing one here.
    const onLeave = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      lastTarget = null;
      havePos = false;
      samples.length = 0;
      movedSinceTick = 0;
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
        initial={{ rotate: 0 }}
        animate={
          swing
            ? {
                rotate: swingKeyframes(swing.dir, swing.amp),
                transition: { duration: swing.duration, ease: "linear" },
              }
            : { rotate: 0, transition: SPRING }
        }
      />
    </m.div>
  );
}
