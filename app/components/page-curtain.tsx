"use client";

/*
  PageCurtain
  ───────────
  Route transition: a full-bleed panel in --bg-primary sweeps DOWN over the
  outgoing page, the route swaps underneath it, then it keeps sweeping down and
  off to reveal the new page. Because the swap happens fully covered, none of
  the layout shift (scroll reset, image decode, HeroText's fit-text pass) is
  ever visible.

  Sequencing
  ──────────
    covering  → panel y -100% → 0%, opacity 0 → 1 (350ms, --duration-medium)
    covered   → router.push(), wait for usePathname() to land, two rAFs so the
                new tree has painted
    revealing → panel y 0% → 100%   (400ms, --duration-slow)
    idle      → panel unmounts (so it never animates back UP through frame)

  Cover is the quicker half and reveal the slower one, per the open/close
  asymmetry rule in the transitions-polish motion scale: dismissing the old
  page gets out of the way, presenting the new one is the invitation.

  Interception is a single capture-phase listener on <body> rather than a
  wrapper around every <Link>, so Button, WorkItem, CaseStudyNav and SiteHeader
  need no changes. Opt a link out with data-no-curtain.

  prefers-reduced-motion: no sweep. The navigation is still intercepted, but
  only so the scroll reset below is guaranteed — nothing animates.
*/

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { m, useReducedMotion } from "framer-motion";

type Phase = "idle" | "covering" | "covered" | "revealing";

// --duration-medium / --duration-slow / --ease-smooth-out from the
// transitions.dev motion scale. Mirrored in globals.css as CSS custom
// properties; kept as literals here because Framer needs numbers.
const COVER_S = 0.35;
const REVEAL_S = 0.4;
const EASE = [0.22, 1, 0.36, 1] as const;

// If the route never lands (offline, a hard error), lift the curtain anyway
// rather than leaving the viewer staring at a blank panel.
const SAFETY_MS = 2000;

// Longest we wait on rAF for the new tree's first paint before lifting anyway.
const PAINT_WAIT_MS = 120;

type Target = { path: string; url: string };

// Returns the destination for a click that should get the curtain, or null for
// anything that must keep its native behaviour: modified/middle clicks, new
// tabs, downloads, cross-origin, and same-page hash jumps (e.g. "/#work" while
// already on "/", which needs the browser's own scroll, not a route change).
function targetForClick(event: MouseEvent, currentPath: string): Target | null {
  if (event.defaultPrevented || event.button !== 0) return null;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return null;

  const anchor = (event.target as Element | null)?.closest?.("a");
  if (!anchor) return null;

  const link = anchor as HTMLAnchorElement;
  if (link.target && link.target !== "_self") return null;
  if (link.hasAttribute("download")) return null;
  if (link.dataset.noCurtain !== undefined) return null;

  const href = link.getAttribute("href");
  if (!href || href.startsWith("#")) return null;

  let url: URL;
  try {
    url = new URL(link.href, window.location.href);
  } catch {
    return null;
  }
  if (url.origin !== window.location.origin) return null;
  if (url.pathname === currentPath) return null;

  return { path: url.pathname, url: url.pathname + url.search + url.hash };
}

