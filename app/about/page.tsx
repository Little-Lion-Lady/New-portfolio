import { Fragment } from "react";
import type { Metadata } from "next";
import { GradientBg } from "../components/gradient-bg";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";
import { SectionHeader } from "../components/section-header";
import { Button } from "../components/button";
import { SectionReveal } from "../components/section-reveal-context";
import { Reveal, RevealWords } from "../components/reveal";
import { Divider } from "../components/divider";
import { ArrowUpRight } from "../components/icons";
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

const awards = [
  { project: "Basis Smart Panel", award: "Best Design Gold", year: "25’", href: "https://bestawards.co.nz/industrial-design/consumer/basis/basis-smart-panel-1/" },
  { project: "NZ COVID Tracer app", award: "Best Design Gold", year: "21’", href: "https://bestawards.co.nz/digital/digital-products/rush-1/nz-covid-tracer-app/" },
  { project: "Z Energy Sharetank", award: "Best Design Gold", year: "20’", href: "https://bestawards.co.nz/digital/user-experience/z-energy-innovation-refinery/z-energy-sharetank/" },
  { project: "Starship Check-Up", award: "Best Design Purple", year: "18’", href: "https://bestawards.co.nz/user-experience-award/interactive/rush-1/starship-animal-check-ups-magical-forest/" },
];

const artwork = ["ART1", "ART2", "ART3", "ART4", "ART5", "ART6", "ART7"];

export const metadata: Metadata = {
  title: "About — Maryna Babych",
  description:
    "I'm a passionate, strategic, and creative thinker, blending human-centred design with technology to create experiences that positively impact lives. With 9 years of experience in product design, I've delivered award-winning, impactful designs across a variety of industries and environments.",
};

