"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { GlassImage } from "./work-image";


/*
  The Work dropdown.
  ─────────────────
  Figma "Work nav" — desktop 1774:34903, tablet 1765:7312, mobile 1765:7366.

  Three presentations of one list, because the design asks for two shapes and
  two triggers:

    mouse (any width)  hover opens the menu — the card from md up, the pill's
                       own inline list below it
    touch              tap opens the same thing, the standard disclosure tap

  Shape is a breakpoint question (md+ floating card, <md list inside the pill);
  opening is a POINTER question and nothing else. A narrow desktop window is
  still a mouse and should still open on hover.

  The mobile case is why the open state lives in a hook rather than inside one
  self-contained component: the trigger sits in a single grid cell of the nav
  and the mobile list is a full-width row of that same grid, so the two cannot
  be one element. <SiteHeader> holds the state via useWorkMenu() and renders
  the trigger and the list into their respective slots.

  Every piece below takes flat, explicit props rather than one `menu` object.
  That is deliberate: the compiler treats an object carrying refs as a ref once
  it crosses a component boundary, so `menu.open` in JSX reads as a render-time
  ref access and fails react-hooks/refs. Passing values and stable callbacks
  individually keeps the boundary honest.
*/

// The case studies, in the order the home page numbers them (SW/01–03).
// Thumbnails are each row's own lead image, so the menu shows the same shot the
// work section opens with.
export const CASE_STUDIES = [
  {
    href: "/work/first-table",
    label: "First Table app",
    src: "/home/work/firsttable/FT1.jpg",
    alt: "The First Table app open on a phone above a shared table of food",
  },
  {
    href: "/work/covid-tracer",
    label: "NZ COVID Tracer app",
    src: "/home/work/covid-tracer/MOH0.jpg",
    alt: "NZ COVID Tracer title card, with the app's QR scanner open on a phone",
  },
  {
    href: "/work/basis",
    label: "Basis Home app",
    src: "/home/work/basis/BS1.jpg",
    alt: "The Basis app on a phone beside the smart panel mounted on a wall",
  },
] as const;

// Hover opens the menu wherever there is a real pointer to hover WITH — at any
// width, mobile and tablet breakpoints included. There is no viewport clause:
// a narrow window on a laptop is still a mouse, and gating on 1024px left it
// tap-only there for no reason the user could see.
//
// The pointer clause stays, and is the whole gate: on a touch device a
// hover-open menu fires on the tap meant to follow the link, so a touch
// device (including one reporting a wide viewport — an iPad in landscape, a
// Surface) keeps the tap-to-toggle path.
const HOVER_QUERY = "(hover: hover) and (pointer: fine)";

// Below md the list lives INSIDE the pill rather than in its own card, so the
// pill has to become an opaque surface while it is open — see the header's
// `surfaceOpaque`. Matched on the same 768px the `md:` utilities use.
const MOBILE_QUERY = "(max-width: 767px)";

// How long the menu survives the pointer leaving both the trigger and the card.
// The card sits 8px below the link, so a straight-line reach crosses dead
// space; without this grace it closes mid-reach.
const CLOSE_DELAY = 150;

/*
  Menu motion.
  ───────────
  Deliberately NOT the reveal system's EASE/DURATION from ./motion-timing.
  Those are tuned for large blocks arriving once on scroll — a 0.91s curve with
  a very long settling tail, which is right for a section of the page and wrong
  for a control the pointer is waiting on. A menu has to feel answered.

  So: open fast and settle (an expo-out curve, quick off the mark, no overshoot),
  and close FASTER than it opens. Exits that match their entrance read as
  sluggish, because by then the reader has already decided to leave — roughly
  half the open duration is the sweet spot.

  The rows come in together, a beat behind the card, rather than one after
  another. There are only three of them and the card is already moving, so a
  cascade just drew attention to itself — the list should look like one object
  arriving, not three. The small delay is what keeps the card leading; the rows
  themselves start on the same frame.

  On the way out the card's own fade covers them, so they get no exit of their
  own.
*/
const OPEN_EASE = [0.16, 1, 0.3, 1] as const;   // expo-out: fast, then settles
const CLOSE_EASE = [0.4, 0, 1, 1] as const;     // ease-in: accelerates away
const OPEN_DURATION = 0.26;
const CLOSE_DURATION = 0.14;
const ROW_DURATION = 0.24;
// Rows trail the card by a beat, then all move together — no stagger.
const ROW_DELAY = 0.04;

