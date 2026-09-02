"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Reveal } from "./reveal";
import { ThemeToggle } from "./theme-toggle";
import { useWorkMenu, WorkMenuTrigger, WorkMenuPanel, WorkMenuMobileList } from "./work-menu";
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
export function SiteHeader({ revealDelay = 0 }: { revealDelay?: number } = {}) {
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  // Over a photo the glass pill isn't enough contrast on its own, so the nav
  // re-points --text-primary at an over-media token and every child that uses
  // text-text-primary (links, role, theme toggle) follows. Which token depends
  // on the photo's own luminance under the pill: dark ink on light photos,
  // light ink on dark ones. A fixed dark ink disappeared against the dark
  // screenshots that fill the First Table page in dark mode.
  const tone = useBackdropTone(navRef);
  const { open: workOpen, isDesktop, isMobile, pathname: menuPath, openNow, openOnFocus, close: closeWorkMenu,
          toggle: toggleWorkMenu, cancelClose, scheduleClose, focusFirstItem } = useWorkMenu();
  const pathname = usePathname();
  // "Work" points back at the home page's work section, so it is offered
  // everywhere except home itself — About, the three case studies and the 404.
  // "About" is offered everywhere except the About page. Case studies and the
  // 404 therefore carry BOTH, which is the only case needing two nav cells.
  const isAbout = pathname === "/about";
  const showWork = pathname !== "/";
  const showAbout = !isAbout;
  const bothLinks = showWork && showAbout;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="page-shell pointer-events-none fixed inset-x-0 top-0 z-50 p-sm md:p-lg lg:px-3xl lg:py-lg">
      {/* Fades in with the same blur-and-opacity Reveal as the page content.
          `immediate` rather than the in-view gate: the header is fixed and
          always on screen, so there is nothing to scroll into view. */}
      {/* noSafetyFloor: the pill's backdrop-blur is the whole point of the
          glass surface, and a reveal running the safety-floor animation turns
          itself into a backdrop root, which empties that blur. This reveal
          plays on mount, so it is not the one the floor is insuring against. */}
      <Reveal immediate noY noSafetyFloor delay={revealDelay}>
        <nav
          ref={navRef}
          className={`pointer-events-auto relative grid grid-cols-5 items-center gap-sm p-xs transition-colors duration-300 md:grid-cols-9 md:gap-x-lg md:gap-y-md md:rounded-sm md:p-md lg:grid-cols-12 ${
            // Figma gives the expanded mobile pill the next radius up; it is
            // only ever seen while the list is out.
            workOpen ? "rounded-sm md:rounded-sm" : "rounded-xs md:rounded-sm"
          }`}
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
          {/* The expanded mobile pill has to carry the menu, and at the top of
              the page this surface is fully transparent — so without forcing it
              opaque the rows float over the page with nothing behind them.
              Figma's mobile "Work nav" is a solid bg-primary card with a drop
              shadow rather than the glass fill, so the open state swaps to that
              instead of just raising the glass. md and up are untouched: there
              the menu brings its own card. */}
          <div
            aria-hidden
            className={`pointer-events-none absolute inset-0 rounded-[inherit] border border-border-overlay backdrop-blur-[10px] transition-opacity duration-300 ${
              workOpen && isMobile
                ? "bg-bg-primary drop-shadow-[0_2px_7.5px_var(--shadows-shadow-02)]"
                : "bg-utility-inverses-glass"
            }`}
            style={{ opacity: scrolled || (workOpen && isMobile) ? 1 : 0 }}
          />

          <Link
            href="/"
            className="tap-target relative col-start-1 col-span-2 b-3xs text-text-primary transition-colors hover:text-text-primary-hover lg:b-2xs"
          >
            Maryna Babych
          </Link>
          <p className="relative hidden whitespace-nowrap b-3xs text-text-primary transition-colors md:col-start-3 md:col-span-3 md:block lg:col-start-3 lg:col-span-2 lg:b-2xs">
            Lead Product Designer
          </p>
          {/* Work now shows at every breakpoint (mobile included — that is what
              the fifth column above is for) and opens the case-study menu.
              See ./work-menu: hover on desktop, tap on tablet and mobile. */}
          {showWork && (
            <WorkMenuTrigger
              open={workOpen}
              isDesktop={isDesktop}
              onOpen={openNow}
              onFocusOpen={openOnFocus}
              onToggle={toggleWorkMenu}
              onClose={closeWorkMenu}
              onScheduleClose={scheduleClose}
              onArrowDown={focusFirstItem}
              className={`col-start-3 justify-self-end md:justify-self-start lg:col-span-1 ${
                bothLinks
                  ? "md:col-start-7 md:col-span-1 lg:col-start-10"
                  : "md:col-start-7 md:col-span-2 lg:col-start-11"
              }`}
            />
          )}
          {/* The md span is part of the conditional, not a constant beside it.
              At 9 columns the toggle sits in column 9, so About spanning two
              columns from 8 reaches into it — and a grid item cannot share a
              cell, so the toggle wrapped onto a second row and the pill grew to
              90px. It only collided when both links showed, because that is the
              only case that puts About at column 8. */}
          {showAbout && (
            <Link
              href="/about"
              className={`tap-target relative col-start-4 justify-self-end b-3xs text-text-primary transition-colors hover:text-text-primary-hover md:justify-self-start lg:col-start-11 lg:col-span-1 lg:b-2xs ${
                bothLinks ? "md:col-start-8 md:col-span-1" : "md:col-start-7 md:col-span-2"
              }`}
            >
              About
            </Link>
          )}
          {/* Hangs off the nav, not the Work cell — see WorkMenuPanel. Out of
              flow, so it takes no grid cell. */}
          {showWork && (
            <WorkMenuPanel
              open={workOpen}
              isDesktop={isDesktop}
              currentPath={menuPath}
              onClose={closeWorkMenu}
              onCancelClose={cancelClose}
              onScheduleClose={scheduleClose}
            />
          )}
          <ThemeToggle className="relative col-start-5 justify-self-end md:col-start-9 lg:col-start-12" />
          {/* Below md the list is a row of this same grid, so the pill's glass
              surface (absolute inset-0) stretches over it and the whole thing
              expands as one card. */}
          {showWork && (
            <WorkMenuMobileList open={workOpen} currentPath={menuPath} onClose={closeWorkMenu} />
          )}
        </nav>
      </Reveal>
    </header>
  );
}
