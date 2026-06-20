# Portfolio Rebuild Prompts

Reusable, self-contained prompts for rebuilding the core systems of the portfolio in a
fresh repo. Each prompt reconstructs one system as it was actually implemented — including
the accessibility paths, SSR-safety tricks, and exact timing/easing constants.

**Token names in these prompts are illustrative.** Always wire styling to the real tokens
defined in `Instruction.md` (e.g. `--text-text-highlight`, `--bg-bg-primary`,
`--text-text-primary-overlay`). Where a prompt says "highlight color" or "primary overlay",
map it to the current semantic token — note the new system uses **blue** as the dark-mode
highlight, not red, so gradient and scramble dark overrides should follow that.

Stack assumed: Next.js + Tailwind v4 (theme in `globals.css` via `@theme inline`, no
`tailwind.config.ts`) + Framer Motion. Every component is `"use client"` and respects
`prefers-reduced-motion`.

---

## 0 — Design-token foundation (build this first)

```text
Set up a three-layer design-token system in globals.css, sourced from Instruction.md.

Layers (in order):
1. Primitives — raw values: full colour ramps (gray-light/gray-dark/red-light/red-dark/
   orange/blue, each 50–950), a numeric size scale, typography primitives (font sizes,
   line heights, weights, families). Names exactly as in Instruction.md.
2. Semantic tokens — purpose-named aliases that reference ONLY primitives: bg-*, text-*,
   border-*, component-*, shadows-*. Each has a light and a dark value.
3. Utility colour scales — beige/red/orange/blue/gray ramps that auto-invert in dark mode
   (/50 light = /950 dark, etc.).
4. Component tokens — element-specific aliases (button bg/hover/pressed, etc.).

Wire it for Tailwind v4 with `@theme inline` mapping --color-*, --font-*, spacing, etc. to
the semantic tokens so utilities like `text-text-primary` / `gap-2xl` work.

Hard rules (enforce in CLAUDE.md / Instruction.md too):
- Never hardcode hex/px. Never use Tailwind's built-in colour or spacing scale.
- Semantic tokens reference primitives only; components reference semantic/utility tokens.
- Tailwind v4 gotcha: `text-[var(--token)]` compiles to `color`. For font-size always use
  `text-[length:var(--font-size-...)]`.
- If a needed value has no token, STOP and flag it — don't invent one.
```

---

## 1 — Text reveal animation

```text
Build a `Reveal` component (React + Framer Motion, "use client") that fades a single
element into view on scroll. Requirements:

- Props: `children`, `index = 0`, `as = "div"` (allow div/p/span/li/h1/h2/h3 so
  semantics are preserved), `blur = false`, `className`, `style`.
- Render `motion[as]` with `initial="hidden"`, variants keyed hidden/visible.
- Default variant: hidden = { opacity: 0, y: 16 }, visible = { opacity: 1, y: 0 }
  with duration 0.4s and ease [0.16, 1, 0.3, 1]. Stagger groups via a `custom={index}`
  variant function that delays by index * 0.06s.
- `blur` variant: hidden = { filter: "blur(8px)", opacity: 0 }, visible =
  { filter: "blur(0px)", opacity: 1 }, duration 0.6s, ease [0.445, 0.05, 0.55, 0.95].
- Trigger: Framer's `useInView(ref, { once: true, margin: "-40px 0px" })`.
- Gate playback on a React context value `useSectionActive()` (default true): only
  animate when `sectionActive && inView`. This lets a parent section hold children
  hidden until the section itself scrolls in.
- Respect `useReducedMotion()`: swap to a reduced variant that just fades opacity
  0→1 over 0.01s, no transform, no blur.

Only animate opacity / transform / filter — never width, height, margin, or padding.
```

---

## 2 — Text scramble animation