// Marks the trigger and both panels, so outside-clicks and focus moves resolve
// by querying the document instead of threading refs through props.
const SCOPE_ATTR = "data-work-menu";
const TRIGGER_ATTR = "data-work-menu-trigger";

export function useWorkMenu() {
  const [open, setOpen] = useState(false);
  const [hoverOpens, setHoverOpens] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);
  const pathname = usePathname();

  useEffect(() => {
    const hoverable = window.matchMedia(HOVER_QUERY);
    const mobile = window.matchMedia(MOBILE_QUERY);
    const sync = () => {
      setHoverOpens(hoverable.matches);
      setIsMobile(mobile.matches);
    };
    sync();
    hoverable.addEventListener("change", sync);
    mobile.addEventListener("change", sync);
    return () => {
      hoverable.removeEventListener("change", sync);
      mobile.removeEventListener("change", sync);
    };
  }, []);

  const cancelClose = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = undefined;
  }, []);

  const close = useCallback(() => {
    cancelClose();
    setOpen(false);
  }, [cancelClose]);

  const openNow = useCallback(() => {
    cancelClose();
    setOpen(true);
  }, [cancelClose]);

  /*
    Focus opens the menu, so a keyboard user reaches the case studies by
    tabbing — but Escape RESTORES focus to the trigger, and that restore fires
    focus too. Without this latch the two chase each other: Escape closes the
    menu, the refocus reopens it, and the menu can never be dismissed from the
    keyboard. The flag is set just before the programmatic focus and consumed
    by the first focus event that follows.
  */
  const suppressFocusOpen = useRef(false);
  const openOnFocus = useCallback(() => {
    if (suppressFocusOpen.current) {
      suppressFocusOpen.current = false;
      return;
    }
    cancelClose();
    setOpen(true);
  }, [cancelClose]);

  const toggle = useCallback(() => {
    cancelClose();
    setOpen((value) => !value);
  }, [cancelClose]);

  // Hover-out is deferred rather than immediate — see CLOSE_DELAY.
  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpen(false), CLOSE_DELAY);
  }, [cancelClose]);

  useEffect(() => cancelClose, [cancelClose]);

  // ArrowDown from the trigger steps into the list. The panel is not mounted on
  // the keypress that opens it, hence the frame's wait.
  const focusFirstItem = useCallback(() => {
    requestAnimationFrame(() => {
      document.querySelector<HTMLAnchorElement>(`[${SCOPE_ATTR}] [role="menuitem"]`)?.focus();
    });
  }, []);

  /*
    Route change closes it — the header persists across navigations, so without
    this the menu hangs open on the page it just opened.

    Adjusted during render rather than in an effect. Closing from an effect
    would paint the new page with the menu still open and then close it on a
    second pass; comparing against the previous value renders it closed the
    first time. This is React's documented pattern for deriving state from a
    changing input.
  */
  const [lastPathname, setLastPathname] = useState(pathname);
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      // Escape should leave focus somewhere useful, not on <body>.
      suppressFocusOpen.current = true;
      document.querySelector<HTMLElement>(`[${TRIGGER_ATTR}]`)?.focus();
    };
    // Pointer-down rather than click: closing on the press means the menu is
    // gone before a click lands on whatever sits underneath it.
    const onPointerDown = (event: PointerEvent) => {
      if ((event.target as Element | null)?.closest?.(`[${SCOPE_ATTR}]`)) return;
      setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return {
    open, hoverOpens, isMobile, pathname,
    openNow, openOnFocus, close, toggle, cancelClose, scheduleClose, focusFirstItem,
  };
}

// ─── Trigger ─────────────────────────────────────────────────────────────────

