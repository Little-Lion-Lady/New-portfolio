/*
  Motion timing tokens.
  ─────────────────────
  Deliberately a plain module with no "use client": these are read by Server
  Components too (a case-study page derives its intro duration from DURATION).
  An export of a "use client" module reaches a Server Component as a client
  reference, not as its value — so `DURATION * 1.3` over there would silently
  evaluate to NaN, and a NaN transition makes Framer skip the animation with no
  error and no type complaint. Keeping the numbers out of the client boundary
  is what makes them safe to import from either side.
*/

// ─── Timing ──────────────────────────────────────────────────────────────────
// One source of truth for the reveal system.
//
// A reveal reads as abrupt when it leaves rest already moving fast. The onset
// velocity is (y1/x1) * Y / DURATION, so the curve's initial slope matters as
// much as the duration: ease-out-quint (0.22,1) starts at slope 4.5, i.e. flat
// out, which popped. This curve starts at slope 2.25 and then flattens hard
// into a very long tail, so motion begins gently and spends most of its time
// settling. At 910ms over 16px that is ~39 px/s at the start — gentler still
// than the old ease-out-quad's ~49 px/s — with far more of the duration spent
// in the deceleration, which is what actually reads as smooth.
export const EASE = [0.32, 0.72, 0, 1] as [number, number, number, number];
export const DURATION = 0.91;
// Stagger is well under the duration, so each item begins while its neighbour
// is only a fraction through: the group arrives as one continuous cascade
// rather than a sequence of discrete pops.
export const STAGGER = 0.09;
export const WORD_DURATION = 1.45;
// Words need a far tighter stagger than blocks: the hero runs 33 of them, so
// the block value would drag its reveal out past three seconds. At 35ms the
// cascade crosses the line in ~1.2s while each word takes ~1.45s to resolve,
// so nearly every word is in motion at once and the line reads as one slow
// sweep rather than a row of individual pops.
export const WORD_STAGGER = 0.035;
export const Y = 16;

// filter:blur() is paint-bound — every frame re-rasterises the element at a new
// radius — so the radius is the frame cost. Block reveals wrap whole sections
// including large images and glass cards, where a wide radius is expensive and
// barely legible. Word reveals cover small glyph runs, where it is cheap and
// does the most work, so they keep a slightly wider one.
export const BLUR_BLOCK = "blur(8px)";
export const BLUR_TEXT = "blur(10px)";

// ─── Line reveals ────────────────────────────────────────────────────────────
// Hero headlines reveal a whole wrapped line at a time rather than a word at a
// time. The pair below is chosen for overlap rather than for a total span: a
// line starts when the one above it is under a tenth resolved, so the whole
// headline is in motion at once and reads as a single blur lifting off the
// block rather than a row of lines arriving in turn.
//
// The stagger is what keeps the total from running away — it multiplies by the
// line count, and the copy wraps to as many as twelve lines on a phone. At
// 0.15 that tail is 1.65s on top of the 1.6s a line takes; at 0.5 it was 5.5s,
// which made the mobile intro a seven-second wait. Keep STAGGER far under
// DURATION: at parity the lines separate into discrete steps.
export const LINE_DURATION = 1.6;
export const LINE_STAGGER = 0.15;

// When a line READS as arrived, which is not when it finishes. EASE front-loads
// hard — cubic-bezier(0.32,0.72,0,1) is ~93% of the way there at half its
// duration — so most of a line reveal is a blur too faint to register. Anything
// handing over to the headline should hand over here rather than at the nominal
// end; waiting for 1.6s buys most of a second of dead air with nothing visibly
// moving. Used by useHeadlineHandoff.
//
// A quarter of the duration, not half. The handover already waits out the line
// cascade before this even starts — nine lines on a phone is 1.2s of stagger —
// so half a duration on top put the cat 2s from the top of the page and another
// 0.91s from settled. At a quarter the curve is still ~80% resolved, which is
// past the point where the eye has the line, and the cat overlaps the headline's
// tail instead of queueing behind it.
export const LINE_SETTLE = LINE_DURATION / 4;

// ─── The hero's closing beat ─────────────────────────────────────────────────
// The divider and the cat are ONE reveal, with no stagger and no movement
// beside it. EASE spends its travel almost entirely up front — 85% resolved in
// the first 28% of the duration — which every other reveal gets away with
// because something else covers it: the headline staggers five lines 150ms
// apart, block reveals lift 16px. With nothing to cover it, that curve measured
// 2% -> 76% opacity in 200ms of a nominally 910ms reveal, which is a pop
// however long the duration claims to be.
//
// Linear, so the visible range really is 0-100% of the duration. Every shaped
// curve concentrates its travel somewhere, and wherever that is, the rest of
// the duration is time the viewer cannot see anything change. Softening EASE
// to cubic-bezier(.25,.1,.25,1) was tried first and still read as a pop: it
// widened the perceptible fade to ~676ms, but the blur was the real culprit
// (see BLUR_HERO_CLOSE below), and only linear puts the change everywhere.
//
// Deliberately NOT the shared EASE — changing that would reshape every reveal
// on the site to fix the one that is unusual in having nothing to hide behind.
export const EASE_SETTLE = [0, 0, 1, 1] as [number, number, number, number];
export const HERO_CLOSE_DURATION = 0.7;

// No entrance blur on the closing beat, unlike every other reveal.
//
// Blur softens a shape by spreading it over its own width; on line art there is
// no width to spread into, so it erases instead. The cat is ~2px strokes and
// the divider is a 1px hairline. Measured on the cat region, recoverable detail
// against radius: 8px start put every legible edge in the last 500ms of a
// 1400ms reveal (the length this ran at when measured), and dropping to 3px
// barely moved it, because anything above
// ~1px still smears a 2px stroke. Whatever the curve does, the drawing only
// exists once the radius is nearly gone - so the visible range collapses to the
// tail no matter how the timing is shaped.
//
// Without it the strokes are present from the first frame and simply gain
// contrast, which is what makes the visible range actually span 0-100%. With
// the y lift dropped too, that even fade is the whole of the entrance, which
// is why the curve above has to stay linear. Raise this to 1-2 for a hint of
// softness; past that the cat pops again however long the duration.
export const BLUR_HERO_CLOSE = 0;