```text
Build a `ScrambleText` component (React, "use client") that reveals a string with a
per-character "decode" scramble, left-to-right, with a single moving highlight cell.

Behaviour:
- Split `children` (a string) into per-character spans. Reveal strictly left-to-right.
- The whole line completes within a fixed budget: TOTAL_BUDGET_MS = 400. Compute
  stagger = budget / charCount; each letter's own window = stagger; within that window
  cycle CYCLES_PER_LETTER = 3 random glyphs (from a CHARS set of symbols + A-Z0-9)
  before locking the final glyph. Cycle interval = letterDuration / CYCLES_PER_LETTER.
- One highlight at a time: when a letter is mid-scramble its span gets
  background `var(--scramble-highlight-bg)` and color `var(--scramble-highlight-fg)`;
  cleared when it locks. (Define those two tokens in globals.css with light/dark values.)
- Spaces don't scramble — reveal them at their slot's start.

FOUC prevention (critical): enforce hidden state at render, not in an effect. Initial
useState is "all cells null" (null = render the real glyph but with visibility:hidden so
layout is reserved and nothing is painted). SSR output and client first paint are
identical. The scramble swaps each hidden cell for a cycling random char, then the real
glyph — the resolved string is never painted before the scramble reaches that letter.

Timers: schedule all steps with setTimeout, track ids in a ref, clear on unmount. Guard
with a `startedRef` so it runs once; reset the guard on unmount so StrictMode double-invoke
and remounts replay correctly.

Gating: hold until `useSectionActive()` (shared context, default true) is true.

Reduced motion (`useReducedMotion()`): skip scramble entirely; reveal all glyphs at once
and fade the container opacity 0→1 over 200ms.

Accessibility: wrap the visual spans in `aria-hidden="true"` and put `aria-label={text}`
on the container so screen readers get the clean string.

Use `useLayoutEffect` on the client (fall back to `useEffect` on the server) so the start
runs before paint.
```

---

## 3 — Header progressive-blur scroll background

```text
Build a fixed site header for the home page with a scroll-aware, three-layer backdrop.
The header content (logo, role, About link, theme toggle) lives in a separate `SiteHeader`
component; this prompt is about the backdrop behind it.

Track a `navState` of "none" | "hero" | "page" with a scroll listener (rAF-throttled,
passive, also on resize). Logic:
- scrollY < 1                       → "none"
- hero name element's bounding bottom > 80px → "hero"
- otherwise                          → "page"
Compute once on mount; only setState when the value actually changes.

Render a fixed, top-0, full-width, z-100 container (fade it in once via Framer opacity
0→1 with a delay). Inside, three absolutely-positioned, pointer-events-none, aria-hidden
layers that cross-fade on `opacity` with `transition: opacity 350ms ease`:

1. Progressive blur: `backdrop-filter: blur(14px)` (+ -webkit-), masked with
   `mask-image: linear-gradient(to bottom, black 55%, transparent 100%)` so the blur
   feathers out toward the bottom edge. Opacity 1 when navState !== "none", else 0.
2. Hero tint: `linear-gradient(to bottom, var(--text-highlight), transparent)`,
   opacity 0.18 only in "hero" state.
3. Page tint: `linear-gradient(to bottom, var(--bg-primary) 0%, transparent 100%)`,
   opacity 1 only in "page" state.

Then the nav content row on top (position relative). All colors come from design tokens.
```

---

## 4 — Animated gradient background

```text
Build a CSS-driven animated radial-blob gradient background, wrapped in a `Gradient`
React component.

Component API: props `palette` (e.g. "red" | "gold", default "red"), `flip` (mirror
vertically via rotate-180, used in the footer), `blurPx` (default 25, applied as
`filter: blur(Npx)` for feathered edges), `className`. It renders a single
absolute inset-0 aria-hidden div with class `hero-gradient-animated` (+ a
`hero-gradient-animated--<palette>` modifier for alternate palettes).

CSS (all of this lives in globals.css):
- Register every animated sub-value as a typed custom property with `@property`
  (syntax `<color>` and `<percentage>`, inherits:false, initial-value set) so the
  browser can interpolate them. These MUST be at root level, not nested.
- The element stacks ~8 layered `radial-gradient(circle at var(--x-n) var(--y-n),
  var(--c-n) var(--s-start-n), transparent var(--s-end-n))` images, each blob driven
  by its own --x/--y (position), --c (color), --s-start/--s-end (stops).
- Animate with `@keyframes ani-hero-gradient` over 15s linear infinite
  alternate-reverse, moving the blob positions/stops/colors between keyframes.
- Provide a parallel keyframe set per palette (same positions/timing, different colors)
  selected by the modifier class.
- Dark mode: under `[data-theme="dark"]` and the prefers-color-scheme media block,
  override the blob `--c-*` colors and switch animation-name to the dark variant. Use the
  current dark highlight family from Instruction.md (note: dark highlight is now blue).
- `@media (prefers-reduced-motion: reduce)`: set `animation-play-state: paused`.

Do not add will-change — the animation drives custom properties, not transform/opacity.
```