export default function About() {
  return (
    <main className="relative flex flex-col gap-r-2xl bg-bg-primary px-md pb-0 pt-[56px] text-text-primary md:px-xl md:pt-[64px] lg:px-5xl lg:pb-0 lg:pt-[72px]">
      {/* Gradient + header + hero grouped so gap-r-2xl isn't inserted between them */}
      <div>
        <GradientBg height="350px" fullWidth scaleX={2} />
        <SiteHeader />

        {/* Hero — shorter than home, text positioned in lower 2/3 of gradient */}
        <section className="relative z-10 pb-2xl pt-[100px] md:pt-[128px] lg:pt-[160px]">
          <TitleStars>
            <RevealWords as="h1" className="about-hero-title text-text-primary-highlight">who am I?</RevealWords>
          </TitleStars>
        </section>
      </div>

      <Divider />

      {/* 01 — Overview */}
      <SectionReveal as="section" immediate className="flex flex-col gap-r-xl">
        <Reveal index={0} delay={0.5} className="w-full">
          <SectionHeader number="01" name="Overview" />
        </Reveal>

        {/* Desktop: description left (~5/11) + history right (~6/11).
            Tablet/mobile: stacked (description → history). */}
        <Reveal index={1} delay={0.5} className="flex flex-col gap-r-2xl wide:flex-row wide:items-start wide:gap-r-xl">
          {/* Description + CV button */}
          <div className="flex flex-col gap-r-xl wide:flex-[5]">
            <p className="b-xs text-text-secondary md:b-sm wide:b-lg">
              I&apos;m a <span className="text-text-highlight-dark">passionate</span>,{" "}
              <span className="text-text-highlight-dark">strategic</span>, and{" "}
              <span className="text-text-highlight-dark">creative thinker</span>, blending
              human-centred design with technology to create experiences that positively impact lives.
              With <span className="text-text-highlight-dark">9 years</span>{" "}
              of experience in product
              design, I&apos;ve delivered{" "}
              <span className="text-text-highlight-dark">award-winning</span>,{" "}
              <span className="text-text-highlight-dark">impactful</span> designs across a variety of
              industries and environments, including agencies, startups, and established product
              companies.
            </p>
            <Button
              variant="primary"
              label="Download CV"
              href="https://drive.google.com/file/d/1IS3YF8ZU8F0Hq9wtomTK1RdZa4r5vrXl/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              external
              className="self-start"
            />
          </div>

          {/* Experience + Recognition tables */}
          <div className="flex flex-col gap-r-xl wide:flex-[6]">
            {/* ── Experience ── */}
            <div className="flex flex-col gap-xl">
              <div>
                <p className="b-xs md:b-sm text-text-primary mb-lg">Experience</p>
                <Divider />
              </div>
              <div className="flex flex-col gap-xl">
                {experience.map((e, i) => (
                  <Fragment key={i}>
                    {/* Mobile: role + year on one row, org below, project (tertiary) below */}
                    <div className="flex flex-col gap-sm md:hidden">
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
                      <div className="flex flex-col gap-md md:col-span-1 lg:col-span-3">
                        <p className="b-sm text-text-secondary">{e.role}</p>
                        <p className="b-sm text-text-tertiary">{e.org}</p>
                      </div>
                      <p className="b-sm text-text-secondary md:col-span-1 lg:col-start-4 lg:col-span-2">{e.project}</p>
                      <p className="b-sm text-text-secondary text-right md:col-span-1 lg:col-start-6">{e.year}</p>
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>

            {/* ── Recognition ── */}
            <div className="flex flex-col gap-xl">
              <div>
                <p className="b-xs md:b-sm text-text-primary mb-lg">Recognition</p>
                <Divider />
              </div>
              <div className="flex flex-col gap-xl">
                {awards.map((a, i) => (
                  <a key={i} href={a.href} target="_blank" rel="noopener noreferrer" className="group">
                    {/* Mobile: award + year↗ on one row, project (tertiary) below */}
                    <div className="flex flex-col gap-sm md:hidden">
                      <div className="flex items-start justify-between">
                        <p className="b-xs text-text-secondary transition-colors group-hover:text-text-primary">{a.award}</p>
                        <div className="flex items-center gap-3xs text-text-secondary shrink-0 ml-sm transition-colors group-hover:text-text-primary">
                          <p className="b-xs">{a.year}</p>
                          <ArrowUpRight className="size-sm transition-transform duration-200 ease-out group-hover:translate-x-[2px] group-hover:-translate-y-[2px] group-hover:scale-[1.1]" />
                        </div>
                      </div>
                      <p className="b-xs text-text-tertiary transition-colors group-hover:text-text-primary">{a.project}</p>
                    </div>
                    {/* Tablet: 3-col. Desktop: 6-col (project 1-3 | award 4-5 | year↗ 6) */}
                    <div className="hidden md:grid md:grid-cols-3 md:gap-x-lg md:items-start lg:grid-cols-6">
                      <p className="b-sm text-text-secondary transition-colors md:col-span-1 lg:col-span-3 group-hover:text-text-primary">{a.project}</p>
                      <p className="b-sm text-text-secondary transition-colors md:col-span-1 lg:col-span-2 group-hover:text-text-primary">{a.award}</p>
                      <div className="flex items-center justify-end gap-3xs text-text-secondary transition-colors md:col-span-1 lg:col-start-6 group-hover:text-text-primary">
                        <p className="b-sm">{a.year}</p>
                        <ArrowUpRight className="size-lg transition-transform duration-200 ease-out group-hover:translate-x-[3px] group-hover:-translate-y-[3px] group-hover:scale-[1.1]" />
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
        <Reveal index={0} delay={0.5} className="w-full">
          <SectionHeader number="02" name="Biography" />
        </Reveal>

        {/* Mobile:  text first (order-1), images below (order-2).
            Tablet:  images first (order-1), text below (order-2) — stacked.
            Desktop: images left (order-1), text right (order-2) — side by side. */}
        <Reveal index={1} delay={0.5} className="flex flex-col gap-r-xl wide:flex-row wide:items-start">
          {/* Images */}
          <div className="order-2 md:order-1 wide:flex-[5]">
            <BioCollage />
          </div>

          {/* Bio text */}
          <div className="order-1 flex flex-col gap-lg lg:gap-xl md:order-2 wide:flex-[6]">
            <p className="b-xs text-text-secondary md:b-sm lg:b-md">
              I grew up in Kyiv, Ukraine, and at 17 I made the leap to New Zealand&mdash;a
              life-changing move that instilled in me persistence and self-motivation. It also gave me
              the chance to explore the iconic Lord of the Rings filming locations I had always
              dreamed of visiting.
            </p>
            <p className="b-xs text-text-secondary md:b-sm lg:b-md">
              When I&apos;m not deep in design work, you can find me enjoying live music, cycling,
              drawing, and reading hard sci-fi and fantasy novels.
            </p>
            <p className="b-xs text-text-tertiary md:b-sm lg:b-md">
              Bonus points: I&apos;m first-aid trained, so I&apos;m fully prepared to survive the
              zombie apocalypse.
            </p>
          </div>
        </Reveal>
      </SectionReveal>

      <Divider />

      {/* 03 — Artwork */}
      <SectionReveal as="section" immediate className="flex flex-col gap-r-xl">
        <Reveal index={0} delay={0.5} className="w-full">
          <SectionHeader number="03" name="Artwork" />
        </Reveal>

        <Reveal index={1} delay={0.5} className="w-full">
          <p className="b-xs text-text-secondary md:b-sm lg:b-md">
            I&apos;ve been creating art for as long as I can remember. While I began by honing my
            digital skills, working in the tech industry inspired me to explore traditional mediums.
            Art is still a big part of my life and a way to unwind and express my creativity in my
            spare time.
          </p>
        </Reveal>

        {/* Image strip — continuous right-to-left marquee of 7 original
            artworks; falls back to a manual scroll strip for reduced-motion.
            See ArtworkStrip for the full-bleed/loop/pause mechanics. */}
        <Reveal index={2} delay={0.5} className="w-full">
          <ArtworkStrip names={artwork} />
        </Reveal>
      </SectionReveal>

      <Divider />

      {/* Case study nav */}
      <Reveal delay={0.5} immediate className="w-full">
        <CaseStudyNav
          title="NZ COVID Tracer app"
          href="/work/covid-tracer"
          image={{ src: "/home/work/covid-tracer/MOH1.jpg", alt: "NZ COVID Tracer app screen" }}
        />
      </Reveal>

      <Divider />

      <Reveal delay={0.5} immediate className="w-full">
        <SiteFooter />
      </Reveal>
    </main>
  );
}
