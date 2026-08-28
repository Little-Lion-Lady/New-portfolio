import { SiteHeader } from "./components/site-header";
import { Button } from "./components/button";
import { Reveal, RevealWords } from "./components/reveal";

// Figma 404 (99:2837 desktop / 436:17550 tablet / 269:3740 mobile).
// Page padding is a flat 16/40/40 on all four sides; the header overlays it.
// The hero grows to fill whatever is left and centres the title inside its own
// generous padding, and the helper row sits at the bottom.
//
// Height: the page is max(700px, viewport) — never shorter than 700px — and on
// desktop that is its exact height, not just a floor, so the helper row stays
// above the fold instead of being pushed under it.
//
// That only holds if the hero can give the space back, so its desktop padding
// is viewport-relative rather than the fixed 260/160 from Figma: those are the
// values at a tall window and they collapse on a short one. Fixed padding was
// the actual cause of the overflow — it does not shrink, so `min-h-svh` was a
// floor the content sailed straight past (1068px of content in a 900px
// window). min-h-0 on both flex items lets them size below their content.
//
// Below 700px of viewport the row is necessarily under the fold: the page is
// 700px tall by request, so it scrolls.
export default function NotFound() {
  return (
    <main className="[--page-gutter:var(--spacing-md)] md:[--page-gutter:var(--spacing-3xl)] lg:[--page-gutter:var(--spacing-3xl)] relative flex min-h-[max(700px,100svh)] flex-col bg-bg-primary p-md text-text-primary md:p-3xl lg:h-[max(700px,100svh)]">
      <SiteHeader />

      {/* Fills the viewport, pushing the helper row to the bottom. */}
      <div className="relative z-10 flex min-h-0 flex-1 flex-col justify-between lg:pb-[clamp(16px,4svh,72px)]">
        {/* Hero — title centred in its own padding. */}
        <div className="flex min-h-0 flex-1 flex-col justify-center gap-lg py-8xl md:pb-8xl md:pt-9xl lg:pb-[clamp(24px,6svh,160px)] lg:pt-[clamp(32px,12svh,260px)]">
          {/* The two lines overlap: Figma pulls the second up by 40 at desktop
              and 24 at tablet. Expressed in em so the overlap tracks the
              clamped font size instead of drifting as it scales. */}
          <div className="flex flex-col">
            <RevealWords
              as="h1"
              className="notfound-title whitespace-nowrap text-text-primary-highlight md:-mb-[0.1935em] lg:-mb-[0.1786em]"
            >
              Oops
            </RevealWords>
            <RevealWords
              as="p"
              startIndex={1}
              className="notfound-title whitespace-nowrap text-text-highlight-dark"
            >
              404 error
            </RevealWords>
          </div>
        </div>

        {/* Helper — stacked on mobile; from tablet a 9-col grid (copy in 1-3
            and 4-5, button hard right), and a 12-col one on desktop (5-7 and
            8-9). Gutter is 32 at both.
            The two lines never wrap: Figma sizes them as fixed 258px text boxes
            that overflow their own cell rather than reflowing (the desktop
            "I can fix this" sits at x=-5 inside a 248px cell), so nowrap is
            what keeps them on one line in the narrow cells just above 1024. */}
        <div className="flex flex-col items-start gap-3xl md:grid md:grid-cols-9 md:items-center md:gap-2xl lg:grid-cols-12">
          <div className="flex w-[258px] flex-col gap-lg md:contents">
            <Reveal
              index={0}
              delay={0.5}
              as="p"
              className="b-sm whitespace-nowrap text-text-secondary md:b-md md:col-start-1 md:col-span-3 lg:col-start-5 lg:col-span-3"
            >
              Are you lost?
            </Reveal>
            <Reveal
              index={1}
              delay={0.5}
              as="p"
              className="b-sm whitespace-nowrap text-text-secondary md:b-md md:col-start-4 md:col-span-2 lg:col-start-8 lg:col-span-2"
            >
              I can fix this
            </Reveal>
          </div>
          <Reveal
            index={2}
            delay={0.5}
            className="self-start md:col-start-6 md:col-span-4 md:justify-self-end lg:col-start-10 lg:col-span-3"
          >
            <Button variant="primary" label="Go home" href="/" />
          </Reveal>
        </div>
      </div>
    </main>
  );
}
