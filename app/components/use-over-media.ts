"use client";

import { useEffect, useState, type RefObject } from "react";

// Elements that count as "an image behind the nav". Deliberately narrow:
// the hero's gradient <canvas> and the Lottie <svg>s are backgrounds, not
// photos, and the nav stays light over those.
const MEDIA_TAGS = new Set(["IMG", "VIDEO", "PICTURE"]);

function isMedia(el: Element) {
  if (MEDIA_TAGS.has(el.tagName)) return true;
  // Photos set as a CSS background still count.
  const bg = getComputedStyle(el).backgroundImage;
  return bg !== "none" && bg.includes("url(");
}

// True while any photo is painted underneath `ref`'s box.
//
// Hit-tests a row of points across the element rather than tracking section
// offsets: the work carousel scrolls horizontally and images enter and leave
// from the side, so a scroll-position formula would go stale. elementsFromPoint
// returns the whole paint stack at a point, so everything under the pill is
// visible to us — we just skip the pill's own subtree.
export function useOverMedia(ref: RefObject<HTMLElement | null>) {
  const [overMedia, setOverMedia] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frame = 0;

    const measure = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0) return;

      // Five columns across the pill, sampled at a third and two thirds of its
      // height so a band of image clipped by the pill's edge still registers.
      const xs = [0.02, 0.25, 0.5, 0.75, 0.98].map((t) => rect.left + rect.width * t);
      const ys = [rect.top + rect.height / 3, rect.top + (rect.height * 2) / 3];

      for (const y of ys) {
        for (const x of xs) {
          for (const hit of document.elementsFromPoint(x, y)) {
            if (el.contains(hit)) continue;
            if (isMedia(hit)) {
              setOverMedia(true);
              return;
            }
          }
        }
      }
      setOverMedia(false);
    };

    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    // Capture phase so inner scrollers (the work carousel) are heard too.
    window.addEventListener("scroll", schedule, { passive: true, capture: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule, true);
      window.removeEventListener("resize", schedule);
    };
  }, [ref]);

  return overMedia;
}
