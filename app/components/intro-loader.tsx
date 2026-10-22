"use client";

import { useEffect } from "react";
import { INTRO_MAX_MS, INTRO_MIN_MS } from "./intro-script";

declare global {
  interface Window {
    __introLift?: () => void;
  }
}

/*
  IntroLoader
  ───────────
  "crafting..." (Figma 1932:3898, which drew it as "hi there"), shown on the first page of a browsing session
  while the first screen's photos and fonts land, so the page underneath opens
  with nothing left to blur up or stutter.

  Always server-rendered and hidden by CSS; INTRO_SCRIPT in <head> sets
  `data-intro` to show it. Running this effect at all means React has hydrated,
  which is the "code is ready" half of the gate. The other half:

    1. fonts.ready
    2. every photo whose box (or marquee rail) starts within the first ~1.25
       screens — on the home page, the whole First Table rail
    3. at least INTRO_MIN_MS on screen, at most INTRO_MAX_MS waiting

  Rails further down are released to load once the first screen is in, so they
  use the rest of the loader's time instead of competing with it.
*/

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, Math.max(0, ms)));
// rAF never fires in a background tab, so race it against the clock.
const frame = () =>
  Promise.race([new Promise<void>((r) => requestAnimationFrame(() => r())), wait(50)]);

function loaded(img: HTMLImageElement) {
  // decode() is deferred indefinitely in a background tab, so it is skipped
  // there and capped otherwise — it is a nicety on top of "loaded", not a gate.
  const done = () =>
    document.hidden ? Promise.resolve() : Promise.race([img.decode().catch(() => {}), wait(500)]);
  if (img.complete && img.naturalWidth > 0) return done();
  return new Promise<void>((resolve) => {
    img.addEventListener("load", () => done().then(resolve), { once: true });
    img.addEventListener("error", () => resolve(), { once: true });
  });
}

// Marquee cards translate outside their clipped track, so the rail wrapper is
// what says where they sit on the page — the card's own box can be 3000px off.
function topOf(img: HTMLImageElement) {
  return (img.closest(".rail-bleed") ?? img).getBoundingClientRect().top;
}

export function IntroLoader() {
  useEffect(() => {
    const d = document.documentElement;
    if (!d.hasAttribute("data-intro")) return;
    let cancelled = false;
    const start = Number(d.getAttribute("data-intro-start")) || Date.now();
    const elapsed = () => Date.now() - start;

    (async () => {
      await Promise.race([document.fonts.ready, wait(INTRO_MAX_MS - elapsed())]);
      await frame();

      const fold = window.innerHeight * 1.25;
      const images = Array.from(document.images).filter((img) => !img.closest(".intro"));
      const first = images.filter((img) => topOf(img) < fold);
      // A lazy card in the first rail may not have been released yet (the
      // rail's observer fires a frame or two after hydration). Release it here
      // rather than wait for that, or the gate would sit out its full timeout.
      first.forEach((img) => (img.loading = "eager"));
      await Promise.race([Promise.all(first.map(loaded)), wait(INTRO_MAX_MS - elapsed())]);

      images
        .filter((img) => img.closest(".rail-bleed") && !first.includes(img))
        .forEach((img) => (img.loading = "eager"));

      await wait(INTRO_MIN_MS - elapsed());
      if (!cancelled) window.__introLift?.();
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="intro" aria-hidden>
      <div className="flex w-full flex-col gap-0 md:grid md:grid-cols-9 md:gap-x-lg lg:grid-cols-12">
        <div className="flex flex-col b-2xs md:col-start-7 md:col-span-3 lg:col-start-10 lg:col-span-3 lg:gap-xs lg:b-sm">
          <p className="text-text-primary">Maryna Babych</p>
          <p className="text-text-tertiary">Lead Product Designer</p>
        </div>
      </div>
      <div className="intro-hero">
        <p className="wordmark wordmark-hue intro-word">
          crafting
          <span className="intro-dot">.</span>
          <span className="intro-dot">.</span>
          <span className="intro-dot">.</span>
        </p>
      </div>
    </div>
  );
}
