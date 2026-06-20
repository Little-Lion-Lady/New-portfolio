/*
  Token foundation proof page — full reference.
  Temporary: exists only to verify every token in Instruction.md loads and
  resolves in both light and dark. Colour swatches read `var(--token)` directly
  (the truest proof a token exists); typography uses the named display, mono and
  body utility classes so we also verify they override Tailwind defaults.
*/

import type { CSSProperties } from "react";

const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

// --- Primitive ramps (mode-independent) ---
const PRIMITIVE_RAMPS: Array<[string, string]> = [
  ["gray-dark", "--colour-gray-dark-"],
  ["gray-light", "--colour-gray-light-"],
  ["orange", "--colour-orange-"],
  ["red-light", "--colour-red-light-"],
  ["red-dark", "--colour-red-dark-"],
  ["blue", "--colour-blue-"],
];

// --- Semantic tokens (light/dark via the token itself) ---
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

// --- Utility ramps (auto-invert per Instruction.md) ---
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
const MONO_STYLES: Array<[string, string]> = [
  ["m-xl", "32"], ["m-lg", "24"], ["m-md", "20"], ["m-sm", "16"], ["m-xs", "14"], ["m-2xs", "12"],
];
const BODY_STYLES: Array<[string, string]> = [
  ["b-xl", "44"], ["b-lg", "32"], ["b-md", "24"], ["b-sm", "20"], ["b-xs", "16"], ["b-2xs", "14"], ["b-3xs", "12"],
];

function Label({ children }: { children: string }) {
  return (
    <span className="m-2xs text-text-tertiary" style={{ wordBreak: "break-word" }}>
      {children}
    </span>
  );
}

function SectionTitle({ children }: { children: string }) {
  return <h2 className="m-sm uppercase tracking-widest text-text-tertiary">{children}</h2>;
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

export default function TokenProof() {
  return (
    <main className="bg-bg-primary text-text-primary min-h-screen px-2xl py-3xl flex flex-col gap-5xl">
      <header className="flex flex-col gap-2xs">
        <p className="m-xs uppercase tracking-widest text-text-highlight">Token foundation</p>
        <h1 className="d-md text-text-primary">Refined design system</h1>
        <p className="b-md text-text-secondary max-w-[var(--size-80)]">
          Every swatch and type sample below is wired to a token in Instruction.md.
          Toggle OS dark mode to confirm the semantic and utility layers invert correctly.
        </p>
      </header>

      {/* PRIMITIVES */}
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

      {/* SEMANTIC */}
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

      {/* UTILITY RAMPS */}
      <section className="flex flex-col gap-lg">
        <SectionTitle>Utility ramps</SectionTitle>
        <p className="b-xs text-text-secondary max-w-[var(--size-80)]">
          These invert in dark mode per Instruction.md — e.g. gray 50↔950, and red
          switches from the red-light family to red-dark. Toggle dark mode to verify.
        </p>
        <div className="flex flex-col gap-lg">
          {UTILITY_RAMPS.map(([name, prefix]) => (
            <Ramp key={name} name={name} prefix={prefix} />
          ))}
        </div>
      </section>

      {/* GRADIENTS */}
      <section className="flex flex-col gap-lg">
        <SectionTitle>Gradient tokens</SectionTitle>
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-md">
          {GRADIENT_TOKENS.map((t) => (
            <Swatch key={t} token={t} />
          ))}
        </div>
      </section>

      {/* TYPOGRAPHY */}
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

      <section className="flex flex-col gap-lg">
        <SectionTitle>Typography — mono (Geist Mono)</SectionTitle>
        <div className="flex flex-col gap-md">
          {MONO_STYLES.map(([cls, px]) => (
            <div key={cls} className="flex items-baseline gap-md border-b border-border-overlay pb-2xs">
              <span className="m-2xs text-text-tertiary w-[var(--size-40)] shrink-0">{`${cls} · ${px}px`}</span>
              <span className={cls}>const tokens = source.of.truth;</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
