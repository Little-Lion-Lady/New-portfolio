import { SiteHeader } from "./components/site-header";
import { Button } from "./components/button";
import { Reveal, RevealWords } from "./components/reveal";

// Figma 404 (99:2837 desktop / 436:17550 tablet / 269:3740 mobile).
// Page padding is a flat 16/40/40 on all four sides; the header overlays it.
// The hero grows to fill whatever is left and centres the title inside its own
// generous padding, and the helper row sits at the bottom.
export default function NotFound() {
  return (
    <main className="[--page-gutter:var(--spacing-md)] md:[--page-gutter:var(--spacing-3xl)] lg:[--page-gutter:var(--spacing-3xl)] relative flex min-h-svh flex-col bg-bg-primary p-md text-text-primary md:p-3xl">
      <SiteHeader />

      {/* Fills the viewport, pushing the helper row to the bottom. */}
      <div className="relative z-10 flex flex-1 flex-col justify-between lg:pb-7xl">
        {/* Hero — title centred in its own padding. */}
        <div className="flex flex-1 flex-col justify-center gap-lg py-8xl md:pb-8xl md:pt-9xl lg:pb-9xl lg:pt-[260px]">
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
