import { Fragment } from "react";
import type { Metadata } from "next";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";
import { SectionHeader } from "../components/section-header";
import { Button } from "../components/button";
import { SectionReveal } from "../components/section-reveal-context";
import { Reveal, RevealWords } from "../components/reveal";
import { Divider } from "../components/divider";
import { ArrowUpRightSmall } from "../components/icons";
import { BioCollage } from "../components/bio-collage";
import { CaseStudyNav } from "../components/case-study-nav";
import { ArtworkStrip } from "../components/artwork-strip";
import { TitleStars } from "../components/title-stars";

const experience = [
  { role: "Lead Product Designer", org: "First Table | Marketplace", project: "First Table app", year: "25’ – Now" },
  { role: "Senior Product Designer", org: "Basis | Startup", project: "Basis Home app", year: "22’ – 25’" },
  { role: "Senior Product Designer", org: "Serko | Business product", project: "Booking.com for Business", year: "21’ – 22’" },
  { role: "Senior Product Designer", org: "RUSH | Agency", project: "NZ Covid Tracer App, Eroad", year: "20’ – 21’" },
  { role: "Product Designer", org: "RUSH | Agency", project: "Google, Z energy, Frankie", year: "18’ – 20’" },
];

// Newest first; within a year, highest honour first (Purple, Gold, Silver,
// Finalist). The two Starship rows are the same project entered in two
// categories — Interactive and Spatial — hence the two separate listings.
const awards = [
  { project: "First Table app", award: "Best Design Finalist", year: "26’", href: "https://bestawards.co.nz/digital/digital-products/first-table/first-table-app/" },
  { project: "Basis Smart Panel", award: "Best Design Gold", year: "25’", href: "https://bestawards.co.nz/industrial-design/consumer/basis/basis-smart-panel-1/" },
  { project: "NZ COVID Tracer app", award: "Best Design Gold", year: "21’", href: "https://bestawards.co.nz/digital/digital-products/rush-1/nz-covid-tracer-app/" },
  { project: "Ignite Wellbeing Platform", award: "Best Design Finalist", year: "21’", href: "https://bestawards.co.nz/digital/user-experience/rush-1/ignite-wellbeing-platform-1/" },
  { project: "Z Energy Sharetank", award: "Best Design Gold", year: "20’", href: "https://bestawards.co.nz/digital/user-experience/z-energy-innovation-refinery/z-energy-sharetank/" },
  { project: "Starship Check-Up", award: "Best Design Purple", year: "18’", href: "https://bestawards.co.nz/user-experience-award/interactive/rush-1/starship-animal-check-ups-magical-forest/" },
  { project: "Z Fastlane", award: "Best Design Gold", year: "18’", href: "https://bestawards.co.nz/user-experience-award/optimising/rush-1/z-fastlane-best-award-submission/" },
  { project: "Starship Animal Check Ups & Magical Forest", award: "Best Design Silver", year: "18’", href: "https://bestawards.co.nz/user-experience-award/spatial/rush-1/starship-animal-check-ups-magical-forest-3/" },
];

const artwork = ["ART1", "ART2", "ART3", "ART4", "ART5", "ART6", "ART7"];

export const metadata: Metadata = {
  title: "About — Maryna Babych",
  description:
    "I've been designing products since 2018: agency work including the NZ COVID Tracer app, then a startup, and now a marketplace. I spend as much time on understanding the people I'm designing for as on design craft, and I hold both to the same standard. Maryna Babych, Lead Product Designer in Auckland, New Zealand.",
};