/*
  Work stays a real anchor with a real href, not a <button>: it has to work
  before hydration and with JS off, and right-click / open-in-new-tab should
  behave. The menu layers on top —

    mouse    hover (and keyboard focus) opens; a plain click toggles it and
             does NOT navigate
    touch    the tap opens the menu instead of navigating, the standard
             disclosure pattern

  Either way the rows do the navigating. A plain click is a disclosure control
  at every pointer type: with a mouse the menu is usually already open under
  the cursor when the click lands, so sweeping to /#work took the reader away
  from the three links they had just been offered — the click read as a
  mis-click rather than a choice. Now it closes what hover opened.

  Only a PLAIN left click is intercepted. The href is still live for
  cmd/ctrl/shift/middle-click and for the context menu, so "open the work
  section in a new tab" behaves, and with JS off the anchor is all that is
  left and it navigates.

  Intercepting means opting out of the page curtain. <PageCurtain> listens for
  anchor clicks in the CAPTURE phase and drives the navigation itself, so it
  had already decided to leave the page before this component's onClick ran —
  which is why preventDefault() here looked like it was being ignored (verified
  in a browser: handler ran, defaultPrevented was true, router still went to
  "/"). data-no-curtain is the curtain's own documented escape hatch, and it is
  now unconditional: no click on this element is ever a navigation the curtain
  should sweep for. The modifier clicks above never reach the curtain either —
  it ignores them, exactly as it must for every other link.

  A plain <a> rather than next/link because the element is not a navigation at
  all on the path the curtain would otherwise take.
*/
export function WorkMenuTrigger({
  open,
  hoverOpens,
  isMobile,
  onOpen,
  onFocusOpen,
  onToggle,
  onClose,
  onScheduleClose,
  onArrowDown,
  className = "",
}: {
  open: boolean;
  /** A real pointer is present, so hover opens the menu and click navigates. */
  hoverOpens: boolean;
  /** Below md, where the list expands the pill instead of hanging off it. */
  isMobile: boolean;
  onOpen: () => void;
  /** Like onOpen, but ignores the refocus Escape performs. */
  onFocusOpen: () => void;
  onToggle: () => void;
  onClose: () => void;
  onScheduleClose: () => void;
  onArrowDown: () => void;
  className?: string;
}) {
  return (
    <div
      {...{ [SCOPE_ATTR]: "" }}
      /* Only a positioning shell for the panel — the anchor inside carries the
         padding and the fills, and stretches to the full grid cell so Work's
         hover state matches About's rather than shrink-wrapping the word. */
      className={`relative flex ${className}`}
      onMouseEnter={hoverOpens ? onOpen : undefined}
      onMouseLeave={hoverOpens ? onScheduleClose : undefined}
    >
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages --
          The rule assumes any in-app href should be a <Link>. Here it must not
          be: Next 16's Link navigates even after the composed onClick has
          called preventDefault(), so a click could not open the menu without
          also leaving the page. See the block comment above. The client-side
          transition the rule protects is not lost — a plain click never
          navigates from here at all, and the rows inside the menu are real
          <Link>s. */}
      <a
        href="/#work"
        {...{ [TRIGGER_ATTR]: "" }}
        aria-haspopup="menu"
        aria-expanded={open}
        // A plain click is always a menu toggle — see the block comment above.
        data-no-curtain=""
        onClick={(event) => {
          // Anything that isn't a plain left click keeps its native behaviour,
          // so cmd/ctrl/middle-click still opens the work section in a new tab.
          if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
          event.preventDefault();
          /*
            Below md the trigger only ever OPENS. The list is inside the pill
            there, so a second tap on Work — the row the thumb is already
            resting against, right above the list it just opened — collapsed
            the pill under the finger, which read as the menu dismissing
            itself. Dismissal on mobile is deliberate and outward: a tap (or a
            hover-out, on a narrow window with a mouse) anywhere outside the
            pill, Escape, or picking a row. Those all still close it.

            From md up the card hangs clear of the pill, so a click on the
            trigger is an unambiguous "put it away" and stays a toggle.
          */
          if (isMobile) onOpen();
          else onToggle();
        }}
        onFocus={(event) => {
          /*
            Keyboard focus opens the menu; a TAP must not.

            A tap focuses the anchor before it clicks it, so wiring this
            straight to "open" made the first tap on a freshly loaded page do
            nothing at all: focus opened the menu, then the click toggled it
            shut again. (The second tap worked, because the anchor was already
            focused and fired no focus event — which is exactly the sort of
            thing that reads as a dead control.)

            :focus-visible is the browser's own answer to "did this focus come
            from the keyboard", so it is the right discriminator rather than
            sniffing pointer types.
          */
          if (event.target.matches(":focus-visible")) onFocusOpen();
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            onOpen();
            onArrowDown();
          }
          if (event.key === "Escape") onClose();
        }}
        /*
          Matches LINK_CLASS in ./site-header — kept in step by hand rather
          than imported, because importing it would drag the header's module
          (and its hooks) into this one for a string.
        */
        className="relative isolate flex w-full items-center justify-center whitespace-nowrap rounded-xs px-xs py-[10px] transition-colors duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)] b-3xs text-nav-ink before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:content-[''] before:transition-[background-color,inset] before:duration-200 before:ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:before:bg-nav-item-hover hover:before:-inset-[1.5px] active:before:bg-nav-item-pressed md:px-sm md:py-[10px] lg:p-xs lg:b-2xs"
      >
        Work
      </a>
    </div>
  );
}

// ─── Rows ────────────────────────────────────────────────────────────────────

