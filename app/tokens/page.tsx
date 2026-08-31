/*
  Design system reference (/tokens).
  A living style guide: every implemented component rendered live, plus the full
  token foundation — colour ramps, semantic + utility tokens, gradients, spacing,
  radius, and the display / body / mono text styles. Colour swatches read
  `var(--token)` directly; type samples use the named utility classes. Toggle OS
  dark mode (or the in-page theme toggle) to confirm the semantic + utility layers
  invert correctly.
*/

import type { CSSProperties, ReactNode } from "react";

import { Button } from "../components/button";
import { ThemeToggle } from "../components/theme-toggle";
import { ArrowRight, ArrowUpRight, MoonIcon, SunIcon } from "../components/icons";
import { SectionHeader } from "../components/section-header";
import { Divider } from "../components/divider";
import { Stat, Stats } from "../components/stat";
import { KeyParagraph } from "../components/key-paragraph";
import { Insight } from "../components/insight";
import { Column } from "../components/column";
import { Hypothesis } from "../components/hypothesis";
import { FindingsTable } from "../components/findings-table";
import { Journey } from "../components/journey";
import { CaseStudyNav } from "../components/case-study-nav";
import { WorkItem } from "../components/work-item";
import { CaseStudyHero } from "../components/case-study-hero";
import {
  ApproachMedia,
  FlowDiagram,
  DesignMedia,
  OutcomeMedia,
} from "../components/media-block";
import { GradientBg } from "../components/gradient-bg";

const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

const PRIMITIVE_RAMPS: Array<[string, string]> = [
  ["gray-dark", "--colour-gray-dark-"],
  ["gray-light", "--colour-gray-light-"],
  ["orange", "--colour-orange-"],
  ["red-light", "--colour-red-light-"],
  ["red-dark", "--colour-red-dark-"],
  ["blue", "--colour-blue-"],
];

const SEMANTIC_GROUPS: Array<{ title: string; tokens: string[] }> = [
  { title: "Background", tokens: ["bg-primary", "bg-light", "bg-white", "bg-highlight", "bg-inverse", "bg-transparency"] },
  {
    title: "Text",
    tokens: [
      "text-primary", "text-secondary", "text-tertiary", "text-quaternary", "text-decorative",
      "text-highlight", "text-highlight-dark", "text-highlight-subtle", "text-inverted",
      "text-primary-hover", "text-primary-pressed", "text-primary-overlay", "text-primary-highlight",
    ],
  },
  { title: "Border", tokens: ["border-primary", "border-secondary", "border-highlight", "border-overlay"] },
  { title: "Component", tokens: ["component-bg-button-primary", "component-bg-button-hover", "component-bg-button-pressed"] },
  { title: "Shadow / Glow", tokens: ["shadows-shadow-01", "shadows-shadow-02", "shadows-glow-01"] },
];

const UTILITY_RAMPS: Array<[string, string]> = [
  ["gray", "--utility-gray-"],
  ["beige", "--utility-beige-"],
  ["blue", "--utility-blue-"],
  ["red", "--utility-red-"],
  ["orange", "--utility-orange-"],
];

const GRADIENT_TOKENS = [
  "utility-gradient-red", "utility-gradient-orange", "utility-gradient-blue1", "utility-gradient-blue2",
  "utility-gradient-yellow1", "utility-gradient-yellow2", "utility-gradient-green1", "utility-gradient-green2",
  "utility-gradient-transparent",
];

const DISPLAY_STYLES: Array<[string, string]> = [
  ["d-2xl", "224"], ["d-xl", "142"], ["d-lg", "124"], ["d-md", "80"], ["d-sm", "60"], ["d-xs", "44"], ["d-2xs", "32"],
];
const BODY_STYLES: Array<[string, string]> = [
  ["b-xl", "44"], ["b-lg", "32"], ["b-md", "24"], ["b-sm", "20"], ["b-xs", "16"], ["b-2xs", "14"], ["b-3xs", "12"],
];

// Named spacing scale → underlying px (from globals @theme).
const SPACING: Array<[string, number]> = [
  ["none", 0], ["4xs", 2], ["3xs", 4], ["2xs", 6], ["xs", 8], ["sm", 12], ["md", 16],
  ["lg", 20], ["xl", 24], ["2xl", 32], ["3xl", 40], ["4xl", 64], ["5xl", 72], ["6xl", 80],
  ["7xl", 96], ["8xl", 128], ["9xl", 160],
];

