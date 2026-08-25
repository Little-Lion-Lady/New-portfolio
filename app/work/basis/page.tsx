import type { Metadata } from "next";
import { GradientBg } from "../../components/gradient-bg";
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
import { Journey } from "../../components/journey";
import { Tag, TagGroup } from "../../components/tag";
import { OptionCard, OptionCards } from "../../components/option-card";
import { ResearchFindings } from "../../components/research-findings";
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
  "Hardware-constrained",
  "Safety requirements",
];

const hmw = [
  "Enable users to reduce electricity costs by 15%?",
  "Turn dense information into actionable pathways, with feedback loops that show tangible, impactful results?",
  "Increase perceptions of safety, and remove barriers to peace of mind rather than trying to convince people they’re not objectively at risk?",
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
    <main className="[--page-gutter:var(--spacing-md)] md:[--page-gutter:var(--spacing-3xl)] lg:[--page-gutter:var(--spacing-5xl)] relative flex flex-col gap-r-xl bg-bg-primary px-md pb-0 pt-[56px] text-text-primary md:px-3xl md:pt-[64px] lg:px-5xl lg:pb-0 lg:pt-[72px]">
      {/* Gradient + header + hero grouped so gap-r-xl isn't inserted between them */}
      <div>
        <GradientBg height="647px" />
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
      <SectionReveal as="section" immediate className="relative z-10 flex w-full flex-col gap-r-xl">
        <Reveal index={0} delay={0.6} className="w-full">
          <SectionHeader number="01" name="Journey" />
        </Reveal>
        <Reveal index={1} delay={0.6} className="w-full">
          <Journey steps={journeySteps} />
        </Reveal>
      </SectionReveal>

      <Divider />

      {/* 02 — Problem */}
      <SectionReveal as="section" immediate className="relative z-10 flex w-full flex-col gap-r-xl">
        <Reveal index={0} delay={0.6} className="w-full">
          <SectionHeader number="02" name="Problem" />
        </Reveal>
        <Reveal index={1} delay={0.6} className="w-full lg:grid lg:grid-cols-12 lg:gap-x-lg">
          <KeyParagraph lead="A hardware product and a blank slate." className="lg:col-start-1 lg:col-span-6">
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
        </Reveal>
      </SectionReveal>

      <Divider />

      {/* 03 — Approach */}
      <SectionReveal as="section" immediate className="relative z-10 flex w-full flex-col gap-r-xl">
        <Reveal index={0} delay={0.6} className="w-full">
          <SectionHeader number="03" name="Approach" />
        </Reveal>
        <Reveal index={1} delay={0.6} className="flex w-full flex-col gap-4xl lg:max-w-[916px]">
          <KeyParagraph lead="Before design, I needed a filter for every decision.">
            The first thing I did wasn’t open Figma. It was run a product goal workshop with
            the founders, Head of Strategy, and Head of Product to answer two questions: what
            problem are we solving for users, and what does success look like for the business?
          </KeyParagraph>
          {/* Red vision quote — text-highlight-dark lead + body */}
          <div className="flex flex-col items-start gap-md md:gap-lg">
            <p className="b-sm text-text-highlight-dark lg:b-md">
              “Give NZ households an intuitive tool to reduce electricity costs by 15%, while
              promoting safety.
            </p>
            <p className="b-xs text-text-secondary md:b-sm lg:b-md">
              That vision became the design filter for every subsequent decision. If a feature
              didn’t serve savings or safety, it didn’t make V1.
            </p>
          </div>
        </Reveal>
      </SectionReveal>

      <Divider />

      {/* 04 — Research */}
      <SectionReveal as="section" immediate className="relative z-10 flex w-full flex-col gap-r-xl">
        <Reveal index={0} delay={0.6} className="w-full">
          <SectionHeader number="04" name="Research" />
        </Reveal>
        <Reveal index={1} delay={0.6} className="lg:max-w-[916px]">
          <KeyParagraph lead="The research shifted our entire framing">
            I ran three phases of research. Each one changed how we thought about the product —
            and the third made us rethink the category we were designing for.
          </KeyParagraph>
        </Reveal>
        <Reveal index={2} delay={0.6} className="flex w-full flex-col gap-r-xl">
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
          <ResearchMedia />
        </Reveal>
      </SectionReveal>

      {/* Insight — between 03 and 04 */}
      <Reveal delay={0.6} immediate className="relative z-10 w-full">
        <Insight>
          Users expected safety by default — it wasn’t a differentiator. The real value was the
          financial control electricity gave them over their spending. Safety had to disappear
          into infrastructure for that control to feel trustworthy.
        </Insight>
      </Reveal>

      {/* 05 — Design brief */}
      <SectionReveal as="section" immediate className="relative z-10 flex w-full flex-col gap-r-xl">
        <Reveal index={0} delay={0.6} className="w-full">
          <SectionHeader number="05" name="Design brief" />
        </Reveal>
        <Reveal index={1} delay={0.6} className="flex w-full flex-col gap-r-md">
          <KeyParagraph lead="Three questions that framed every design decision." className="lg:max-w-[916px]">
            From the research findings, I generated three HMW statements to frame the design
            space, then translated them directly into testable hypotheses with defined success
            metrics.
          </KeyParagraph>
          <Column label="How might we" labelClassName="b-xs md:b-sm lg:b-sm" ordered={hmw} />
        </Reveal>
        <Reveal index={2} delay={0.6} className="flex w-full flex-col gap-r-md">
          <Hypothesis
            label="H1"
            believe="Communicating energy usage in dollars rather than kilowatt-hours will make data more relatable and actionable for homeowners."
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

      {/* 06 — Process */}
      <SectionReveal as="section" immediate className="relative z-10 flex w-full flex-col gap-r-xl">
        <Reveal index={0} delay={0.6} className="w-full">
          <SectionHeader number="06" name="Process" />
        </Reveal>
        <Reveal index={1} delay={0.6} className="flex w-full flex-col gap-4xl">
          <KeyParagraph lead="Three paths. One that served both users and the business." className="lg:max-w-[916px]">
            Story mapping revealed a wide feature space with more to build than the timeline and
            budget could support. I mapped three realistic paths for V1 and made the call based
            on what the research told us.
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
          <KeyParagraph className="lg:max-w-[916px]">
            Research said users wanted control. The business needed engagement to support the
            subscription model. Option C was the only path that answered both — and it mapped
            directly to the hypotheses we’d already validated.
          </KeyParagraph>
          <TagGroup label="Deferred to V2">
            {deferred.map((d) => (
              <Tag key={d} deferred>
                {d}
              </Tag>
            ))}
          </TagGroup>
        </Reveal>
      </SectionReveal>

      <Divider />

      {/* 07 — Solution design */}
      <SectionReveal as="section" immediate className="relative z-10 flex w-full flex-col gap-r-xl">
        <Reveal index={0} delay={0.6} className="w-full">
          <SectionHeader number="07" name="Solution design" />
        </Reveal>
        <Reveal index={1} delay={0.6} className="flex w-full flex-col gap-4xl">
          <KeyParagraph lead="Three principles that every screen had to pass." className="lg:max-w-[916px]">
            I ran a collaborative Design Studio with the design and development teams to
            establish direction. Before any screens were signed off, three design principles
            emerged from the workshop — and every subsequent decision was checked against them.
          </KeyParagraph>
          <div className="flex flex-col gap-3xl md:grid md:grid-cols-3 md:gap-lg">
            <KeyParagraph lead="Dollars, not kWh">
              All energy data translated to cost. Actionable by default — no mental conversion
              required.
            </KeyParagraph>
            <KeyParagraph lead="Control before context">
              Users act first, understand later. Depth is earned through use, not frontloaded at
              onboarding.
            </KeyParagraph>
            <KeyParagraph lead="Safety as ambient">
              Never interrupt. Always visible. Safety status present in the UI without ever being
              a primary CTA.
            </KeyParagraph>
          </div>
          <SolutionMedia />
          <div className="flex w-full flex-col gap-4xl lg:max-w-[916px]">
            <KeyParagraph
              label="Prototype testing — n=6 · What it validated"
              lead="Dollars framing worked immediately"
            >
              Users understood cost impact without explanation. The hypothesis that translating
              kWh to dollars made data relatable and actionable was confirmed without prompting
              in the first session.
            </KeyParagraph>
            <KeyParagraph label="What broke" lead="Data source confusion">
              Users couldn’t distinguish estimated from live data. This led to a full redesign of
              data source labelling and a persistent safety status indicator that followed users
              across all screens.
            </KeyParagraph>
          </div>
          <PrototypeMedia />
        </Reveal>
      </SectionReveal>

      <Divider />

      {/* 08 — Outcome */}
      <SectionReveal as="section" immediate className="relative z-10 flex w-full flex-col gap-r-xl">
        <Reveal index={0} delay={0.6} className="w-full">
          <SectionHeader number="08" name="Outcome" />
        </Reveal>
        <Reveal index={1} delay={0.6} className="flex w-full flex-col gap-4xl">
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
              className="md:col-span-4 lg:col-start-6 lg:col-span-5"
              value="85%"
              label="Users created an energy routine in week one"
              sublabel="Validates automation hypothesis"
            />
          </div>
          <div className="flex w-full flex-col gap-2xl lg:max-w-[916px]">
            <KeyParagraph lead="Closing the loop">
              Users in the pilot didn’t talk about safety. They talked about savings and control.
              The product vision held — from the first workshop to the final data point.
            </KeyParagraph>
            <KeyParagraph>
              Both hypotheses validated within one month of launch. While at the end of my tenure
              on the project the app rating score doubled.
            </KeyParagraph>
          </div>
          <BasisOutcomeMedia />
        </Reveal>
      </SectionReveal>

      <Divider />

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
