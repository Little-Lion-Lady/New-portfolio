"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Reveal } from "./reveal";
import { ThemeToggle } from "./theme-toggle";
import { useWorkMenu, WorkMenuTrigger, WorkMenuPanel, WorkMenuMobileList } from "./work-menu";

// Figma "Header" (436:17272) — a floating pill rather than a full-bleed band.
// The header itself stays transparent and only pads the pill in from the
// viewport edge; the pill carries the fill.
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
// alongside. The home page passes 0 — the header leads the hero rather than
// waiting on it.
//
// The pill's fill is revealed on scroll (unchanged behaviour): it lives on an
// overlay element whose opacity is driven by scrollY, so the nav text itself
// never fades — only the surface behind it.
/*
  The nav's "Link container" — Figma 436:17272 (spec) and 1786:139483 (states).

  Every nav control now sits in a padded, rounded box rather than being bare
  text, and that box is what carries the interactive states:

    hover    nav-item-hover    black at low alpha (light) / white at low alpha (dark)
    pressed  nav-item-pressed  black, a little stronger / white, a little stronger

  Alphas rather than opaque grey steps, in both themes: the pill's own fill is
  utility-gray-200, so an opaque hover would have to be picked against THAT
  rather than against the page, and it would then be wrong at the top of the
  page where the pill is transparent and the fill sits straight on content. An
  alpha darkens whatever is behind it and is right in both places. The ink does
  NOT change with either state: the fill alone carries it, so the label stays
  put.

  --nav-ink now resolves to --text-primary and nothing else. The nav used to
  sample the luminance behind the pill (useBackdropTone) and retint the ink over
  photography, which the glass surface needed. The pill is opaque once scrolled,
  so the ink only has to be right against its own fill — and sampling actively
  hurt: over a dark screenshot the swap turned the labels white while the pill
  stayed light grey, which is where the text disappeared.

  Padding steps DOWN as the viewport grows, because the type steps up: 10px
  vertical on mobile and tablet against 12px type, 8px on desktop against 14px.
  The vertical value is what sets the row height, and 10px against the 22px
  line-height is what lands it on 42. It is an arbitrary value rather than a
  spacing token because the scale steps 8 → 12 with nothing between; the
  horizontal padding stays on the tokens.
  The radius is a flat 8px at every breakpoint — a step under the pill's own,
  so a fill sits inside the pill's corner rather than fighting it.

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
/*
  The hover fill grows outward on hover, matching the lift of the theme toggle
  beside it — see ThemeToggle's whileHover — on the same 200ms and the same
  curve (Framer's [0.25, 0.1, 0.25, 1] IS the CSS `ease` keyword), without
  pulling motion into a link.

  It grows by a FIXED 1.5px per side, not by a scale factor. Scale is
  proportional to the box, so one value cannot serve a row of different widths:
  1.07 on the 40px toggle is 1.4px per side, but on the 109px "Maryna Babych" it
  is 3.8px — enough to eat the nav's whole 4px padding and put the fill's left
  edge flush against the pill's outer edge on tablet. A fixed inset grows every
  item by the same visible amount, which is what "matching the toggle" actually
  means, and it stays inside the pill whatever the label says. 1.5px is the
  toggle's own growth under 1.07.

  What grows is a ::before carrying the fill, NOT the anchor: moving the anchor
  took its label with it, and a resize of 12px type reads as a zoom, with
  re-rasterised glyphs going soft mid-transition. The toggle can scale bodily
  because its content is a vector icon; a text link cannot. So the box grows and
  the label holds still.

  `isolate` is what keeps `before:-z-10` honest. Without a stacking context on
  the anchor, a negative z-index escapes it and the fill drops behind the pill's
  own surface, which is opaque once scrolled — the hover would simply vanish.
*/
const NAV_ITEM_STATES =
  "isolate transition-colors duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)] " +
  "before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:content-[''] " +
  "before:transition-[background-color,inset] before:duration-200 before:ease-[cubic-bezier(0.25,0.1,0.25,1)] " +
  "hover:before:bg-nav-item-hover hover:before:-inset-[1.5px] active:before:bg-nav-item-pressed";

const LINK_CLASS =
  `relative flex items-center whitespace-nowrap rounded-xs px-xs py-[10px] ${NAV_ITEM_STATES} ` +
  "b-3xs text-nav-ink " +
  "md:px-sm md:py-[10px] lg:p-xs lg:b-2xs";

export function SiteHeader({ revealDelay = 0 }: { revealDelay?: number } = {}) {
  const [scrolled, setScrolled] = useState(false);
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
      {/* noSafetyFloor: kept from the glass era, when a reveal running the
          safety-floor animation turned itself into a backdrop root and emptied
          the pill's backdrop-blur. There is no blur left to protect, but the
          reasoning still stands on its own — this reveal plays on mount, so it
          is not the one the floor is insuring against. */}
      <Reveal immediate noY noSafetyFloor delay={revealDelay}>
        <nav
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
        >
          {/* Pill surface — the only thing that reveals on scroll. Sits behind the
              nav content (z-0 + relative children) so the links stay legible at
              full opacity throughout the fade. */}
          {/* A flat one-token card — no blur, no hairline, no shadow. The
              fill alone is the whole surface, so the pill separates from the
              page by tone rather than by edge treatment: a step off the page's
              own bg-primary. --nav-surface is that step, and it is not the same
              step in both themes — gray-200 over a near-white page, gray-100
              over a near-black one, where gray-200 read as a light slab. The
              Work card shares this token (see globals.css), so the two surfaces
              cannot drift apart.

              The expanded mobile pill has to carry the menu, and at the top of
              the page this surface is fully transparent, so the open state
              forces it opaque regardless of scroll or the rows would float over
              the page with nothing behind them. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] bg-nav-surface transition-opacity duration-300"
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
          <p className="relative hidden whitespace-nowrap rounded-xs px-sm py-[10px] b-3xs text-nav-ink md:col-start-3 md:col-span-2 md:flex md:items-center lg:col-start-3 lg:col-span-2 lg:p-xs lg:b-2xs">
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
