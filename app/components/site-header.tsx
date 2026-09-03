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
/*
  The nav's "Link container" — Figma 436:17272 (spec) and 1786:139483 (states).

  Every nav control now sits in a padded, rounded box rather than being bare
  text, and that box is what carries the interactive states:

    hover    nav-item-hover    white at low alpha
    pressed  nav-item-pressed  white, a little stronger

  Translucent white rather than an opaque grey because the pill is a glass
  surface that can sit over photography — a solid fill punches a flat patch
  through it, while white lifts whatever is behind. The ink does NOT change
  with either state: the fill alone carries it, so the label stays put and the
  over-media ink swap (see useBackdropTone) is left to do its own job.

  Padding steps DOWN as the viewport grows, because the type steps up: 12px
  vertical on mobile and tablet against 12px type, 8px on desktop against 14px.
  The radius is a flat 12px at every breakpoint.

  The box is the anchor itself, not a wrapper around it — so the padding is
  part of the hit area and the pressed state can key off :active, neither of
  which works if the fill lives on a parent div.

  The nav stretches its cells (items-stretch) rather than centring them, so
  every fill is exactly the row's height whatever the tallest item happens to
  be. Centring left each box at its own content height, which showed the moment
  one label wrapped: the name went to two lines and its fill stood a head above
  its neighbours'. `whitespace-nowrap` stops that wrap in the first place; the
  stretch keeps the boxes matched regardless.
*/
const LINK_CLASS =
  "relative flex items-center whitespace-nowrap rounded-sm px-xs py-sm transition-colors duration-200 " +
  "b-3xs text-nav-ink hover:bg-nav-item-hover active:bg-nav-item-pressed " +
  "md:p-sm lg:p-xs lg:b-2xs";

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
          /*
            Column counts come straight from the spec: the last column is
            max-content for the toggle, the rest share the remaining width.
            Gutters are a flat 8px horizontally at every breakpoint; the
            vertical gap only shows once the mobile menu adds a second row.

            Nav padding is uniform on every edge — 4px up to lg, 8px from
            there — and deliberately much tighter than the link padding inside
            it. The link boxes already carry the pill's internal space, so the
            pill only needs enough to keep their fills off its border. It was
            16px sides against 8px top/bottom on tablet, which read as a wide
            pill with the items floating in the middle of it.
          */
          className={`pointer-events-auto relative grid grid-cols-[repeat(4,minmax(0,1fr))_max-content] items-stretch gap-x-xs gap-y-sm p-3xs transition-colors duration-300 md:grid-cols-[repeat(8,minmax(0,1fr))_max-content] md:gap-y-md md:rounded-sm md:p-3xs lg:grid-cols-[repeat(9,minmax(0,1fr))_max-content] lg:gap-y-lg lg:p-xs ${
            // Figma gives the expanded mobile pill the next radius up; it is
            // only ever seen while the list is out.
            workOpen ? "rounded-sm md:rounded-sm" : "rounded-xs md:rounded-sm"
          }`}
          /* Retints --nav-ink, NOT --text-primary. The Work menu renders
             inside this element so it can anchor to it, so overriding the
             global ink here turned the menu's rows — which sit on their own
             opaque card — white along with the bar. */
          style={
            tone
              ? ({
                  "--nav-ink":
                    tone === "dark"
                      ? "var(--text-over-media-inverted)"
                      : "var(--text-over-media)",
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

          {/* justify-self-start makes the box hug the name instead of
              stretching to fill its columns — a grid item stretches by default,
              which left the hover fill running the width of two columns for a
              two-word label. The column SPAN stays, so the items after it keep
              their positions; only the painted box shrinks. */}
          <Link
            href="/"
            /* Two columns at every breakpoint, not one at lg. The box hugs
               its text, so the span costs nothing visually — it only reserves
               room. At one column the nowrap name needed ~115px against a
               ~90px column between 1024 and 1200, and overran into the role
               beside it. */
            className={`${LINK_CLASS} col-start-1 col-span-2 justify-self-start`}
          >
            Maryna Babych
          </Link>
          {/* Figma calls this a "Container" rather than a "Link container": it
              is not interactive, so it takes the padding and radius but none of
              the states. */}
          <p className="relative hidden whitespace-nowrap rounded-sm p-sm b-3xs text-nav-ink md:col-start-3 md:col-span-2 md:flex md:items-center lg:col-start-3 lg:col-span-2 lg:p-xs lg:b-2xs">
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
              /* With both links out, Work and About take the two columns
                 before the toggle. With About hidden, Work slides into
                 About's column so the right-hand cluster stays tight against
                 the toggle rather than leaving a hole in the grid. */
              className={
                bothLinks
                  ? "col-start-3 md:col-start-7 lg:col-start-8"
                  : "col-start-4 md:col-start-8 lg:col-start-9"
              }
            />
          )}
          {/* About always sits in the column immediately before the toggle,
              whether or not Work is showing — so it never has to move. */}
          {showAbout && (
            <Link
              href="/about"
              className={`${LINK_CLASS} col-start-4 justify-center md:col-start-8 lg:col-start-9`}
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
          <ThemeToggle className="col-start-5 md:col-start-9 lg:col-start-10" />
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