---

## 5 — Light/dark mode switcher

```text
Implement a light/dark theme system with a `ThemeToggle` button and a flash-free CSS
foundation.

CSS foundation (globals.css), three coordinated blocks for the same token set:
1. `:root` — light-mode token values.
2. `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]):not([data-theme="dark"]) { ... } }`
   — dark values for first-time visitors, so CSS handles the default with no flash and
   no inline <script>.
3. `[data-theme="dark"] { ... }` — dark values for returning users who explicitly chose
   a theme. (And `[data-theme="light"]` falls through to :root.)
Every new token must be defined in all the relevant blocks. Gradient blob colors and
scramble-highlight colors get dark overrides too.

`ThemeToggle` component ("use client"):
- State: `isDark` and `manualOverride`.
- On mount, read `window.matchMedia("(prefers-color-scheme: dark)")`; if the user hasn't
  manually toggled, apply system preference and subscribe to its `change` event. A manual
  toggle wins for the session; a refresh resets to following the system.
- "Apply" = setIsDark + `document.documentElement.setAttribute("data-theme", dark ? "dark" : "light")`.
- Clicking flips the theme and sets manualOverride = true.
- Render a pill button (rounded-full, 1px border in the primary-overlay token) showing a
  Moon SVG in light mode and a Sun SVG in dark mode. `suppressHydrationWarning`,
  `aria-label` reflecting the action, visible focus ring. All colors are tokens.

Never use Tailwind's `dark:` prefix — dark values come from the token blocks.
```

---

## 6 — Responsive breakpoints

```text
Set up the responsive system for a Tailwind v4 + Next.js project (no tailwind.config —
theme lives in globals.css via @theme inline).

Three named breakpoints map to the three Figma frames:
- mobile  → no prefix          (< 768px)   — base styles
- tablet  → `md:`              (768–1023px)
- desktop → `lg:`              (≥ 1024px)
Plus ad-hoc `min-[Npx]:` for any reflow between named breakpoints.

Authoring rules:
- Mobile-first: unprefixed classes are the mobile design; layer `md:` then `lg:` on top.
- Drive responsive type/spacing with token-backed arbitrary values, and use the
  `text-[length:var(--token)]` form for font-size (in Tailwind v4 `text-[var(--token)]`
  compiles to `color`, not `font-size` — always use the `length:` hint).
  Example: `text-[length:var(--font-size-text-sm)] leading-[var(--line-height-body-sm)]
  md:text-[length:var(--font-size-text-md)] md:leading-[var(--line-height-body-md)]
  lg:text-[length:var(--font-size-text-xl)] lg:leading-[var(--line-height-body-lg)]`.
- Prefer the project's Responsive-spacing tokens (xs/sm/md/lg/xl/2xl/3xl, each with a
  mobile/tablet/desktop value per Instruction.md) over hand-rolling three breakpoint
  values when the spacing is on that scale.
- For values that genuinely scale per Figma frame, prefer discrete fixed tokens per
  breakpoint over clamp() — match Figma exactly rather than interpolating.
- Match each frame's spacing/gaps/padding exactly at its breakpoint; never approximate.
- Verify each breakpoint against its Figma frame by measuring computed styles, not by eye.
```

---

## Shared dependency — SectionReveal + context

Prompts 1 and 2 both gate on `useSectionActive()`. Build this small pair alongside them:

```text
Build a `SectionRevealContext` (createContext default { active: true }) with a
`useSectionActive()` hook, and a `SectionReveal` wrapper component ("use client").

SectionReveal:
- Invisible scroll-trigger — it never animates (no opacity/transform/transition of its own).
- Watches its ref with IntersectionObserver at threshold 0.15; on first intersection,
  flips context `active` to true and disconnects (fire-once).
- Props: `delay` (ms after intersection before activating), `notBefore` (absolute Date.now()
  timestamp gate, for staggering sibling sections), `as` ("section" | "div" | "footer"),
  plus className/style/id.
- Reduced motion: activate immediately on mount.
- SSR-safe: `active` starts false; server HTML and client first paint are identical.
Children (Reveal / ScrambleText / images) stay hidden until the section releases them.
```
