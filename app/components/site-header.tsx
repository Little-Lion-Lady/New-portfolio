"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Reveal } from "./reveal";
import { ThemeToggle } from "./theme-toggle";
import { useBackdropTone } from "./use-over-media";

// Figma "Header" (436:17272) — a floating glass pill rather than a full-bleed
// band. The header itself stays transparent and only pads the pill in from the
// viewport edge; the pill carries the fill, hairline and blur.
//
//   breakpoint   header pad          pill pad   radius            grid
//   mobile       spacing-sm  12      xs   8     radius-xs   8      4 cols, gap 12
//   tablet       spacing-lg  20      md  16     radius-sm  12      9 cols, gap 20/16
//   desktop      3xl/lg  40 × 20     md  16     radius-sm  12     12 cols
//
// Desktop's 40px inset matches the page gutter, so the pill's edges line up
// with page content.
//
// Type: B-3xs (12/22) on mobile+tablet, B-2xs (14/24) on desktop.
//
// `revealDelay` syncs the header's entrance with whatever it should arrive
// alongside — the home page passes the hero cat's 2s so the two land together.
//
// The pill's chrome is revealed on scroll (unchanged behaviour): fill, hairline
// and the 10px backdrop-blur live on an overlay element whose opacity is driven
// by scrollY, so the nav text itself never fades — only the surface behind it.
export function SiteHeader({ revealDelay = 0, intro = false }: { revealDelay?: number; intro?: boolean } = {}) {
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  // Over a photo the glass pill isn't enough contrast on its own, so the nav
  // re-points --text-primary at an over-media token and every child that uses
  // text-text-primary (links, role, theme toggle) follows. Which token depends
  // on the photo's own luminance under the pill: dark ink on light photos,
  // light ink on dark ones. A fixed dark ink disappeared against the dark
  // screenshots that fill the First Table page in dark mode.
  const tone = useBackdropTone(navRef);
  const pathname = usePathname();
  const isAbout = pathname === "/about";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 p-sm md:p-lg lg:px-3xl lg:py-lg">
      {/* Fades in with the same blur-and-opacity Reveal as the page content.
          `immediate` rather than the in-view gate: the header is fixed and
          always on screen, so there is nothing to scroll into view. */}
      <Reveal immediate noY intro={intro} delay={revealDelay}>
        <nav
          ref={navRef}
          className="pointer-events-auto relative grid grid-cols-4 items-center gap-sm rounded-xs p-xs transition-colors duration-300 md:grid-cols-9 md:gap-x-lg md:gap-y-md md:rounded-sm md:p-md lg:grid-cols-12"
          style={
            tone
              ? ({
                  "--text-primary":
                    tone === "dark"
                      ? "var(--text-over-media-inverted)"
                      : "var(--text-over-media)",
                  "--text-primary-hover":
                    tone === "dark"
                      ? "var(--text-over-media-inverted-hover)"
                      : "var(--text-over-media-hover)",
                } as CSSProperties)
              : undefined
          }
        >
          {/* Pill surface — the only thing that reveals on scroll. Sits behind the
              nav content (z-0 + relative children) so the links stay legible at
              full opacity throughout the fade. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] border border-border-overlay bg-utility-inverses-glass backdrop-blur-[10px] transition-opacity duration-300"
            style={{ opacity: scrolled ? 1 : 0 }}
          />

          <Link
            href="/"
            className="relative col-start-1 col-span-2 b-3xs text-text-primary transition-colors hover:text-text-primary-hover lg:b-2xs"
          >
            Maryna Babych
          </Link>
          <p className="relative hidden whitespace-nowrap b-3xs text-text-primary transition-colors md:col-start-3 md:col-span-3 md:block lg:col-start-3 lg:col-span-2 lg:b-2xs">
            Lead Product Designer
          </p>
          {isAbout && (
            <Link
              href="/#work"
              className="relative hidden b-3xs text-text-primary transition-colors hover:text-text-primary-hover md:col-start-6 md:col-span-2 md:block md:justify-self-start lg:col-start-11 lg:col-span-1 lg:b-2xs"
            >
              Work
            </Link>
          )}
          {!isAbout && (
            <Link
              href="/about"
              className="relative col-start-3 justify-self-end b-3xs text-text-primary transition-colors hover:text-text-primary-hover md:col-start-6 md:col-span-2 md:justify-self-start lg:col-start-11 lg:col-span-1 lg:b-2xs"
            >
              About
            </Link>
          )}
          <ThemeToggle className="relative col-start-4 justify-self-end md:col-start-9 lg:col-start-12" />
        </nav>
      </Reveal>
    </header>
  );
}
