import { Reveal, RevealWords } from "./reveal";
import { DURATION } from "./motion-timing";

// The case-study intro settles 30% slower than block reveals elsewhere on the
// site. Written as a multiple of the shared DURATION rather than a literal, so
// a future change to the site-wide block timing carries through here instead
// of leaving this page stranded on an old number.
//
// DURATION comes from ./motion-timing, NOT from ./reveal: this file is a
// Server Component, and a "use client" module's export reaches it as a client
// reference rather than a number — the multiplication would quietly yield NaN.
const INTRO_DURATION = DURATION * 1.3;

// How long the description, meta and carousel wait behind the title. The title
// is four words on a 35ms cascade, so it is essentially all there by ~0.1s and
// only its tail is still resolving — 0.6s left a visible gap after it rather
// than a handover.
const INTRO_DELAY = 0.3;
import { ImageCarousel, type WorkImageData } from "./work-image";
import { TitleStars } from "./title-stars";

// Figma "Hero" (393:15572 desktop / tablet / mobile).
// Title (two-tone, fluid) + description (lead + body) + meta + image carousel.
//   title    — case-hero-title (D-xs→D-md→D-2xl); line 1 primary-highlight, line 2 50% overlay
//              revealed word-by-word (RevealWords), matching the About hero
//   layout   — mobile/tablet stack text→meta; desktop 12-col grid (meta c2-6 | text c7-12)
//   meta     — always a single column (meta rows then recognition rows stacked)
//   images   — ImageCarousel (same cards as the home work section), size="lg" so
//              the desktop cards are 500px tall instead of 400px
function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start">
      <p className="b-2xs whitespace-nowrap text-text-tertiary lg:b-sm">{label}</p>
      {/* Value wraps rather than clipping — First Table's Scope line is long
          enough to run past the mobile gutter (it overflows in Figma too). */}
      <p className="b-2xs min-w-0 text-text-secondary lg:b-sm">{value}</p>
    </div>
  );
}

type MetaItem = { label: string; value: string };

export function CaseStudyHero({
  titleTop,
  titleBottom,
  lead,
  description,
  meta,
  recognition,
  images,
}: {
  titleTop: string;
  titleBottom: string;
  lead: string;
  description: string;
  meta: MetaItem[];
  recognition: MetaItem[];
  images: WorkImageData[];
}) {
  // Second title line continues the word-reveal sequence after the first line's words.
  const topWordCount = titleTop.trim().split(/\s+/).length;

  return (
    <div className="flex w-full flex-col gap-r-lg">
      {/* Title + description (inner Hero block) */}
      <div className="flex w-full flex-col gap-3xl pt-2xl md:pt-sm lg:gap-7xl lg:pt-3xl">
        {/* Title — two lines, fluid, revealed word-by-word. `immediate` (like the
            rest of the hero) so it reveals on mount: an in-view trigger only
            fires once scroll restoration settles, which on a client-side nav
            from the bottom of another page landed the title *after* everything
            else instead of first. */}
        <TitleStars>
          <h1 className="case-hero-title flex flex-col whitespace-nowrap">
            <RevealWords immediate as="span" className="block text-text-primary-highlight [margin-bottom:-0.0909em] md:[margin-bottom:-0.2em] lg:[margin-bottom:-0.2857em]">
              {titleTop}
            </RevealWords>
            <RevealWords immediate as="span" startIndex={topWordCount} className="block text-text-primary-overlay">
              {titleBottom}
            </RevealWords>
          </h1>
        </TitleStars>

        {/* Description — stacked on mobile/tablet, grid (meta | text) on desktop.
            Text, meta and images all reveal together 0.6s in — over the tail of
            the word-by-word title — with the same 16px y-lift the home page
            uses. */}
        <div className="flex flex-col gap-md md:gap-lg lg:grid lg:grid-cols-12 lg:gap-x-lg">
          {/* Text block (desktop: right, c7-12) */}
          <Reveal immediate delay={INTRO_DELAY} duration={INTRO_DURATION} className="flex flex-col lg:col-start-7 lg:col-span-6 lg:justify-center">
            {/* B-2xs→B-xs→B-sm (14/24, 16/26, 20/32) — the description sits a step
                below the meta rows' desktop size, not above it. */}
            <p className="b-2xs text-text-primary-highlight md:b-xs lg:b-sm">{lead}</p>
            <p className="b-2xs text-text-secondary md:b-xs lg:b-sm">{description}</p>
          </Reveal>

          {/* Meta block (desktop: left, c1-5) — in step with the text block.
              Mobile and desktop stack the context rows over the recognition
              rows; tablet alone splits them across Figma's 9-col grid (c1-3
              and c5-7). */}
          <Reveal immediate delay={INTRO_DELAY} duration={INTRO_DURATION} className="flex flex-col md:grid md:grid-cols-9 md:gap-x-lg lg:flex lg:flex-col lg:col-start-1 lg:col-span-5 lg:row-start-1">
            <div className="flex flex-col md:col-start-1 md:col-span-3">
              {meta.map((m, i) => (
                <MetaRow key={i} label={m.label} value={m.value} />
              ))}
            </div>
            <div className="flex flex-col md:col-start-5 md:col-span-4">
              {recognition.map((r, i) => (
                <MetaRow key={i} label={r.label} value={r.value} />
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      {/* Image carousel. Reveals with the description and meta — title+stars
          first, then everything else together.
          Loops like the home page's work rows; `items-center` on the wrapper is
          what lets the over-wide track bleed symmetrically past the page gutter
          (see ImageCarousel), and speedScale holds it at the home rows' px/s
          despite carrying three cards instead of five. */}
      <Reveal immediate delay={INTRO_DELAY} className="flex w-full flex-col items-center">
        <ImageCarousel
          images={images}
          size="lg"
          marquee
          speedScale={images.length / 5}
          /* The hero rail is the one thing above the fold on a case study, and
             it loads eagerly like every marquee — rank it above the collages
             further down so it is not queued behind them. */
          fetchPriority="high"
        />
      </Reveal>
    </div>
  );
}
