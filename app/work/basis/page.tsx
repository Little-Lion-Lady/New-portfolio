import type { Metadata } from "next";
import { SiteHeader } from "../../components/site-header";
import { SiteFooter } from "../../components/site-footer";
import { SectionHeader } from "../../components/section-header";
import { Divider } from "../../components/divider";
import { SectionReveal } from "../../components/section-reveal-context";
import { Reveal } from "../../components/reveal";
import { CaseStudyHero } from "../../components/case-study-hero";
import { CaseStudyNav } from "../../components/case-study-nav";
import { KeyParagraph } from "../../components/key-paragraph";
import { Stat } from "../../components/stat";
import { Insight } from "../../components/insight";
import { Hypothesis } from "../../components/hypothesis";
import { Column } from "../../components/column";
import { Hmw } from "../../components/hmw";
import { Journey } from "../../components/journey";
import { Tag, TagGroup } from "../../components/tag";
import { OptionCard, OptionCards } from "../../components/option-card";
import { ResearchFindings } from "../../components/research-findings";
import { GlassImage } from "../../components/work-image";
import {
  ResearchMedia,
  ProcessMedia,
  SolutionMedia,
  PrototypeMedia,
  BasisOutcomeMedia,
} from "../../components/media-block";

const constraints = [
  "No product Direction",
  "Small budget, fast pace",
  "Limited research resources",
  "Hardware-constrained features",
  "Safety Requirements",
];

const hmw = [
  "enable users to reduce electricity costs by 15%?",
  "turn dense information into actionable pathways?",
  "increase perceptions of safety rather than convince people they’re not at risk?",
];

const deferred = [
  "EV charging management",
  "Multi-property support",
  "Green energy features",
  "Advanced analytics",
];

const journeySteps = [
  {
    title: "Research",
    body: "Understanding competitive landscape, key user pain points and gains to define value proposition",
  },
  {
    title: "Align",
    body: "Product goal workshop with founders and leadership. Established the vision before any research began.",
  },
  {
    title: "Discover",
    body: "HMW statements, hypotheses with success metrics, story mapping, V1 prioritisation.",
  },
  {
    title: "Design",
    body: "Design Studio workshop, IA, core flows, prototype testing with 6 participants, two rounds of iteration.",
  },
  {
    title: "Build & Pilot",
    body: "Dual-track agile delivery. Compliance testing pilot. Outcomes measured against original hypotheses.",
  },
];

export const metadata: Metadata = {
  title: "Basis smart panel app — Maryna Babych",
  description:
    "Basis built smart electrical hardware for NZ homes. They knew they needed a companion app, but had no PO, no product brief, and no defined direction. I stepped in to own the strategy, run the research, and design an app that reduced household energy bills by 10% in the first pilot.",
};

