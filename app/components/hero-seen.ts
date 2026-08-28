"use client";

/*
  Has the home hero intro already played in this browsing session?
  ────────────────────────────────────────────────────────────────
  The intro runs a little over five seconds. Worth it once; tiresome every time
  someone comes back from a case study. This records that it has played and
  lets the hero render finished on later visits.

  sessionStorage, not localStorage: "this session" means this tab. It survives
  a reload and in-app navigation, and clears when the tab closes, so the intro
  is seen again on a genuinely new visit.

  Read through useSyncExternalStore with a `false` server snapshot — the same
  shape as useIsFirefox/useHasMounted in reveal.tsx. The server always renders
  the hidden state, so hydration has to agree with it and the skip can only
  apply on the first client render after. That costs one frame, which is the
  same frame `immediate` reveals already wait for.

  Every access is wrapped: sessionStorage throws outright in some privacy
  modes rather than returning null, and an intro that cannot check simply
  plays, which is the safe default.
*/

import { useSyncExternalStore } from "react";

const KEY = "hero-intro-played";

// Resolved once per document load, then held — getSnapshot must return a
// stable value or useSyncExternalStore re-renders forever. Client-side
// navigation keeps this module alive, so a mark during the visit is still
// visible to a later mount without touching storage again.
let seen: boolean | null = null;

function getSnapshot() {
  if (seen === null) {
    try {
      seen = sessionStorage.getItem(KEY) === "1";
    } catch {
      seen = false;
    }
  }
  return seen;
}

function getServerSnapshot() {
  return false;
}

function subscribe() {
  return () => {};
}

export function markHeroIntroSeen() {
  seen = true;
  try {
    sessionStorage.setItem(KEY, "1");
  } catch {
    // Storage unavailable — the intro will just play again next time.
  }
}

function useHeroIntroSeen() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Should this piece of the hero skip its entrance?
 *
 * Correctness here depends on WHEN the flag is written, not on caching the
 * read. `subscribe` is a no-op, so marking never forces a re-render — but any
 * unrelated re-render (HeroText re-renders as soon as its font-fit measures)
 * re-reads the snapshot. Marking on mount therefore swapped the variants out
 * mid-animation and snapped the intro away on the first visit, the one time it
 * is meant to play. markHeroIntroSeen is called when the sequence finishes or
 * when the hero unmounts instead, so the value cannot change while the intro
 * is still running.
 */
export function useHeroIntroSkip(intro: boolean) {
  const seen = useHeroIntroSeen();
  return intro && seen;
}