export default function About() {
  return (
    <main className="[--page-gutter:var(--spacing-md)] md:[--page-gutter:var(--spacing-3xl)] lg:[--page-gutter:var(--spacing-3xl)] page-shell relative flex flex-col gap-3xl bg-bg-primary px-md pb-0 pt-md text-text-primary md:gap-6xl md:px-3xl md:pt-3xl lg:gap-6xl lg:px-3xl lg:pb-0 lg:pt-3xl">
      {/* Gradient + header + hero grouped so the section gap isn't inserted between them */}
      <div>
        <SiteHeader />

        {/* Hero. Figma pads the page itself by spacing-md/3xl/3xl and lets the
            (absolutely positioned) header overlay it, so the hero's own
            padding is what places the title: pt 64/96/128 on the section,
            plus the Hero-text-container's own 0/24/32 on TitleStars.

            Well down the spacing scale from Figma's 80/128/160 top and
            80/72/128 bottom. Bottom is now 40/40/32 and top 64/80/72. The title shrank to match the case-study ramp
            (96px on desktop, down from a fluid 124-142), which left the hero
            reading as mostly empty space at the original padding — and the
            bigger the viewport, the more of it there was, so the wider
            breakpoints are cut hardest. Desktop now sits tighter than tablet
            rather than looser. The top still clears the fixed header at every
            breakpoint. */}
        <section className="relative z-10 pb-3xl pt-4xl md:pb-3xl md:pt-6xl lg:pb-2xl lg:pt-5xl">
          <TitleStars className="relative md:pt-xl lg:pt-2xl">
            <RevealWords immediate byLine as="h1" className="about-hero-title text-text-primary-highlight">Who am I?</RevealWords>
          </TitleStars>
        </section>
      </div>

      {/* Hero rule — fades in between the title and the Overview header, so the
          three land in reading order: words from 0s, rule at 0.15s, header at
          0.25s. Halved from 0.3/0.5: the reveal itself runs 910ms on a curve
          that is ~93% resolved at half of that, so a half-second lead-in on top
          of it read as the page hesitating before it started. The order is what
          the offsets are for, and it survives the tighter spacing — the rule
          still leaves rest while the title is mid-blur, and the header while
          the rule is.

          `noY` because a 16px lift on a 1px rule reads as a glitch, not a
          reveal; `immediate` matches the title and header, which both reveal on
          mount rather than on an in-view trigger. */}
      <Reveal immediate noY delay={0.15} className="w-full">
        <Divider />
      </Reveal>

      {/* 01 — Overview. Figma closes the section with pb --lg/--xl/--lg
          (32/72/64) before the next rule. */}
      <SectionReveal as="section" immediate className="flex flex-col gap-r-xl pb-r-lg md:pb-r-xl lg:pb-r-lg">
        <Reveal index={0} delay={0.25} className="w-full">
          <SectionHeader number="01" name="Overview" />
        </Reveal>

        {/* Desktop: Figma's 12-column content grid (20px gutters) — description
            in columns 1-5, history in 7-12, so column 6 is left empty.
            Tablet/mobile: stacked (description → history), gap 80/40. */}
        <Reveal index={1} delay={0.25} className="flex flex-col gap-3xl md:gap-6xl wide:grid wide:grid-cols-12 wide:items-start wide:gap-lg">
          {/* Description + CV button */}
          <div className="flex flex-col gap-2xl md:gap-3xl md:pb-2xl wide:col-start-1 wide:col-span-5">
            {/* Paragraphs at gap-r-sm. The container's gap-3xl separates
                this block from the CV button, so sibling <p>s would sit far
                enough apart to read as separate sections. */}
            <div className="flex flex-col gap-r-sm">
              <p className="b-xs text-text-secondary md:b-sm">
                I lead design direction, systems, and research, and I still stay hands-on with the
                tools. I&apos;ve designed products with the teams that build them: in agencies,
                startups, and now a mature product company. Agency work taught me to move fast and
                validate early. Product work taught me to own things past launch. Both left me with
                the same aim: make the product easy to use, make a real impact on the business and
                the people using it, and leave the team with the systems and evidence to keep it
                that way.
              </p>
            </div>
            <Button
              variant="primary"
              label="View CV"
              href="https://drive.google.com/file/d/1IS3YF8ZU8F0Hq9wtomTK1RdZa4r5vrXl/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              external
              className="self-start"
            />
          </div>

          {/* Experience + Recognition tables */}
          <div className="flex flex-col gap-r-xl wide:col-start-7 wide:col-span-6">
            {/* ── Experience ── */}
            <div className="flex flex-col gap-r-sm">
              <div>
                {/* pt on mobile only: from md the two columns sit side by
                    side and the grid's own gap does this, but stacked they run
                    straight on from the CV button above. */}
                <p className="b-xs md:b-sm text-text-primary pt-lg mb-sm md:pt-0">Experience</p>
                <Divider />
              </div>
              <div className="flex flex-col gap-md md:gap-sm lg:gap-md">
                {experience.map((e, i) => (
                  <Fragment key={i}>
                    {/* Mobile: role + year on one row, org below, project (tertiary) below */}
                    <div className="flex flex-col md:hidden">
                      <div className="flex justify-between">
                        <p className="b-xs text-text-secondary">{e.role}</p>
                        <p className="b-xs text-text-secondary">{e.year}</p>
                      </div>
                      <p className="b-xs text-text-secondary">{e.org}</p>
                      <p className="b-xs text-text-tertiary">{e.project}</p>
                    </div>
                    {/* Tablet: 3-col (role+org | project | year).
                        Desktop: 6-col (role+org 1-2 | project 3-4 | year 6). */}
                    <div className="hidden md:grid md:grid-cols-3 md:gap-x-lg md:items-start lg:grid-cols-6">
                      <div className="flex flex-col md:col-span-1 lg:col-span-2">
                        <p className="b-xs text-text-secondary">{e.role}</p>
                        <p className="b-xs text-text-tertiary">{e.org}</p>
                      </div>
                      <p className="b-xs text-text-secondary md:col-span-1 lg:col-start-3 lg:col-span-2">{e.project}</p>
                      <p className="b-xs text-text-secondary text-right md:col-span-1 lg:col-start-6">{e.year}</p>
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>

            {/* ── Recognition ── */}
            <div className="flex flex-col gap-r-sm">
              <div>
                <p className="b-xs md:b-sm text-text-primary mb-sm">Recognition</p>
                <Divider />
              </div>
              <div className="flex flex-col gap-md md:gap-xs lg:gap-sm">
                {awards.map((a, i) => (
                  /*
                    Hover/pressed fill on the whole row. The motion is the nav
                    bar's (see NAV_ITEM_STATES in ../components/site-header): a
                    ::before that carries the fill and grows outward 1.5px, over
                    200ms on Framer's [0.25, 0.1, 0.25, 1] — the CSS `ease`. The
                    colours are the case study nav's, utility-gray-100 lifting to
                    -200 when pressed.

                    The fill lives on a ::before rather than on padding plus a
                    negative margin (the way CaseStudyNav does it) because these
                    rows sit in a flex column: real padding would push them
                    apart, and an absolutely positioned pseudo takes no layout at
                    all, so the resting table is untouched.

                    8px out horizontally but only 4px vertically, because the
                    rows are 8px apart at md — a symmetric 8px would have
                    neighbouring fills meeting in the middle of the gap.
                  */
                  <a
                    key={i}
                    href={a.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative isolate before:absolute before:-inset-x-xs before:-inset-y-3xs before:-z-10 before:rounded-xs before:content-[''] before:transition-[background-color,inset] before:duration-200 before:ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:before:-inset-x-[9.5px] hover:before:-inset-y-[5.5px] hover:before:bg-utility-gray-100 active:before:bg-utility-gray-200"
                  >
                    {/* Mobile: award + year↗ on one row, project (tertiary) below */}
                    <div className="flex flex-col md:hidden">
                      <div className="flex items-start justify-between">
                        <p className="b-xs text-text-secondary transition-colors group-hover:text-text-primary">{a.award}</p>
                        <div className="flex items-center gap-3xs text-text-secondary shrink-0 ml-sm transition-colors group-hover:text-text-primary">
                          <p className="b-xs">{a.year}</p>
                          <ArrowUpRightSmall className="size-sm transition-transform duration-200 ease-out group-hover:translate-x-[2px] group-hover:-translate-y-[2px] group-hover:scale-[1.1]" />
                        </div>
                      </div>
                      <p className="b-xs text-text-tertiary transition-colors group-hover:text-text-primary">{a.project}</p>
                    </div>
                    {/* Tablet and desktop share Figma's 6-col awards grid
                        (project 1-2 | award 3-5 | year↗ 6). */}
                    <div className="hidden md:grid md:grid-cols-6 md:gap-x-lg md:items-start">
                      <p className="b-xs text-text-secondary transition-colors md:col-span-2 group-hover:text-text-primary">{a.project}</p>
                      <p className="b-xs text-text-secondary transition-colors md:col-start-3 md:col-span-3 group-hover:text-text-primary">{a.award}</p>
                      <div className="flex items-center justify-end gap-3xs text-text-secondary transition-colors md:col-start-6 group-hover:text-text-primary">
                        <p className="b-xs">{a.year}</p>
                        <ArrowUpRightSmall className="size-lg transition-transform duration-200 ease-out group-hover:translate-x-[3px] group-hover:-translate-y-[3px] group-hover:scale-[1.1]" />
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </SectionReveal>

      <Divider />

      {/* 02 — Biography */}
      <SectionReveal as="section" immediate className="flex flex-col gap-r-xl">
        <Reveal index={0} delay={0.25} className="w-full">
          <SectionHeader number="02" name="Biography" />
        </Reveal>

        {/* Mobile:  images, then text, stacked with a 40px gap.
            Tablet:  Figma's 9-col grid — images 1-4, text 5-9.
            Desktop: the 12-col page grid — images 1-5, text 7-12.
            Paragraph spacing is one blank line in Figma, so the gap between
            <p>s is exactly the body line-height at each step. */}
        <Reveal index={1} delay={0.25} className="flex flex-col gap-3xl md:grid md:grid-cols-9 md:items-start md:gap-lg wide:grid-cols-12">
          {/* Images */}
          <div className="md:col-start-1 md:col-span-4 wide:col-span-5">
            <BioCollage />
          </div>

          {/* Bio text */}
          <div className="flex flex-col gap-[var(--line-height-body-xs)] md:col-start-5 md:col-span-5 md:gap-[var(--line-height-body-sm)] wide:col-start-7 wide:col-span-6">
            <p className="b-xs text-text-secondary md:b-sm">
              I grew up in Kyiv, Ukraine, and at 17, I made the leap to New Zealand&mdash;a
              life-changing move that instilled in me persistence and self-motivation. It also gave
              me the chance to explore the iconic Lord of the Rings filming locations I had always
              dreamed of visiting.
            </p>
            <p className="b-xs text-text-secondary md:b-sm">
              When I&apos;m not deep in design work, you can find me enjoying live music, cycling,
              drawing, and reading hard sci-fi and fantasy novels.
            </p>
            <p className="b-xs text-text-tertiary md:b-sm">
              I&apos;m also first-aid trained, so I&apos;m set for the zombie apocalypse.
            </p>
          </div>
        </Reveal>
      </SectionReveal>

      <Divider />

      {/* 03 — Artwork */}
      <SectionReveal as="section" immediate className="flex flex-col gap-r-xl">
        <Reveal index={0} delay={0.25} className="w-full">
          <SectionHeader number="03" name="Artwork" />
        </Reveal>

        {/* Figma holds this paragraph to 7 of the 12 desktop columns; tablet
            and mobile run it full width. */}
        <Reveal index={1} delay={0.25} className="w-full wide:grid wide:grid-cols-12 wide:gap-x-lg">
          <p className="b-xs text-text-secondary md:b-sm wide:col-span-7">
            I&apos;ve been creating art for as long as I can remember. While I began by honing my
            digital skills, working in the tech industry inspired me to explore traditional mediums.
            Art is still a big part of my life and a way to unwind and express my creativity in my
            spare time.
          </p>
        </Reveal>

        {/* Image strip — continuous right-to-left marquee of 7 original
            artworks; falls back to a manual scroll strip for reduced-motion.
            See ArtworkStrip for the full-bleed/loop/pause mechanics. */}
        <Reveal index={2} delay={0.25} className="w-full">
          <ArtworkStrip names={artwork} />
        </Reveal>
      </SectionReveal>

      <Divider />

      {/* Case study nav */}
      <Reveal delay={0.25} immediate className="w-full">
        <CaseStudyNav
          title="NZ COVID Tracer app"
          href="/work/covid-tracer"
          image={{ src: "/home/work/covid-tracer/MOH1.jpg", alt: "NZ COVID Tracer app screen" }}
        />
      </Reveal>

      <Divider />

      {/* No reveal: the footer arrives already there. */}
      <div className="w-full">
        <SiteFooter />
      </div>
    </main>
  );
}
