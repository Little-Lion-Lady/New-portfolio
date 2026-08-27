"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

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

/** null = no photo under the pill · "light"/"dark" = the photo's own tone there. */
export type BackdropTone = "light" | "dark" | null;

// ─── Luminance sampling ──────────────────────────────────────────────────────
//
// Knowing a photo is behind the pill isn't enough: a single ink colour goes
// invisible against half the library. So we read the photo's actual pixels
// where the pill covers it.
//
// Each <img> is drawn once into a 32px-wide offscreen canvas and cached by its
// resolved src — sampling then costs an array lookup, not a decode. All the
// photos are served from the same origin (next/image), so the canvas stays
// untainted; if a draw or read ever throws, that sample is skipped and the
// caller falls back to the previous tone.
const SAMPLE_MAX = 32;
const cache = new Map<string, { data: Uint8ClampedArray; w: number; h: number } | null>();

function sampled(img: HTMLImageElement) {
  const key = img.currentSrc || img.src;
  if (!key) return null;
  const hit = cache.get(key);
  if (hit !== undefined) return hit;

  let out: { data: Uint8ClampedArray; w: number; h: number } | null = null;
  const nw = img.naturalWidth;
  const nh = img.naturalHeight;
  if (img.complete && nw > 0 && nh > 0) {
    try {
      const scale = SAMPLE_MAX / Math.max(nw, nh);
      const w = Math.max(1, Math.round(nw * scale));
      const h = Math.max(1, Math.round(nh * scale));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (ctx) {
        ctx.drawImage(img, 0, 0, w, h);
        out = { data: ctx.getImageData(0, 0, w, h).data, w, h };
      }
    } catch {
      out = null; // tainted or undecodable — treat as unknown
    }
    cache.set(key, out); // only cache once the image has actually decoded
  }
  return out;
}

// Viewport point → source pixel, through `object-fit: cover` and the element's
// own object-position. Every photo in the site is `fill` + cover, so the drawn
// box is larger than the element on one axis and the overflow is split by
// object-position.
function luminanceAt(img: HTMLImageElement, x: number, y: number): number | null {
  const s = sampled(img);
  if (!s) return null;
  const r = img.getBoundingClientRect();
  if (r.width === 0 || r.height === 0) return null;

  const nw = img.naturalWidth;
  const nh = img.naturalHeight;
  const scale = Math.max(r.width / nw, r.height / nh);
  const dw = nw * scale;
  const dh = nh * scale;

  const pos = getComputedStyle(img).objectPosition.split(" ");
  const frac = (v: string | undefined, fallback: number) => {
    if (!v) return fallback;
    if (v.endsWith("%")) return parseFloat(v) / 100;
    if (v === "left" || v === "top") return 0;
    if (v === "right" || v === "bottom") return 1;
    if (v === "center") return 0.5;
    return fallback;
  };
  const offsetX = (r.width - dw) * frac(pos[0], 0.5);
  const offsetY = (r.height - dh) * frac(pos[1], 0.5);

  const sx = Math.round(((x - r.left - offsetX) / scale / nw) * s.w);
  const sy = Math.round(((y - r.top - offsetY) / scale / nh) * s.h);
  const cx = Math.min(s.w - 1, Math.max(0, sx));
  const cy = Math.min(s.h - 1, Math.max(0, sy));

  const i = (cy * s.w + cx) * 4;
  // Rec. 709 luma on the sRGB values — close enough for a light/dark call, and
  // far cheaper than linearising every sample.
  return (0.2126 * s.data[i] + 0.7152 * s.data[i + 1] + 0.0722 * s.data[i + 2]) / 255;
}

// Hysteresis, so a photo hovering either side of the midpoint (or a marquee
// sliding a light card past a dark one) can't strobe the nav between inks.
const TO_DARK = 0.42;
const TO_LIGHT = 0.58;

// The tone of whatever photo is painted underneath `ref`'s box.
//
// Hit-tests a row of points across the element rather than tracking section
// offsets: the work carousel scrolls horizontally and images enter and leave
// from the side, so a scroll-position formula would go stale. elementsFromPoint
// returns the whole paint stack at a point, so everything under the pill is
// visible to us — we just skip the pill's own subtree.
export function useBackdropTone(ref: RefObject<HTMLElement | null>): BackdropTone {
  const [tone, setTone] = useState<BackdropTone>(null);
  const toneRef = useRef<BackdropTone>(null);

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

      let hits = 0;
      let total = 0;
      let unreadable = false;

      for (const y of ys) {
        for (const x of xs) {
          for (const hit of document.elementsFromPoint(x, y)) {
            if (el.contains(hit)) continue;
            if (!isMedia(hit)) continue;
            hits++;
            if (hit.tagName === "IMG") {
              const l = luminanceAt(hit as HTMLImageElement, x, y);
              if (l === null) unreadable = true;
              else total += l;
            } else {
              unreadable = true; // <video>, CSS background — can't read pixels
            }
            break; // topmost photo at this point wins
          }
        }
      }

      let next: BackdropTone;
      if (hits === 0) {
        next = null;
      } else if (unreadable || total === 0) {
        // Couldn't read the pixels — keep the old behaviour of assuming a light
        // photo, which is what the dark ink was written for.
        next = "light";
      } else {
        const avg = total / hits;
        const prev = toneRef.current;
        next =
          prev === "dark"
            ? avg > TO_LIGHT
              ? "light"
              : "dark"
            : avg < TO_DARK
              ? "dark"
              : "light";
      }

      if (next !== toneRef.current) {
        toneRef.current = next;
        setTone(next);
      }
    };

    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    // Capture phase so inner scrollers (the work carousel) are heard too.
    window.addEventListener("scroll", schedule, { passive: true, capture: true });
    window.addEventListener("resize", schedule, { passive: true });
    // The marquee moves cards under a stationary pill, so scroll events alone
    // would miss it — but only pages that actually carry a looping row need the
    // poll, and 250ms is imperceptible for an ink swap.
    const tick = document.querySelector(".image-marquee-track")
      ? window.setInterval(schedule, 250)
      : 0;
    // Photos decode after first paint; re-measure once they're in.
    window.addEventListener("load", schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      if (tick) window.clearInterval(tick);
      window.removeEventListener("scroll", schedule, true);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("load", schedule);
    };
  }, [ref]);

  return tone;
}