export function PageCurtain() {
  const [phase, setPhase] = useState<Phase>("idle");
  const target = useRef<Target | null>(null);
  // Same, for the reduced-motion path, which never enters the phase machine.
  const reducedTarget = useRef<Target | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const reducedMotion = useReducedMotion();

  // The click listener binds once, so it reads the current pathname and phase
  // through refs rather than closing over stale values. (Re-binding per phase
  // would drop a click that is already mid-flight.)
  const pathRef = useRef(pathname);
  const phaseRef = useRef(phase);
  useEffect(() => {
    pathRef.current = pathname;
    phaseRef.current = phase;
  }, [pathname, phase]);

  useEffect(() => {
    if (reducedMotion) return;

    const onClick = (event: MouseEvent) => {
      // Already mid-transition: swallow the click so a double-tap can't queue
      // a second navigation behind the panel.
      if (phaseRef.current !== "idle") {
        const anchor = (event.target as Element | null)?.closest?.("a");
        if (anchor) event.preventDefault();
        return;
      }

      const next = targetForClick(event, pathRef.current);
      if (!next) return;

      event.preventDefault();
      target.current = next;
      setPhase("covering");
    };

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, [reducedMotion]);

  // Reduced motion gets no sweep, so the block above never runs — and with it
  // goes the scroll reset the covered phase performs. The router's own reset
  // only fires when it decides the new tree's top isn't already in view, and
  // that check can pass through, landing the viewer at the bottom of the page
  // they just opened. Drive the navigation ourselves here so the reset is
  // guaranteed on this path too. Only forward clicks are touched: Back and
  // Forward never reach this listener, so the browser keeps restoring their
  // scroll positions as it should.
  useEffect(() => {
    if (!reducedMotion) return;

    const onClick = (event: MouseEvent) => {
      const next = targetForClick(event, pathRef.current);
      if (!next) return;
      event.preventDefault();
      reducedTarget.current = next;
      router.push(next.url);
    };

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, [reducedMotion, router]);

  // ...and put the new page at its top once the route actually lands. Skipped
  // when the target carries a hash, which has its own anchor to reach.
  useEffect(() => {
    const next = reducedTarget.current;
    if (!next || pathname !== next.path) return;
    reducedTarget.current = null;
    if (!next.url.includes("#")) window.scrollTo(0, 0);
  }, [pathname]);

  // Safety net spanning the whole covered phase. Keyed on `phase` alone so it
  // survives the pathname change below — if the route never lands (offline, a
  // hard error), the curtain still lifts instead of stranding the viewer on a
  // blank panel.
  useEffect(() => {
    if (phase !== "covered") return;
    const timer = setTimeout(() => setPhase("revealing"), SAFETY_MS);
    return () => clearTimeout(timer);
  }, [phase]);

  // Covered: push if we haven't landed yet, otherwise let the new tree paint
  // and lift.
  useEffect(() => {
    if (phase !== "covered") return;
    const next = target.current;
    if (!next) {
      setPhase("revealing");
      return;
    }
    if (pathname !== next.path) {
      router.push(next.url);
      return;
    }

    // Landed. Put the new page at its top ourselves rather than trusting the
    // router to have done it: Next only resets scroll when it decides the new
    // tree's top isn't already in view, and that check has been observed to
    // pass through, landing the viewer at the bottom of the page they just
    // opened. Doing it here is free and unconditional — the panel still covers
    // everything, so the jump is never visible. Skipped when the target
    // carries a hash, which has its own anchor to reach ("/#work").
    if (!next.url.includes("#")) window.scrollTo(0, 0);

    // Two rAFs = one committed paint of the new tree. rAF is paused in
    // a background tab (and can be starved on a slow first paint), so race it
    // against the clock — whichever arrives first lifts the curtain.
    const lift = () => setPhase("revealing");
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(lift);
    });
    const fallback = setTimeout(lift, PAINT_WAIT_MS);
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
      clearTimeout(fallback);
    };
  }, [phase, pathname, router]);

  // Framer drives the sweep off rAF, which browsers pause in a background
  // tab — onAnimationComplete would then never fire and the click would go
  // nowhere. Fall back to the wall clock so the sequence always advances.
  useEffect(() => {
    if (phase !== "covering" && phase !== "revealing") return;
    const ms = (phase === "covering" ? COVER_S : REVEAL_S) * 1000 + 200;
    const timer = setTimeout(() => {
      setPhase((current) =>
        current === "covering" ? "covered" : current === "revealing" ? "idle" : current,
      );
    }, ms);
    return () => clearTimeout(timer);
  }, [phase]);

  const onAnimationComplete = useCallback(() => {
    setPhase((current) => {
      if (current === "covering") return "covered";
      if (current === "revealing") return "idle";
      return current;
    });
  }, []);

  if (phase === "idle") return null;

  return (
    <m.div
      aria-hidden
      className="page-curtain"
      initial={{ y: "-100%", opacity: 0 }}
      animate={{ y: phase === "revealing" ? "100%" : "0%", opacity: 1 }}
      transition={{ duration: phase === "revealing" ? REVEAL_S : COVER_S, ease: EASE }}
      onAnimationComplete={onAnimationComplete}
    >
      {/* Bottom feather leads the cover sweep; top feather leads the reveal.
          Each sits outside the opposite edge of the panel, so only one is ever
          on screen at a time. */}
      <CurtainEdge edge="bottom" />
      <CurtainEdge edge="top" />
    </m.div>
  );
}

// ─── CurtainEdge ─────────────────────────────────────────────────────────────

// Softens one edge of the panel so it dissolves into the page instead of
// cutting it with a hard line. Two lanes, both ramping to nothing across the
// strip:
//
//   colour — bg-primary fading to --bg-transparency (bg-primary at zero alpha,
//            NOT the `transparent` keyword, which interpolates through
//            transparent BLACK and greys the ramp in light mode)
//   blur   — stacked backdrop-filters under gradient masks, the same cumulative
//            model SiteHeader uses: every layer is opaque at the panel edge and
//            differs only in how far out it fades, so the blurs compound to a
//            smooth decay rather than visible bands
//
// The strip is deliberately taller than its visible reach and slides back UNDER
// the panel by OVERLAP. A backdrop-filter paints a hard boundary where its
// filter region begins — parking that boundary behind the opaque panel is what
// removes the seam. The colour lane stays fully opaque across the overlap for
// the same reason, then ramps out over the exposed part, finishing ahead of the
// blur so a band of blurred-but-uncovered page runs in front of the sweep.

const FEATHER_PX = 200;
const OVERLAP = 0.2; // fraction of the strip hidden beneath the panel

// reach = how far into the EXPOSED part of the strip each layer survives.
const BLUR_LAYERS = [
  { blur: 6, reach: 1 },
  { blur: 16, reach: 0.65 },
  { blur: 34, reach: 0.35 },
];

// Map a position in the exposed strip to a stop on the full strip.
const stop = (reach: number) => `${(OVERLAP + reach * (1 - OVERLAP)) * 100}%`;

function CurtainEdge({ edge }: { edge: "top" | "bottom" }) {
  const dir = edge === "bottom" ? "to bottom" : "to top";
  const hidden = stop(0);

  return (
    <div
      aria-hidden
      className="page-curtain-feather"
      style={{
        height: FEATHER_PX,
        [edge === "bottom" ? "top" : "bottom"]: `calc(100% - ${FEATHER_PX * OVERLAP}px)`,
      }}
    >
      {BLUR_LAYERS.map(({ blur, reach }) => {
        const mask = `linear-gradient(${dir}, black 0%, black ${hidden}, transparent ${stop(reach)})`;
        return (
          <div
            key={blur}
            className="absolute inset-0"
            style={{
              backdropFilter: `blur(${blur}px)`,
              WebkitBackdropFilter: `blur(${blur}px)`,
              maskImage: mask,
              WebkitMaskImage: mask,
            }}
          />
        );
      })}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(${dir}, var(--bg-primary) 0%, var(--bg-primary) ${hidden}, var(--bg-transparency) ${stop(0.7)})`,
        }}
      />
    </div>
  );
}
