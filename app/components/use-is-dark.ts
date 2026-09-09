"use client";

import { useCallback, useSyncExternalStore } from "react";

/*
  Was in lottie-utils.ts, alongside the colour-remapping helpers that fed the
  Lottie player. The player is gone — the drawings now theme themselves through
  --lc-* custom properties in globals.css — so the only survivor of that module
  moved here, next to its one caller.
*/
export function isDarkTheme(): boolean {
  if (typeof window === "undefined") return false;
  const theme = document.documentElement.getAttribute("data-theme");
  if (theme) return theme === "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

/*
  useIsDark
  ─────────
  Subscribes to the `data-theme` attribute that ThemeToggle writes onto
  <html>. This is an external store — the value lives in the DOM, not in
  React — so useSyncExternalStore is the right primitive for it. It replaces
  the seed-then-correct pattern these components used to share:

      const [dark, setDark] = useState(isDarkTheme);
      useEffect(() => {
        setDark(isDarkTheme());              // ← setState during an effect
        const o = new MutationObserver(...); // ← the actual subscription
        ...
      }, []);

  The MutationObserver is created once for the document and shared by every
  subscriber, rather than one observer per Lottie instance (a page can render
  half a dozen). It disconnects when the last subscriber unmounts.

  Scope note: this watches `data-theme` only, matching the previous behaviour.
  ThemeToggle sets that attribute on mount and on every OS-level change, so
  the attribute — not matchMedia — is the single source of truth after mount.
*/

const listeners = new Set<() => void>();
let observer: MutationObserver | null = null;

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  if (!observer) {
    observer = new MutationObserver(() => {
      for (const listener of listeners) listener();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
  }
  return () => {
    listeners.delete(onStoreChange);
    if (listeners.size === 0 && observer) {
      observer.disconnect();
      observer = null;
    }
  };
}

// Returns a primitive, so React's identity check compares by value and no
// caching layer is needed.
function getSnapshot() {
  return isDarkTheme();
}

/**
 * @param serverValue What the server rendered, for components that are
 * server-rendered and then hydrated (e.g. BioCollage seeds this from the
 * theme cookie). React uses it for the SSR and hydration passes, then swaps
 * to the live DOM value — so the markup matches on hydration and any
 * correction lands as an ordinary re-render. Components mounted client-side
 * only (`ssr: false`) never hit this path and can leave it at the default.
 */
export function useIsDark(serverValue = false) {
  const getServerSnapshot = useCallback(() => serverValue, [serverValue]);
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
