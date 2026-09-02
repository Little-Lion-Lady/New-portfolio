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
