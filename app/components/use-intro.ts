"use client";

import { useSyncExternalStore } from "react";

/*
  When the intro loader lifted, as a Date.now() timestamp — or null while it is
  still up. 0 means there was no loader this load (already seen this session).

  JS-timed reveals gate on this so they start when the page is actually seen,
  not underneath the loader. CSS-driven reveals need nothing: globals.css pauses
  every animation on the page while `data-intro` is set.

  The server snapshot is null, so hydration renders the held state and the
  client snapshot corrects it on the next pass — the same flip useHasMounted
  already relies on.
*/
function subscribe(callback: () => void) {
  document.addEventListener("intro:lift", callback);
  return () => document.removeEventListener("intro:lift", callback);
}

function getSnapshot() {
  const d = document.documentElement;
  if (d.hasAttribute("data-intro")) return null;
  return Number(d.getAttribute("data-intro-lifted-at")) || 0;
}

function getServerSnapshot() {
  return null;
}

export function useIntroLiftedAt() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
