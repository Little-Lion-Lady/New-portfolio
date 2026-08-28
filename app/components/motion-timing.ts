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
export const DURATION_FF = 0.78;
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
