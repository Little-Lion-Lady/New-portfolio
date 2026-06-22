"use client";

import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "./icons";

// Light/dark theme toggle (rebuild-prompt #5).
// - On mount, follow the system preference and subscribe to OS changes.
// - A manual click wins for the rest of the session; a refresh resets to
//   following the system again (state is not persisted).
// - "Apply" sets data-theme on <html>; globals.css resolves all tokens from it.
// Visual matches the Figma toggle: 24×20 pill, border-highlight, 16px icon.
export function ThemeToggle({ className = "" }: { className?: string }) {
  const [isDark, setIsDark] = useState(false);
  const [manualOverride, setManualOverride] = useState(false);

  useEffect(() => {
    if (manualOverride) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = (dark: boolean) => {
      setIsDark(dark);
      document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    };
    apply(mq.matches);
    const onChange = (e: MediaQueryListEvent) => apply(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [manualOverride]);

  const toggle = () => {
    const next = !isDark;
    setManualOverride(true);
    setIsDark(next);
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      suppressHydrationWarning
      className={`inline-flex h-[20px] w-[24px] items-center justify-center rounded-full border-[1.2px] border-border-highlight p-[4px] text-text-primary transition-colors ${className}`}
    >
      {isDark ? <SunIcon className="size-md" /> : <MoonIcon className="size-md" />}
    </button>
  );
}
