import { Reveal, RevealWords } from "./reveal";
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
          <Reveal immediate delay={0.6} className="flex flex-col lg:col-start-7 lg:col-span-6 lg:justify-center">
            <p className="b-xs text-text-primary-highlight md:b-sm lg:b-md">{lead}</p>
            <p className="b-xs text-text-secondary md:b-sm lg:b-md">{description}</p>
          </Reveal>

          {/* Meta block (desktop: left, c1-5) — in step with the text block.
              Mobile and desktop stack the context rows over the recognition
              rows; tablet alone splits them across Figma's 9-col grid (c1-3
              and c5-7). */}
          <Reveal immediate delay={0.6} className="flex flex-col md:grid md:grid-cols-9 md:gap-x-lg lg:flex lg:flex-col lg:col-start-1 lg:col-span-5 lg:row-start-1">
            <div className="flex flex-col md:col-start-1 md:col-span-3">
              {meta.map((m, i) => (
                <MetaRow key={i} label={m.label} value={m.value} />
              ))}
            </div>
            <div className="flex flex-col md:col-start-5 md:col-span-3">
              {recognition.map((r, i) => (
                <MetaRow key={i} label={r.label} value={r.value} />
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      {/* Image carousel. Reveals with the description and meta — title+stars
          first, then everything else together. */}
      <Reveal immediate delay={0.6} className="w-full">
        <ImageCarousel images={images} size="lg" />
      </Reveal>
    </div>
  );
}
