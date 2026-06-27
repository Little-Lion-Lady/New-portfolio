"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MoonIcon, SunIcon } from "./icons";

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

function applyTheme(theme: "dark" | "light") {
  document.documentElement.setAttribute("data-theme", theme);
}

// Light/dark theme toggle.
// - On mount, restores the saved localStorage preference (or falls back to OS).
// - On click, saves the new preference to localStorage so it survives
//   navigation (ThemeToggle remounts per page) and page refreshes.
// - Subscribes to OS changes only when the user hasn't made a manual choice.
// - Sets data-theme on <html>; globals.css resolves all tokens from it.
// Visual matches the Figma toggle: 24×20 pill, border-highlight, 16px icon.
export function ThemeToggle({ className = "" }: { className?: string }) {
  const [isDark, setIsDark] = useState(false);
  const [hasManual, setHasManual] = useState(false);

  useEffect(() => {
    const theme = resolveTheme();
    const manual = (() => {
      try { return localStorage.getItem(STORAGE_KEY) !== null; } catch { return false; }
    })();

    setHasManual(manual);
    setIsDark(theme === "dark");
    applyTheme(theme);

    if (manual) return;

    // No saved preference — follow OS changes in real time.
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => {
      const next = e.matches ? "dark" : "light";
      setIsDark(e.matches);
      applyTheme(next);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const toggle = () => {
    const next = !isDark;
    const theme = next ? "dark" : "light";
    setIsDark(next);
    setHasManual(true);
    applyTheme(theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch { /* ignore */ }
  };

  return (
    <motion.button
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
      {isDark ? <SunIcon className="size-md group-hover:fill-current" /> : <MoonIcon className="size-md group-hover:fill-current" />}
    </motion.button>
  );
}
