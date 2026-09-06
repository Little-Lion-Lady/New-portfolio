"use client";

import { useEffect, useRef, useState } from "react";

/*
  "Has this box come within a screenful of the viewport yet?" — one-shot.

  Written for the marquee rails, where per-image `loading="lazy"` cannot work:
  native lazy loading keys off each <img>'s own intersection, and a card sitting
  at x=3000px inside an `overflow: hidden` track never reports one, so it stays
  blank forever once the loop carries it into view. The rails answered that by
  loading every card eagerly, which put ~2MB of below-the-fold photography on
  the wire at page load.

  The rail's WRAPPER, though, is an ordinary block in normal flow — it does not
  translate and it is not clipped — so it intersects exactly when the rail is
  about to be seen. Observing that one element gates the whole rail: every card
  in it, on-screen or 3000px out, flips to eager together.

  `rootMargin` deliberately runs about a screen ahead rather than firing at the
  edge: the track is already mid-loop by the time a rail is reached, so the
  cards need a head start to arrive before they are looked at. The blur
  placeholders cover whatever is still in flight.
*/
export function useNearViewport<T extends HTMLElement>(rootMargin = "600px 0px") {
  const ref = useRef<T | null>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    if (near) return;
    const el = ref.current;
    if (!el) return;
    // No observer (a very old browser, or a test environment): fall back to the
    // old always-eager behaviour rather than leaving the rail permanently blank.
    // Deferred by a frame rather than set inline — the state has to land after
    // the first commit either way, and setting it in the effect body would make
    // it a cascading render.
    if (typeof IntersectionObserver === "undefined") {
      const frame = requestAnimationFrame(() => setNear(true));
      return () => cancelAnimationFrame(frame);
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [near, rootMargin]);

  return [ref, near] as const;
}

/*
  Two-way twin of the above: "is this box near the viewport RIGHT NOW?", plus a
  latched "has it ever been?".

  useNearViewport is one-shot on purpose — an image that has started loading
  must not be un-loaded when it scrolls away. An expensive ANIMATION is the
  opposite case: it has to stop again, or one visit to the footer leaves it
  running for the rest of the session. Measured in Firefox 155, the footer
  wordmark's infinite hue-rotate cost 28ms/frame on /about against 9ms with it
  off — and because the observer disconnected on first sight, that cost stayed
  on the page after scrolling back to the top.

  Both values come from ONE observer: `visible` drives animation-play-state,
  `everSeen` latches whatever should start once and not restart (eager image
  loading, and applying the animation at all). Pausing rather than removing the
  class keeps the hue where it stopped — dropping the animation and re-adding it
  restarts the cycle, which reads as a colour jump. Same reason
  .artwork-marquee-track pauses instead of toggling its animation.
*/
export function useInViewport<T extends HTMLElement>(rootMargin = "600px 0px") {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);
  const [everSeen, setEverSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // No observer: fall back to "always on", matching useNearViewport's choice
    // of a working page over a saved frame. Deferred by a frame for the same
    // reason it is there — setting state in the effect body makes it a
    // cascading render.
    if (typeof IntersectionObserver === "undefined") {
      const frame = requestAnimationFrame(() => {
        setVisible(true);
        setEverSeen(true);
      });
      return () => cancelAnimationFrame(frame);
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const isIn = entries.some((entry) => entry.isIntersecting);
        setVisible(isIn);
        if (isIn) setEverSeen(true);
      },
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return [ref, visible, everSeen] as const;
}
