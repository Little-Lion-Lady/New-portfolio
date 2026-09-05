import { Fragment } from "react";
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
// is two lines, the second starting 0.15s behind the first, so at 0.3s both
// are still resolving and the handover overlaps rather than queues.
const INTRO_DELAY = 0.3;
import { ImageCarousel } from "./image-carousel";
import type { WorkImageData } from "./work-image";
import { TitleStars } from "./title-stars";
import { ArrowUpRightSmall } from "./icons";

// Figma "Hero" (393:15572 desktop / tablet / mobile).
// Title (two-tone, fluid) + description (lead + body) + meta + image carousel.
//   title    — case-hero-title (D-xs→D-md→D-2xl); line 1 primary-highlight, line 2 50% overlay
//              revealed a line at a time (RevealWords byLine), matching every other hero
//   layout   — mobile/tablet stack text→meta; desktop 12-col grid (meta c2-6 | text c7-12)
//   meta     — always a single column (meta rows then recognition rows stacked)
//   images   — ImageCarousel (same cards as the home work section), size="lg" so
//              the desktop cards are 500px tall instead of 400px
/*
  A meta row, optionally a link out.

  With `href` the whole row becomes the target and wears the About page's
  awards-table treatment: the same ::before fill (utility-gray-100 lifting to
  -200 when pressed) on the same 200ms [0.25, 0.1, 0.25, 1] curve, the same
  nudge outwards on hover, the text stepping up to text-primary, and the arrow
  drifting up-right. Written out rather than shared with the About page because
  the two rows are different shapes — that one is a 6-column grid, this is a
  label/value pair — so only the state treatment is common, and lifting it into
  a component would leave a wrapper that takes the fill classes as a prop.

  The fill is on a pseudo-element for the same reason it is there: these rows
  sit flush in a flex column, so real padding would push them apart.
*/
/*
  Splits a "·"-separated value into per-item nowrap spans.

  Without this the value wraps on its own spaces, so a long Scope line breaks
  mid-item ("…Research·A/B" / "testing"). Each item is held together and the
  only break opportunities are the separators, which is where the eye expects
  the line to turn. Values with no "·" (a job title, an award name) keep normal
  word wrapping — one long phrase has to break somewhere.
*/
function wrapAtSeparators(value: string) {
  if (!value.includes("·")) return value;
  const items = value.split("·");
  return items.map((item, i) => (
    <Fragment key={i}>
      <span className="whitespace-nowrap">
        {item}
        {i < items.length - 1 && "·"}
      </span>
      {/* Adjacent inline spans with no whitespace between them carry no soft
          wrap opportunity, so nowrap items alone would push the whole line to
          overflow. <wbr> is the break the separator itself does not provide. */}
      {i < items.length - 1 && <wbr />}
    </Fragment>
  ));
}

function MetaRow({ label, value, href }: { label: string; value: string; href?: string }) {
  const content = (
    <>
      <p className="b-2xs whitespace-nowrap text-text-tertiary transition-colors lg:b-sm group-hover:text-text-primary">{label}</p>
      {/* Value wraps rather than clipping — First Table's Scope line is long
          enough to run past the mobile gutter (it overflows in Figma too).
          The arrow is inline INSIDE this paragraph, not a flex sibling, so it
          follows the last word onto whatever line that ends up on instead of
          being pinned to the row's top-right. */}
      <p className="b-2xs min-w-0 text-text-secondary transition-colors lg:b-sm group-hover:text-text-primary">
        {wrapAtSeparators(value)}
        {href && (
          <ArrowUpRightSmall className="ml-3xs inline-block size-sm align-[-0.15em] transition-transform duration-200 ease-out group-hover:translate-x-[2px] group-hover:-translate-y-[2px] group-hover:scale-[1.1] lg:size-lg lg:align-[-0.2em]" />
        )}
      </p>
    </>
  );

  if (!href) {
    return <div className="flex items-start">{content}</div>;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      /* self-start: the row is a flex item in a column, so it would otherwise
         stretch the full meta width and the hover fill would run far past the
         text. Hugging the content keeps the fill on the words. */
      className="group relative isolate flex max-w-full items-start self-start before:absolute before:-inset-x-xs before:-inset-y-3xs before:-z-10 before:rounded-xs before:content-[''] before:transition-[background-color,inset] before:duration-200 before:ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:before:-inset-x-[9.5px] hover:before:-inset-y-[5.5px] hover:before:bg-utility-gray-100 active:before:bg-utility-gray-200"
    >
      {content}
    </a>
  );
}

type MetaItem = { label: string; value: string; href?: string };

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
  return (
    <div className="flex w-full flex-col gap-r-lg">
      {/* Title + description (inner Hero block) */}
      <div className="flex w-full flex-col gap-3xl pt-2xl md:pt-6xl lg:gap-7xl lg:pt-3xl">
        {/* Title — two lines, fluid, revealed a line at a time. `immediate` (like the
            rest of the hero) so it reveals on mount: an in-view trigger only
            fires once scroll restoration settles, which on a client-side nav
            from the bottom of another page landed the title *after* everything
            else instead of first. */}
        <TitleStars>
          <h1 className="case-hero-title flex flex-col whitespace-nowrap">
            <RevealWords immediate byLine as="span" className="block text-text-primary-highlight [margin-bottom:-0.0909em] md:[margin-bottom:-0.2em] lg:[margin-bottom:-0.2857em]">
              {titleTop}
            </RevealWords>
            {/* Each line is its own nowrap span, so this one is line 1 of the
                headline even though it measures as line 0 of its own element. */}
            <RevealWords immediate byLine as="span" startLine={1} className="block text-text-primary-overlay">
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
            {/* Body steps 16 → 20 (b-xs → b-sm). It used to start at 14 on
                mobile, which read small against the hero title; the old md:b-xs
                is gone rather than left in place, since the base now carries
                that size all the way to lg. */}
            <p className="b-xs text-text-primary-highlight lg:b-sm">{lead}</p>
            <p className="b-xs text-text-secondary lg:b-sm">{description}</p>
          </Reveal>

          {/* Meta block (desktop: left, c1-6) — in step with the text block.
              Mobile and desktop stack the context rows over the recognition
              rows; tablet alone splits them across Figma's 9-col grid (c1-4
              and c6-9). */}
          <Reveal immediate delay={INTRO_DELAY} duration={INTRO_DURATION} className="flex flex-col md:grid md:grid-cols-9 md:gap-x-lg lg:flex lg:flex-col lg:col-start-1 lg:col-span-6 lg:row-start-1">
            <div className="flex flex-col md:col-start-1 md:col-span-4">
              {meta.map((m, i) => (
                <MetaRow key={i} label={m.label} value={m.value} />
              ))}
            </div>
            <div className="flex flex-col md:col-start-6 md:col-span-4">
              {recognition.map((r, i) => (
                <MetaRow key={i} label={r.label} value={r.value} href={r.href} />
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
          /* The hero rail is the one thing above the fold on a case study, so
             it opts out of the rails' load gate: waiting on an
             IntersectionObserver callback would cost the LCP a round trip for
             no saving, since this rail is on screen from the first paint.
             "high" then ranks it above the collages further down the page. */
          eager
          fetchPriority="high"
        />
      </Reveal>
    </div>
  );
}