const RADII: Array<[string, string]> = [
  ["sm", "12"], ["md", "16"], ["lg", "20"], ["xl", "24"], ["full", "9999"],
];

function Label({ children }: { children: ReactNode }) {
  return (
    <span className="m-2xs text-text-tertiary" style={{ wordBreak: "break-word" }}>
      {children}
    </span>
  );
}

function SectionTitle({ children }: { children: string }) {
  return <h2 className="m-sm uppercase tracking-widest text-text-tertiary">{children}</h2>;
}

// Labelled card for a component demo.
function Demo({ name, full, children }: { name: string; full?: boolean; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-sm">
      <Label>{name}</Label>
      <div
        className={`rounded-[var(--size-6)] border border-border-primary bg-bg-light p-xl ${
          full ? "" : "flex flex-wrap items-center gap-xl"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

function Swatch({ token, css }: { token: string; css?: CSSProperties }) {
  return (
    <div className="flex flex-col gap-3xs">
      <div
        className="h-5xl rounded-[var(--size-3)] border border-border-primary"
        style={{ backgroundColor: `var(--${token})`, ...css }}
      />
      <Label>{token}</Label>
    </div>
  );
}

function Ramp({ name, prefix }: { name: string; prefix: string }) {
  return (
    <div className="flex flex-col gap-3xs">
      <div className="flex gap-3xs">
        {STEPS.map((s) => (
          <div key={s} className="flex flex-1 flex-col gap-3xs">
            <div
              className="h-3xl rounded-[var(--size-1)] border border-border-overlay"
              style={{ backgroundColor: `var(${prefix}${s})` }}
            />
            <span className="m-2xs text-text-quaternary text-center">{s}</span>
          </div>
        ))}
      </div>
      <Label>{`utility-${name}`}</Label>
    </div>
  );
}

const FINDINGS = [
  { finding: "No system visibility — users couldn’t tell if BT was active", decision: "Persistent BT status indicator on the dashboard, always visible" },
  { finding: "Action relied on memory rather than a clear prompt", decision: "Single action per onboarding screen — one decision at a time" },
];

const JOURNEY = [
  { title: "Audit & Benchmark", body: "Heuristic evaluation and baseline usability test across onboarding." },
  { title: "Design", body: "Collaborative ideation with PO, design, dev, and MoH PO." },
  { title: "Test", body: "Two rounds of user testing, each with a clear “therefore.”" },
  { title: "Ship", body: "Delivered over two agile sprints with MoH approval." },
];

export default function DesignSystem() {
  return (
    <main className="bg-bg-primary text-text-primary min-h-screen px-2xl py-3xl flex flex-col gap-5xl">
      <header className="flex flex-col gap-2xs">
        <div className="flex items-start justify-between gap-md">
          <p className="m-xs uppercase tracking-widest text-text-highlight">Design system</p>
          <ThemeToggle />
        </div>
        <h1 className="d-md text-text-primary">Components & tokens</h1>
        <p className="b-md text-text-secondary max-w-[var(--size-80)]">
          Every implemented component rendered live, plus the full token foundation —
          colour, spacing, radius, and text styles. Toggle the theme to verify dark mode.
        </p>
      </header>

      {/* ============================ COMPONENTS ============================ */}
      <section className="flex flex-col gap-2xl">
        <SectionTitle>Components</SectionTitle>

        <Demo name="Button — primary / link / view / view md">
          <Button variant="primary" label="About me" href="#" />
          <Button variant="link" label="LinkedIn" href="#" />
          <Button variant="view" label="View" href="#" />
          <Button variant="view" size="md" label="View" href="#" />
        </Demo>

        <Demo name="Theme toggle & icons">
          <ThemeToggle />
          <span className="flex items-center gap-md text-text-primary">
            <ArrowRight className="size-xl" />
            <ArrowUpRight className="size-xl" />
            <MoonIcon className="size-xl" />
            <SunIcon className="size-xl" />
          </span>
        </Demo>

        <Demo name="Section header" full>
          <SectionHeader number="01" name="Problem" />
        </Demo>

        <Demo name="Divider" full>
          <Divider />
        </Demo>

        <Demo name="Stat — lg, lg highlight, sm before→after" full>
          <Stats className="md:grid-cols-3">
            <Stat size="lg" value="2.7M" label="Unique app installs" />
            <Stat size="lg" value="55%" label="Users enabled BT tracing" highlight />
            <Stat size="sm" value="18% → 5.3%" label="Mislick rate reduction" />
          </Stats>
        </Demo>

        <Demo name="Key paragraph — lead + body" full>
          <KeyParagraph lead="Two rounds. Each one answered a specific question.">
            I ran two rounds of user testing against the redesign. Each round had a clear
            “therefore” — findings fed directly into the next iteration.
          </KeyParagraph>
        </Demo>

        <Demo name="Insight" full>
          <Insight>
            The problem wasn’t awareness. It was comprehension and confidence. Reassure
            first. Explain second. Ask third.
          </Insight>
        </Demo>

        <Demo name="Column — label + title + body" full>
          <Column label="Blocker 1" title="The app asked for trust before earning it">
            Onboarding used technical language and frontloaded too much information. Users
            arrived at the BT screen without understanding what they were being asked to do.
          </Column>
        </Demo>

        <Demo name="Hypothesis — md" full>
          <Hypothesis
            label="H1"
            believe="increasing the visual affordance of Bluetooth Tracing will drive acquisition"
            because="users need a clear, persistent cue — not a buried setting."
            metric="BT daily active users grow by 30% within one month of launch."
          />
        </Demo>

        <Demo name="Hypothesis — sm" full>
          <Hypothesis
            label="H1"
            size="sm"
            believe="increasing the visual affordance of Bluetooth Tracing will drive acquisition"
            because="users need a clear, persistent cue — not a buried setting."
            metric="BT daily active users grow by 30% within one month of launch."
          />
        </Demo>

        <Demo name="Findings table" full>
          <FindingsTable rows={FINDINGS} />
        </Demo>

        <Demo name="Journey" full>
          <Journey steps={JOURNEY} />
        </Demo>

        <Demo name="Case study nav" full>
          <CaseStudyNav
            title="Basis Home app"
            href="#"
            image={{ src: "/home/work/basis/BS1.jpg", alt: "Basis home app screen" }}
          />
        </Demo>

        <Demo name="Work item" full>
          <WorkItem
            number="SW/01"
            name="Basis home app"
            description="Defining and designing the world’s first Smart Electrical Panel companion app."
            roles="UX/UI, Research, Product strategy"
            href="#"
            images={[
              { src: "/home/work/basis/BS1.jpg", alt: "Basis home app screen" },
              { src: "/home/work/basis/BS2.jpg", alt: "Basis home app screen" },
              { src: "/home/work/basis/BS3.png", alt: "Basis home app screen" },
              { src: "/home/work/basis/BS4.png", alt: "Basis home app screen", quality: 75 },
            ]}
          />
        </Demo>

        <Demo name="Media blocks (placeholders)" full>
          <div className="flex flex-col gap-md">
            <ApproachMedia />
            <FlowDiagram />
            <DesignMedia />
            <OutcomeMedia />
          </div>
        </Demo>

        <Demo name="Gradient backdrop" full>
          {/* Contained preview, not a page backdrop: gutter 0 so the gradient
              fills this box exactly instead of overhanging it and relying on
              overflow-hidden to clip the excess. */}
          <div className="[--page-gutter:0px] relative h-[320px] w-full overflow-hidden rounded-[var(--size-6)]">
            <GradientBg height="320px" fullWidth />
          </div>
        </Demo>

        <Demo name="Case study hero" full>
          <CaseStudyHero
            titleTop="NZ Covid"
            titleBottom="Tracer App"
            lead="How I got half a million New Zealanders to switch on contact tracing"
            description="2.7 million New Zealanders downloaded the Covid Tracer app. Only 1.5 million had Bluetooth Tracing enabled, which allowed frictionless contact tracing that would kerb the spread. I diagnosed it as a UX failure and redesigned the experience, and 512,429 more people switched it on."
            meta={[
              { label: "Role_", value: "Senior Product Designer" },
              { label: "Scope_", value: "Strategy·UX/UI·Research" },
              { label: "Date_", value: "20’ – 21’" },
            ]}
            recognition={[
              { label: "Recognition_", value: "Best Design Award, Gold" },
            ]}
            images={[
              { src: "/home/work/covid-tracer/MOH1.jpg", alt: "NZ COVID Tracer app screen" },
              { src: "/home/work/covid-tracer/MOH2.jpg", alt: "NZ COVID Tracer app screen" },
              { src: "/home/work/covid-tracer/MOH3.jpg", alt: "NZ COVID Tracer app screen" },
            ]}
          />
        </Demo>
      </section>

      {/* ============================ SPACING ============================ */}
      <section className="flex flex-col gap-lg">
        <SectionTitle>Spacing scale</SectionTitle>
        <div className="flex flex-col gap-2xs">
          {SPACING.map(([name, px]) => (
            <div key={name} className="flex items-center gap-md">
              <span className="m-2xs text-text-tertiary w-[var(--size-13)] shrink-0">{name}</span>
              <div className="h-xl bg-utility-blue-400" style={{ width: `var(--spacing-${name})` }} />
              <span className="m-2xs text-text-quaternary shrink-0">{px}px</span>
            </div>
          ))}
        </div>
      </section>

      {/* ============================ RADIUS ============================ */}
      <section className="flex flex-col gap-lg">
        <SectionTitle>Radius scale</SectionTitle>
        <div className="flex flex-wrap gap-xl">
          {RADII.map(([name, px]) => (
            <div key={name} className="flex flex-col gap-3xs">
              <div
                className="size-15 border border-border-highlight bg-bg-inverse"
                style={{ borderRadius: `var(--radius-${name})` }}
              />
              <Label>{`${name} · ${px === "9999" ? "full" : px + "px"}`}</Label>
            </div>
          ))}
        </div>
      </section>

      {/* ============================ PRIMITIVES ============================ */}
      <section className="flex flex-col gap-lg">
        <SectionTitle>Primitives — colour ramps</SectionTitle>
        <div className="flex flex-col gap-md">
          {PRIMITIVE_RAMPS.map(([name, prefix]) => (
            <div key={name} className="flex flex-col gap-3xs">
              <Label>{name}</Label>
              <div className="flex gap-3xs">
                {STEPS.map((s) => (
                  <div key={s} className="flex flex-1 flex-col gap-3xs">
                    <div
                      className="h-3xl rounded-[var(--size-1)] border border-border-overlay"
                      style={{ backgroundColor: `var(${prefix}${s})` }}
                    />
                    <span className="m-2xs text-text-quaternary text-center">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================ SEMANTIC ============================ */}
      <section className="flex flex-col gap-lg">
        <SectionTitle>Semantic</SectionTitle>
        {SEMANTIC_GROUPS.map((group) => (
          <div key={group.title} className="flex flex-col gap-sm">
            <Label>{group.title}</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-md">
              {group.tokens.map((t) => (
                <Swatch key={t} token={t} />
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* ============================ UTILITY RAMPS ============================ */}
      <section className="flex flex-col gap-lg">
        <SectionTitle>Utility ramps</SectionTitle>
        <p className="b-xs text-text-secondary max-w-[var(--size-80)]">
          These invert in dark mode — e.g. gray 50↔950, and red switches from the
          red-light family to red-dark. Toggle dark mode to verify.
        </p>
        <div className="flex flex-col gap-lg">
          {UTILITY_RAMPS.map(([name, prefix]) => (
            <Ramp key={name} name={name} prefix={prefix} />
          ))}
        </div>
      </section>

      {/* ============================ GRADIENTS ============================ */}
      <section className="flex flex-col gap-lg">
        <SectionTitle>Gradient tokens</SectionTitle>
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-md">
          {GRADIENT_TOKENS.map((t) => (
            <Swatch key={t} token={t} />
          ))}
        </div>
      </section>

      {/* ============================ TYPOGRAPHY ============================ */}
      <section className="flex flex-col gap-lg">
        <SectionTitle>Typography — display (Geist)</SectionTitle>
        <div className="flex flex-col gap-md overflow-x-hidden">
          {DISPLAY_STYLES.map(([cls, px]) => (
            <div key={cls} className="flex items-baseline gap-md border-b border-border-overlay pb-2xs">
              <span className="m-2xs text-text-tertiary w-[var(--size-40)] shrink-0">{`${cls} · ${px}px`}</span>
              <span className={`${cls} truncate`}>Refined</span>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-lg">
        <SectionTitle>Typography — body (Geist)</SectionTitle>
        <div className="flex flex-col gap-md">
          {BODY_STYLES.map(([cls, px]) => (
            <div key={cls} className="flex items-baseline gap-md border-b border-border-overlay pb-2xs">
              <span className="m-2xs text-text-tertiary w-[var(--size-40)] shrink-0">{`${cls} · ${px}px`}</span>
              <span className={cls}>The quick brown fox jumps over the lazy dog</span>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