/*
  One row. Figma: 64px tall (56px thumbnail + 4px padding), 20px gap, 12px
  radius, hover utility-gray-100, pressed utility-gray-200.

  `current` reuses the pressed token. That is what the designs show: on all
  three frames the second row sits at gray-200 with no cursor on it, while the
  row under the cursor is at gray-100 — so gray-200 doubles as the resting
  state of the page you are already on.
*/
/*
  Row motion. Every row runs this identically and starts on the same frame —
  the parent sets only a delay, not a stagger. The rows carry their own
  transition because a child without one inherits the parent's, and the card's
  is tuned for a 342px box rather than a 64px row. No `exit`: the card fades
  the whole stack out at once.
*/
const rowMotion = {
  hidden: { opacity: 0, y: -6 },
  visible: { opacity: 1, y: 0, transition: { duration: ROW_DURATION, ease: OPEN_EASE } },
};

function Rows({
  currentPath,
  onSelect,
  reduced,
}: {
  currentPath: string;
  onSelect: () => void;
  reduced: boolean;
}) {
  return (
    <>
      {CASE_STUDIES.map((item) => (
        <m.div key={item.href} variants={reduced ? undefined : rowMotion}>
          <Link
            href={item.href}
            role="menuitem"
            aria-current={currentPath === item.href ? "page" : undefined}
            onClick={onSelect}
            /*
              Two sets of state fills, because the rows sit on two different
              surfaces. From md they are on the menu's own card and take its
              tokens — opaque grey steps in light mode, the nav's own alphas in
              dark, where the card shares the pill's surface (see
              --work-menu-* in globals.css). Below md they are INSIDE the nav
              pill, whose fill is already utility-gray-200 — so gray-100 there
              is lighter than the surface (a hover that brightens) and the
              gray-200 current-page fill is invisible against an identical
              background. Mobile therefore uses the nav's own alpha tokens,
              which darken whatever they sit on, exactly like the links above
              them in the same pill.
            */
            className={`flex w-full items-center gap-lg rounded-sm p-3xs transition-colors duration-150 hover:bg-nav-item-hover active:bg-nav-item-pressed md:hover:bg-work-menu-item-hover md:active:bg-work-menu-item-pressed ${
              currentPath === item.href ? "bg-nav-item-pressed md:bg-work-menu-item-pressed" : ""
            }`}
          >
            <GlassImage
              src={item.src}
              alt={item.alt}
              mini
              /*
                56px slot. The measured map in ./image-sizes is built from these
                photos' full-size work-row boxes (1100px+), so it has to be
                overridden here or the menu pulls a 1200px variant for a thumb.
              */
              sizes="56px"
              className="size-[56px] shrink-0"
            />
            {/* text-primary, deliberately not the nav's ink: these rows sit on
                the menu's own opaque card, so they must not follow the bar when
                it retints itself over photography. */}
            <span className="min-w-0 flex-1 b-xs text-text-primary">{item.label}</span>
          </Link>
        </m.div>
      ))}
    </>
  );
}

// ─── Floating card (md and up) ───────────────────────────────────────────────

