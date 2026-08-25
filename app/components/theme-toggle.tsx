"use client";

import { useEffect } from "react";
import { AnimatePresence, m } from "framer-motion";
import { MoonIcon, SunIcon } from "./icons";
import { useInitialIsDark } from "./theme-context";
import { useIsDark } from "./use-is-dark";

const STORAGE_KEY = "theme";

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

// Cookie is read server-side (via InitialThemeContext) on the next request,
// so it's kept in sync with whatever theme is currently shown — including
// the OS-driven default, not just an explicit user choice — so a returning
// visitor's server render always matches what they last saw.
function setThemeCookie(theme: "dark" | "light") {
  document.cookie = `${STORAGE_KEY}=${theme}; path=/; max-age=31536000; samesite=lax`;
}

function applyTheme(theme: "dark" | "light") {
  document.documentElement.setAttribute("data-theme", theme);
}

// Light/dark theme toggle.
// - Initial render trusts the server-read "theme" cookie (InitialThemeContext)
//   so it matches the SSR'd HTML exactly. With no cookie yet (first visit) it
//   renders the same `false` the server did, then useSyncExternalStore swaps
//   to the live attribute once hydration finishes — reading data-theme or
//   matchMedia during that first client render is what caused the hydration
//   mismatch for dark-OS first-time visitors.
// - On click, saves the new preference to the cookie + localStorage so it
//   survives navigation (ThemeToggle remounts per page) and page refreshes.
// - Subscribes to OS changes only when the user hasn't made a manual choice.
// - Sets data-theme on <html>; globals.css resolves all tokens from it.
// Visual matches the Figma toggle: 24×20 pill, border-highlight, 16px icon.
export function ThemeToggle({ className = "" }: { className?: string }) {
  // `data-theme` on <html> is the single source of truth — globals.css already
  // resolves every token from it, and applyTheme() below is the only writer.
  // Reading it through useIsDark means the icon follows the attribute instead
  // of tracking it in a second piece of state that has to be kept in step.
  const isDark = useIsDark(useInitialIsDark() ?? false);

  useEffect(() => {
    const theme = resolveTheme();
    const manual = (() => {
      try { return localStorage.getItem(STORAGE_KEY) !== null; } catch { return false; }
    })();

    applyTheme(theme);
    setThemeCookie(theme);

    if (manual) return;

    // No saved preference — follow OS changes in real time.
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => {
      const next = e.matches ? "dark" : "light";
      applyTheme(next);
      setThemeCookie(next);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const toggle = () => {
    const theme = isDark ? "light" : "dark";
    applyTheme(theme);
    setThemeCookie(theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch { /* ignore */ }
  };

  return (
    <m.button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      suppressHydrationWarning
      whileHover={{
        scale: 1.07,
        boxShadow: isDark
          ? "0 0 8px 2px rgba(55, 68, 255, 0.3)"
          : "0 0 8px 2px rgba(0, 0, 0, 0.1)",
      }}
      transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
      className={`group inline-flex h-[20px] w-[24px] items-center justify-center rounded-full border-[1.2px] border-border-highlight p-[4px] text-text-primary ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <m.span
            key="sun"
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="inline-flex"
          >
            <SunIcon className="size-md group-hover:fill-current" />
          </m.span>
        ) : (
          <m.span
            key="moon"
            initial={{ opacity: 0, rotate: 90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: -90 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="inline-flex"
          >
            <MoonIcon className="size-md group-hover:fill-current" />
          </m.span>
        )}
      </AnimatePresence>
    </m.button>
  );
}