export default function Basis() {
  return (
    <main className="[--page-gutter:var(--spacing-md)] md:[--page-gutter:var(--spacing-3xl)] lg:[--page-gutter:var(--spacing-3xl)] relative flex flex-col gap-r-xl bg-bg-primary px-md pb-0 pt-[60px] text-text-primary md:px-3xl md:pt-[92px] lg:px-3xl lg:pb-0 lg:pt-[92px]">
      {/* Gradient + header + hero grouped so gap-r-xl isn't inserted between them */}
      <div>
        <SiteHeader />
        <section className="relative z-10">
          <CaseStudyHero
            titleTop="Basis"
            titleBottom="smart panel app"
            lead="How I built a product strategy when there was no product owner to hand it to me"
            description="Basis built smart electrical hardware for NZ homes. They knew they needed a companion app, but had no PO, no product brief, and no defined direction. I stepped in to own the strategy, run the research, and design an app that reduced household energy bills by 10% in the first pilot."
            meta={[
              { label: "Role_", value: "Senior Product Designer" },
              { label: "Scope_", value: "Product strategy · UX/UI · Research" },
              { label: "Date_", value: "23’ – 24’" },
            ]}
            recognition={[
              { label: "Recognition_", value: "Best Design Award, Gold" },
            ]}
            images={[
              { src: "/home/work/basis/BS1.jpg", alt: "Basis home app screen" },
              { src: "/home/work/basis/BS2.jpg", alt: "Basis home app screen" },
              { src: "/home/work/basis/BS3.png", alt: "Basis home app screen" },
            ]}
          />
        </section>
      </div>

      {/* 01 — Journey */}
      <SectionReveal as="section" immediate className="relative z-10 flex w-full flex-col gap-r-lg">
        <Reveal index={0} delay={0.6} className="w-full">
          <SectionHeader number="01" name="Journey" />
        </Reveal>
        <Reveal index={1} delay={0.6} className="w-full">
          <Journey steps={journeySteps} />
        </Reveal>
      </SectionReveal>

      <Divider />

      {/* 02 — Problem */}
      <SectionReveal as="section" immediate className="relative z-10 flex w-full flex-col gap-r-lg">
        <Reveal index={0} delay={0.6} className="w-full">
          <SectionHeader number="02" name="Problem" />
        </Reveal>
        <Reveal index={1} delay={0.6} className="flex w-full flex-col">
          <div className="w-full lg:grid lg:grid-cols-12 lg:gap-x-lg">
            <KeyParagraph lead="A hardware product and a blank slate." leadTone="primary" className="lg:col-start-1 lg:col-span-6">
              Traditional switchboards are failing modern households. Basis built a smart,
              prefabricated electrical panel to fix that. But hardware alone can’t drive
              long-term engagement or support a subscription model. A digital product was
              non-negotiable. The problem: no one had defined what it should be.
            </KeyParagraph>
            <div className="mt-r-md lg:col-start-8 lg:col-span-5 lg:mt-0">
              <TagGroup>
                {constraints.map((c) => (
                  <Tag key={c}>{c}</Tag>
                ))}
              </TagGroup>
            </div>
          </div>
          {/* The panel itself (Figma 1555:135209). Sits --md below the tags on
              mobile/tablet, where they stack, and --lg below the whole
              two-column block on desktop. Heights are Figma's own crop at each
              frame width — 361×300 / 944×500 / 1648×700. */}
          <GlassImage
            src="/home/work/basis/BasisConsumer.png"
            alt="The Basis smart electrical panel, shown closed, open and with its cover removed"
            sizes="(min-width: 1400px) 1648px, (min-width: 768px) 944px, 100vw"
            objectPosition="top"
            className="mt-r-md h-[300px] w-full md:h-[500px] lg:mt-r-lg lg:h-[700px]"
          />
        </Reveal>
      </SectionReveal>

      <Divider />

      {/* 03 — Approach (Figma 1613:139307 folds the old Research section into
          this one: the workshop opener, the research imagery, then the two
          method rows, every gap the section's own --lg). */}
      <SectionReveal as="section" immediate className="relative z-10 flex w-full flex-col gap-r-lg">
        <Reveal index={0} delay={0.6} className="w-full">
          <SectionHeader number="03" name="Approach" />
        </Reveal>
        {/* One paragraph now, with the product vision carried inline as a
            highlighted phrase instead of a second quoted column. */}
        <Reveal index={1} delay={0.6} className="w-full lg:max-w-[1092px]">
          <KeyParagraph>
            I started with a product goal workshop with the founders, the Head of Strategy
            and the Head of Product, to settle two questions: what problem are we solving
            for users, and what does success look like for the business? We came out with
            one line:{" "}
            <span className="text-text-highlight-dark">
              give NZ households an intuitive tool to reduce electricity costs by 15%,
              while promoting safety
            </span>
            . Every decision after that got measured against it. If a feature didn’t serve
            savings or safety, it didn’t make V1.
          </KeyParagraph>
        </Reveal>
        <Reveal index={2} delay={0.6} className="w-full">
          <ResearchMedia />
        </Reveal>
        <Reveal index={3} delay={0.6} className="flex w-full flex-col gap-r-lg">
          <KeyParagraph lead="The research shifted our entire framing" leadTone="primary" scale="b-xs md:b-sm">
            I ran three phases of research. Each one changed how we thought about the
            product — and the third made us rethink the category we were designing for.
          </KeyParagraph>
          <ResearchFindings
            method="Existing research + Competitive analysis"
            primary="Users weren’t anxious about safety. They felt passive and out of control with their bills."
            secondary="Basis’s hardware filled a real gap. Competitors led on safety but underdelivered on ongoing control. Users wanted agency, not protection."
            implication="The app needed to feel empowering, not protective. Reframe from safety tool to savings tool."
          />
          <ResearchFindings
            method="Card sort"
            primary="Users prioritised Energy Control over Insights. Safety was treated as a baseline expectation."
            secondary="Bundling Control and Insights had the most impact together. Safety was already expected — it wasn’t a feature worth leading with."
            implication="Control first in IA. Insights bundled. Safety ambient, never interruptive."
          />
        </Reveal>
      </SectionReveal>

      {/* Insight — between 03 and 04, no dividers */}
      <Reveal delay={0.6} immediate className="relative z-10 w-full">
        <Insight>
          Users expected safety by default — it wasn’t a differentiator. The real value was the
          financial control electricity gave them over their spending. Safety had to disappear
          into infrastructure for that control to feel trustworthy.
        </Insight>
      </Reveal>

      {/* 04 — Design brief */}
      <SectionReveal as="section" immediate className="relative z-10 flex w-full flex-col gap-3xl md:gap-r-lg">
        <Reveal index={0} delay={0.6} className="w-full">
          <SectionHeader number="04" name="Design brief" />
        </Reveal>
        {/* Figma 1613:139331 sets the opener against the HMW list rather than
            above it: key paragraph cols 1-5, the three HMW lines cols 7-12,
            stacked at gap 0 so their line boxes carry the rhythm. */}
        <Reveal index={1} delay={0.6} className="flex w-full flex-col gap-3xl lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-lg lg:gap-y-0">
          <KeyParagraph
            lead="Three questions that framed every design decision."
            leadTone="primary"
            className="lg:col-start-1 lg:col-span-5"
          >
            From the research findings, I generated 3 HMW statements to frame the design
            space, then translated them directly into testable hypotheses with defined
            success metrics.
          </KeyParagraph>
          <div className="flex flex-col lg:col-start-7 lg:col-span-6">
            {hmw.map((q) => (
              <Hmw key={q}>{q}</Hmw>
            ))}
          </div>
        </Reveal>
        {/* Figma 1613:139346 — the hypothesis rows sit only --sm apart, not the
            --md the other case study uses. */}
        <Reveal index={2} delay={0.6} className="flex w-full flex-col gap-r-sm">
          <Hypothesis
            label="H1"
            believe="Showing energy usage in dollars rather than kilowatt-hours will make data more relatable and actionable for homeowners."
            because="It simplifies energy metrics into a format users can immediately act on."
            metric="Users who engage with insights 3x/month will show a 10% bill reduction within 6 months."
          />
          <Divider />
          <Hypothesis
            label="H2"
            believe="Allowing users to remotely control power in their homes will foster a greater sense of safety and control."
            because="Real-time control reduces unnecessary consumption and mitigates potential safety risks"
            metric="90% of users report feeling more in control of their home’s energy and safety after 3 months."
          />
          <Divider />
          <Hypothesis
            label="H3"
            believe="An automation feature that lets users schedule and manage electricity supply will result in a 10–15% reduction in bills."
            because="Strategic power-down during peak pricing hours optimises consumption without requiring ongoing effort."
            metric="Users who engage with insights 3x/month will show a 10% bill reduction within 6 months."
          />
        </Reveal>
      </SectionReveal>

      <Divider />

      {/* 05 — Process */}
      <SectionReveal as="section" immediate className="relative z-10 flex w-full flex-col gap-r-lg">
        <Reveal index={0} delay={0.6} className="w-full">
          <SectionHeader number="05" name="Process" />
        </Reveal>
        <Reveal index={1} delay={0.6} className="flex w-full flex-col gap-r-md">
          {/* Figma 1613:139355 folds the closing rationale into the opener, so
              the deferred-scope tags now run full width under the imagery
              rather than sitting beside a second paragraph. */}
          <KeyParagraph lead="Three paths. One that served both users and the business." leadTone="primary" className="lg:max-w-[1030px]">
            Story mapping revealed a wide feature space with more to build than the timeline
            and budget could support. Research said users wanted control. The business needed
            engagement to support the subscription model. Option C was the only path that
            answered both — and it mapped directly to the hypotheses we’d already validated.
          </KeyParagraph>
          <OptionCards>
            <OptionCard label="Option A" title="Full control suite">
              All circuits, routines, events. Maximum power user depth from day one.
            </OptionCard>
            <OptionCard label="Option B" title="Insights-first">
              Energy data, cost visibility, recommendations. Passive-friendly but limited
              engagement hook.
            </OptionCard>
            <OptionCard label="Option C" title="Paired MVP" chosen>
              Control + insights bundled, safety ambient. Serves passive users and power users.
              Business engagement built in.
            </OptionCard>
          </OptionCards>
          <ProcessMedia />
          <TagGroup label="Deferred to V2" className="flex-wrap gap-r-2xs">
            {deferred.map((d) => (
              <Tag key={d} deferred>
                {d}
              </Tag>
            ))}
          </TagGroup>
        </Reveal>
      </SectionReveal>

      <Divider />

      {/* 06 — Solution design */}
      <SectionReveal as="section" immediate className="relative z-10 flex w-full flex-col gap-r-lg">
        <Reveal index={0} delay={0.6} className="w-full">
          <SectionHeader number="06" name="Solution design" />
        </Reveal>
        <Reveal index={1} delay={0.6} className="flex w-full flex-col gap-r-lg">
          {/* Figma 1613:139383 drops the lead line — the opener is one
              paragraph across columns 1-8. */}
          <KeyParagraph className="lg:max-w-[1092px]">
            I ran a collaborative Design Studio with the design and development teams to
            establish direction. Before any screens were signed off, three design principles
            emerged from the workshop — and every subsequent decision was checked against them.
          </KeyParagraph>
          {/* The three principles hold B-xs until desktop, where they step to
              B-sm rather than B-md (Figma 1613:139385). */}
          <div className="flex flex-col gap-lg md:grid md:grid-cols-3 md:gap-lg">
            <KeyParagraph lead="Dollars, not kWh" scale="b-xs lg:b-sm">
              All energy data translated to cost. Actionable by default — no mental conversion
              required.
            </KeyParagraph>
            <KeyParagraph lead="Safety as ambient" scale="b-xs lg:b-sm">
              Never interrupt. Always visible. Safety status present in the UI without ever being
              a primary CTA.
            </KeyParagraph>
            <KeyParagraph lead="Control before context" scale="b-xs lg:b-sm">
              Users act first, understand later. Depth is earned through use, not frontloaded at
              onboarding.
            </KeyParagraph>
          </div>
          <SolutionMedia />
          <div className="flex w-full flex-col gap-3xl md:grid md:grid-cols-2 md:items-start md:gap-x-lg md:gap-y-0">
            <KeyParagraph
              label="Prototype testing — n=6 · What it validated"
              lead="Dollars framing worked immediately"
              leadTone="primary"
              scale="b-xs md:b-sm"
              className="md:pr-2xl"
            >
              Users understood cost impact without explanation. The hypothesis that translating
              kWh to dollars made data relatable and actionable was confirmed without prompting
              in the first session.
            </KeyParagraph>
            <KeyParagraph label="What broke" lead="Data source confusion" scale="b-xs md:b-sm">
              Users couldn’t distinguish estimated from live data. This led to a full redesign of
              data source labelling and a persistent safety status indicator that followed users
              across all screens.
            </KeyParagraph>
          </div>
          <PrototypeMedia />
        </Reveal>
      </SectionReveal>

      <Divider />

      {/* 07 — Outcome */}
      <SectionReveal as="section" immediate className="relative z-10 flex w-full flex-col gap-r-lg">
        <Reveal index={0} delay={0.6} className="w-full">
          <SectionHeader number="07" name="Outcome" />
        </Reveal>
        <Reveal index={1} delay={0.6} className="flex w-full flex-col gap-r-lg">
          <div className="flex w-full flex-col gap-3xl md:grid md:grid-cols-8 md:gap-lg lg:grid-cols-12">
            <Stat
              size="outcome"
              className="md:col-span-4 lg:col-start-1"
              value="10%"
              label="Reduction in household energy bills"
              sublabel="Measured over 6-month pilot"
            />
            <Stat
              size="outcome"
              className="md:col-span-4 lg:col-start-5"
              value="85%"
              label="Users created an energy routine in week one"
              sublabel="Validates automation hypothesis"
            />
          </div>
          {/* Figma 1613:139410 — one labelled row now, not two stacked key
              paragraphs, and it steps up to B-md on desktop. */}
          <Column label="Closing the loop" textClassName="b-xs md:b-sm lg:b-md">
            Both hypotheses validated within one month of launch. While at the end of my
            tenure on the project the app rating score doubled.
          </Column>
          <BasisOutcomeMedia />
        </Reveal>
      </SectionReveal>

      {/* Case study nav */}
      <Reveal delay={0.6} immediate className="relative z-10 w-full">
        <CaseStudyNav
          title="NZ COVID Tracer app"
          href="/work/covid-tracer"
          image={{ src: "/home/work/covid-tracer/MOH1.jpg", alt: "NZ COVID Tracer app screen" }}
        />
      </Reveal>

      <Divider />

      <Reveal delay={0.6} immediate className="relative z-10 w-full">
        <SiteFooter />
      </Reveal>
    </main>
  );
}