/*
  Hangs from the NAV's right edge, not the Work link's left.

  Figma anchors it to the left of the Work link container, and that is what
  this did first — but the link containers in the design are 167px wide, while
  the real nav's Work cell is only as wide as the word. Measured across every
  width the card can appear at, a left anchor put the card off-screen at 1024
  and 1280 (right edge 1093 and 1285) and clipped it mid-label on tablet. The
  nav's own right edge is the one edge guaranteed to sit inside the page gutter
  at every width, so the card hangs from that instead: 342px wide, right edges
  flush, which lands it under the Work/About/toggle cluster and still reads as
  belonging to Work.

  Vertically it sits flush against the nav, no gap. That is what the design
  has: the "Work nav" frame's top is y=76.7, and the real pill's bottom edge at
  1728 is y=76 (20px of header padding + a 56px pill). The 8px gap this
  carried at first was invented, and read as detached.

  The deviation from Figma is ~69px of horizontal position on a wide desktop —
  everything else (342px width, 8px padding, 4px gaps, 64px rows, and the
  vertical join above) is exact.
*/
export function WorkMenuPanel({
  open,
  hoverOpens,
  currentPath,
  onClose,
  onCancelClose,
  onScheduleClose,
}: {
  open: boolean;
  /** A real pointer is present, so hover opens the menu and click navigates. */
  hoverOpens: boolean;
  currentPath: string;
  onClose: () => void;
  onCancelClose: () => void;
  onScheduleClose: () => void;
}) {
  const reduced = useReducedMotion();

  return (
    <AnimatePresence>
      {open && (
        <m.div
          /*
            Marks the card as part of the menu. Load-bearing since the card
            moved out of the trigger's wrapper: without it a pointer-down on a
            row reads as an outside click and closes the menu underneath the
            press, and ArrowDown cannot find the first row to focus.
          */
          {...{ [SCOPE_ATTR]: "" }}
          role="menu"
          aria-label="Case studies"
          onMouseEnter={hoverOpens ? onCancelClose : undefined}
          onMouseLeave={hoverOpens ? onScheduleClose : undefined}
          variants={
            reduced
              ? {
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { duration: 0.12 } },
                  exit: { opacity: 0, transition: { duration: 0.1 } },
                }
              : {
                  // Starts tucked 6px up behind the nav and slightly small, so
                  // it reads as coming out from under the bar it hangs off
                  // rather than appearing in place.
                  hidden: { opacity: 0, y: -6, scale: 0.97 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      duration: OPEN_DURATION,
                      ease: OPEN_EASE,
                      delayChildren: ROW_DELAY,
                    },
                  },
                  exit: {
                    opacity: 0,
                    y: -4,
                    scale: 0.985,
                    transition: { duration: CLOSE_DURATION, ease: CLOSE_EASE },
                  },
                }
          }
          initial="hidden"
          animate="visible"
          exit="exit"
          // Grows out of the corner it hangs from rather than its own middle.
          style={{ transformOrigin: "top right" }}
          className="absolute right-0 top-full z-10 hidden w-[342px] max-w-full flex-col gap-3xs rounded-md border border-border-overlay bg-work-menu-surface p-xs drop-shadow-[0_2px_7.5px_var(--shadows-shadow-02)] md:flex"
        >
          <Rows currentPath={currentPath} onSelect={onClose} reduced={!!reduced} />
        </m.div>
      )}
    </AnimatePresence>
  );
}

// ─── Inline list (mobile) ────────────────────────────────────────────────────

/*
  Below md the pill itself grows: the list is a full-width row of the nav's own
  grid, so the glass surface (which is `absolute inset-0` on the nav) stretches
  to cover it and the whole thing reads as one expanding card.

  Height is what animates, not transform — the pill has to actually occupy the
  space, and a scale would smear the type. `overflow-hidden` is what gives
  height:auto something to clip against on the way out.
*/
export function WorkMenuMobileList({
  open,
  hoverOpens,
  currentPath,
  onClose,
  onCancelClose,
  onScheduleClose,
}: {
  open: boolean;
  hoverOpens: boolean;
  currentPath: string;
  onClose: () => void;
  onCancelClose: () => void;
  onScheduleClose: () => void;
}) {
  const reduced = useReducedMotion();

  return (
    <AnimatePresence initial={false}>
      {open && (
        <m.div
          {...{ [SCOPE_ATTR]: "" }}
          role="menu"
          aria-label="Case studies"
          /*
            Same hover pairing the floating card has, and for a sharper reason:
            this list is a SIBLING row of the nav grid, not a child of the
            trigger's wrapper, so moving the pointer down off Work and onto the
            rows fires the wrapper's mouseleave and nothing was cancelling the
            close it scheduled. The menu closed on the way to the very links it
            was offering. Cancelling here makes the trigger and the list read as
            one hover surface; leaving the list still closes it.
          */
          onMouseEnter={hoverOpens ? onCancelClose : undefined}
          onMouseLeave={hoverOpens ? onScheduleClose : undefined}
          variants={{
            hidden: { height: 0, opacity: 0 },
            visible: {
              height: "auto",
              opacity: 1,
              transition: {
                height: { duration: reduced ? 0 : 0.32, ease: OPEN_EASE },
                // Opacity finishes well before the height does, so the rows are
                // solid while the pill is still growing — fading in step with
                // the height makes the whole card look like it is dissolving.
                opacity: { duration: reduced ? 0 : 0.16, ease: OPEN_EASE },
                delayChildren: reduced ? 0 : ROW_DELAY,
              },
            },
            exit: {
              height: 0,
              opacity: 0,
              transition: {
                height: { duration: reduced ? 0 : 0.2, ease: CLOSE_EASE },
                opacity: { duration: reduced ? 0 : 0.12, ease: CLOSE_EASE },
              },
            },
          }}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="relative col-span-5 col-start-1 overflow-hidden md:hidden"
        >
          <div className="flex flex-col gap-3xs">
            <Rows currentPath={currentPath} onSelect={onClose} reduced={!!reduced} />
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
