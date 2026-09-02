"use client";

import { useEffect } from "react";
import { AnimatePresence, m } from "framer-motion";
import { MoonIcon, SunIcon } from "./icons";
import { useIsDark } from "./use-is-dark";

const STORAGE_KEY = "theme";

// Icon swap. Both icons share one set, so the rotation always reads clockwise:
// the incoming icon turns up from -90 and the outgoing one carries on to +90,
// rather than each icon spinning back the way the other came.
const spin = {
  initial: { opacity: 0, rotate: -90 },
  animate: { opacity: 1, rotate: 0 },
  exit: { opacity: 0, rotate: 90 },
  transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] as const },
};

// Read the saved preference, falling back to system preference.
// Returns "dark" | "light" — never null.
function resolveTheme(): "dark" | "light" {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "dark" || saved === "light") return saved;
  } catch {
    // localStorage unavailable (private browsing, SSR guard)
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: "dark" | "light") {
  document.documentElement.setAttribute("data-theme", theme);
}

// Light/dark theme toggle.
// - Initial render always assumes light, matching the static HTML the server
//   emitted, then useSyncExternalStore swaps to the live `data-theme` once
//   hydration finishes. Reading data-theme or matchMedia during that first
//   client render is what caused the hydration mismatch for dark-OS visitors.
//   The PALETTE is already correct before this happens — the inline script in
//   layout.tsx stamps data-theme pre-paint — so only the glyph settles.
// - On click, saves the new preference to localStorage so it survives
//   navigation (ThemeToggle remounts per page) and page refreshes.
// - Subscribes to OS changes only when the user hasn't made a manual choice.
// - Sets data-theme on <html>; globals.css resolves all tokens from it.
// Visual matches the Figma toggle: 24×20 pill, 16px icon, no border. The
// POINTER target is padded out to 24×24 by .tap-target (globals.css), which
// uses an out-of-flow ::after so the drawn pill keeps its 24×20 box.
export function ThemeToggle({ className = "" }: { className?: string }) {
  // `data-theme` on <html> is the single source of truth — globals.css already
  // resolves every token from it, and applyTheme() below is the only writer.
  // Reading it through useIsDark means the icon follows the attribute instead
  // of tracking it in a second piece of state that has to be kept in step.
  const isDark = useIsDark(false);

  useEffect(() => {
    const theme = resolveTheme();
    const manual = (() => {
      try { return localStorage.getItem(STORAGE_KEY) !== null; } catch { return false; }
    })();

    applyTheme(theme);

    if (manual) return;

    // No saved preference — follow OS changes in real time.
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => {
      applyTheme(e.matches ? "dark" : "light");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const toggle = () => {
    const theme = isDark ? "light" : "dark";
    applyTheme(theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch { /* ignore */ }
  };

  return (
    <m.button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      suppressHydrationWarning
      whileHover={{ scale: 1.07 }}
      transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
      className={`tap-target group relative inline-flex h-[20px] w-[24px] items-center justify-center rounded-full p-[4px] text-text-primary ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <m.span key="sun" {...spin} className="inline-flex">
            <SunIcon className="size-md group-hover:fill-current" />
          </m.span>
        ) : (
          <m.span key="moon" {...spin} className="inline-flex">
            <MoonIcon className="size-md group-hover:fill-current" />
          </m.span>
        )}
      </AnimatePresence>
    </m.button>
  );
}
