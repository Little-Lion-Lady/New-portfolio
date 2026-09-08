import { RevealWords } from "./reveal";

const TEXT_STYLE = {
  fontFamily: "var(--font-family-body)",
  fontWeight: "var(--font-weight-book)",
  lineHeight: 1.2,
  letterSpacing: "-0.02em",
} as const;

const HL = { color: "var(--text-primary-highlight)" };

/*
  HeroText
  ────────
  The home headline. Two fixed sizes, set in CSS.

  This used to fit its own type: a hidden probe paragraph, a 24-iteration
  binary search on font-size against the box's height, a ResizeObserver to
  redo it on every resize, and a second pass once document.fonts.ready
  resolved. The result was then capped by MAX_FONT_SIZE / TABLET_MAX_FONT_SIZE
  / MOBILE_MAX_FONT_SIZE — and on most viewports the CAP, not the fit, is what
  set the size. The search was doing 48 forced synchronous layouts to arrive,
  most of the time, at a number that was already written down.

  What it cost was the whole reason the page failed Core Web Vitals. The
  headline could not reveal until it had been fitted, the fit could not run
  until React had hydrated, and so the largest text on the page sat at opacity
  0 until 3071ms on a throttled phone — measured — with LCP landing at 5328ms
  against a 2.5s budget. Nothing about that was network: the page had painted
  at 684ms.

  Fixed at the former ceilings, which is what the design was drawn at:

      < 500px    24px
      >= 500px   44px

  (Tablet and desktop already shared 44 — see the old TABLET_MAX_FONT_SIZE.)
  The 500px boundary is the hero's own, not the site-wide md of 768: the
  headline IS the viewport here and reads as a phone layout well past the
  width where the rest of the page stops being one. The utilities in page.tsx
  use `min-[500px]:` for the same reason.

  The trade, stated plainly: on a viewport short enough that the fit would
  have returned something under the cap, the copy now takes more lines rather
  than shrinking. The hero's own box grows with its content, and nothing
  downstream is pinned to a line count — the reveal measures the wrap it
  actually gets, and HeroClose and AfterHeroReveal derive their timing from
  the count it publishes.

  With the fit gone this is a Server Component: no state, no effects, nothing
  to hydrate. The reveal it wraps is CSS, started by an inline script during
  parse (see RevealWords).
*/
export function HeroText({
  className,
  revealDelay = 0,
}: {
  className?: string;
  revealDelay?: number;
}) {
  return (
    <div className={className} style={{ position: "relative" }}>
      <div className="relative w-full">
        <RevealWords
          immediate
          byLine
          delay={revealDelay}
          as="h1"
          className="w-full text-[24px] min-[500px]:text-[44px]"
          style={{
            ...TEXT_STYLE,
            color: "var(--text-primary-overlay)",
          }}
        >
          I&apos;m a <span style={HL}>Lead Product Designer </span>specialising in{" "}
          <span style={HL}>product growth </span>with a track record of shipping{" "}
          <span style={HL}>delightful interfaces </span>and research-backed experiences that{" "}
          <span style={HL}>move the numbers</span>. Currently <span style={HL}>leading design</span>{" "}
          at First Table.
        </RevealWords>
      </div>
    </div>
  );
}
