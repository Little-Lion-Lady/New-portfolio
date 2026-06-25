# Portfolio Site — Claude Code Instructions

This is a personal portfolio site built with Next.js, Tailwind CSS, and Framer Motion.
Designs are in Figma and use a custom design token system sourced from the **"Refined"** page
of the **"MCP playground"** Figma file.

Token system has three layers|
- **Primitives** — raw values (colour scales, size scale, typography primitives)
- **Semantic tokens** — purpose-named aliases (bg, text, border, component) with light/dark variants
- **Utility tokens** — colour scales that auto-invert in dark mode
- **Component tokens** — purpose-named aliases for specific component elements (bg, text, border, shadow) with light/dark variants

---

## 1. Design Tokens — Always, No Exceptions

**Always use design tokens. Never hardcode values. Never default to Tailwind`s built-in scale.**

All tokens are defined in `globals.css` (CSS custom properties) and/or `tailwind.config.ts`.
Before writing any styling, read both files and use only the values defined there.

```
✅ color| var(--text-primary)
✅ className="text-primary gap-2xl"
❌ color| #404040
❌ className="text-gray-700 gap-8"
```

This applies to all of the following. The token reference below is the source of truth.

---

### Colour Tokens

Primitive tokens are the basis that all other tokens are built on. Always references **semantic tokens**, **Utility tokens** and **Component tokens** to Primitive tokens.
|Token | Value |
| ---- | ----- |
`colour-gray-dark-100`| #d7d3d9|
`colour-gray-dark-200`| #d7d3d9|
`colour-gray-dark-300`| #bab3bc|
`colour-gray-dark-400`| #9c949f|
`colour-gray-dark-500`| #7d767f|
`colour-gray-dark-600`| #605a61|
`colour-gray-dark-700`| #3f3b40|
`colour-gray-dark-800`| #262327|
`colour-gray-dark-900`| #191719|
`colour-gray-dark-50`| #faf9fa|
`colour-orange-50`| #fdf6ef|
`colour-orange-100`| #fae9da|
`colour-orange-200`| #f5d0b3|
`colour-orange-300`| #eca877|
`colour-orange-400`| #e68651|
`colour-orange-500`| #e0682f|
`colour-orange-600`| #d15025|
`colour-orange-700`| #ae3c20|
`colour-orange-800`| #8b3221|
`colour-orange-900`| #702b1e|
`colour-red-light-50`| #fff0f0|
`colour-red-light-100`| #ffdddd|
`colour-red-light-200`| #ffc0c0|
`colour-red-light-300`| #ff9494|
`colour-red-light-400`| #ff5757|
`colour-red-light-500`| #ff3d3d|
`colour-red-light-600`| #ff0000|
`colour-red-light-700`| #d70000|
`colour-red-light-800`| #b10303|
`colour-red-light-900`| #920a0a|
`colour-blue-50`| #e9f0ff|
`colour-blue-100`| #d6e4ff|
`colour-blue-200`| #b6cbff|
`colour-blue-300`| #8aa7ff|
`colour-blue-400`| #5c75ff|
`colour-blue-500`| #3744ff|
`colour-blue-600`| #1a15ff|
`colour-blue-700`| #150df7|
`colour-blue-800`| #100dc6|
`colour-blue-900`| #14159b|
`colour-base-white`| #ffffff|
`colour-base-black`| #000000|
`colour-base-white-transparent`| #ffffff|
`colour-gray-dark-950`| #0a090a|
`colour-red-light-950`| #500000|
`colour-orange-950`| #3c140e|
`colour-blue-950`| #0e0c5a|
`colour-gray-light-50`| #f2f4f8|
`colour-gray-light-100`| #dde1ea|
`colour-gray-light-200`| #c8cdda|
`colour-gray-light-300`| #a9afc1|
`colour-gray-light-400`| #8b91a7|
`colour-gray-light-500`| #6f778d|
`colour-gray-light-600`| #555c6f|
`colour-gray-light-700`| #3b414e|
`colour-gray-light-800`| #282c37|
`colour-gray-light-900`| #171a21|
`colour-gray-light-950`| #0f1117|
`colour-gray-dark-950-50`| #0a090a|
`colour-gray-light-950-50`| #0f1117|
`size-7`| 16px|
`size-5`| 10px|
`size-4`| 8px|
`size-3`| 6px|
`size-64`| 256px|
`size-56`| 224px|
`size-2`| 4px|
`size-40`| 160px|
`size-32`| 128px|
`size-13`| 48px|
`size-48`| 192px|
`size-18`| 96px|
`size-6`| 12px|
`size-17`| 80px|
`size-16`| 72px|
`size-72`| 300px|
`size-15`| 64px|
`size-14`| 56px|
`size-10`| 32px|
`size-8`| 20px|
`size-1`| 2px|
`size-12`| 44px|
`size-9`| 24px|
`size-11`| 40px|
`size-80`| 320px|
`size-0`| 0px|
`colour-base-black-transparent`| #000000|
`colour-gray-light-50-30`| #f2f4f8|
`colour-gray-light-950-10`| #0f1117|
`colour-gray-dark-50-60`| #faf9fa|
`colour-gray-light-800-50`| #282c37|
`colour-gray-light-500-80`| #6f778d|
`colour-gray-light-50-00`| #f2f4f8|
`colour-gray-dark-50-20`| #faf9fa|
`colour-gray-dark-50-00`| #faf9fa|
`colour-red-dark-50`| #fff0f2|
`colour-red-dark-100`| #ffdde2|
`colour-red-dark-200`| #ffc0c8|
`colour-red-dark-300`| #ff94a2|
`colour-red-dark-400`| #fb4b62|
`colour-red-dark-500`| #fb2841|
`colour-red-dark-600`| #fb001d|
`colour-red-dark-700`| #d7001d|
`colour-red-dark-800`| #b1031a|
`colour-red-dark-900`| #920a1c|
`colour-red-dark-950`| #50000b|
`colour-blue-100-10`| #d6e4ff|
`colour-blue-200-50`| #b6cbff|


**Semantic — Colour**
Always use **semantic tokens** first. Fall back to utility tokens for scale-dependent colour.
Never use primitive hex values directly. Never use Tailwind`s built-in colour classes.
| Token | Light | Dark |
|-------|-------|------|
| `bg-primary` | `var(--colour-gray-light-50)` | `var(--colour-gray-dark-950)` |
| `bg-light` | `var(--colour-gray-light-50)` | `var(--colour-base-black)` |
| `bg-transparency` | `var(--colour-gray-light-50-00)` | `var(--colour-base-black-transparent)` |
| `bg-white` | `var(--colour-base-white)` | `var(--colour-base-white)` |
| `bg-inverse` | `var(--colour-gray-light-500)` | `var(--colour-gray-dark-800)` |
| `bg-highlight` | `var(--colour-blue-200)` | `var(--colour-blue-950)` |
| `text-primary` | `var(--colour-gray-light-700)` | `var(--colour-gray-light-100)` |
| `text-primary-hover` | `var(--colour-gray-light-600)` | `var(--colour-gray-dark-300)` |
| `text-primary-pressed` | `var(--colour-gray-light-500)` | `var(--colour-gray-dark-400)` |
| `text-primary-overlay` | `var(--colour-gray-light-950-50)` | `var(--colour-gray-dark-50-60)` |
| `text-primary-highight` | `var(--colour-gray-light-950)` | `var(--colour-base-white)` |
| `text-secondary` | `var(--colour-gray-light-600)` | `var(--colour-gray-dark-200)` |
| `text-tertiary` | `var(--colour-gray-light-400)` | `var(--colour-gray-dark-400)` |
| `text-quaternary` | `var(--colour-gray-light-300)` | `var(--colour-gray-dark-500)` |
| `text-inverted` | `var(--colour-base-white)` | `var(--colour-blue-950)` |
| `text-decorative` | `var(--colour-gray-light-200)` | `var(--colour-gray-dark-700)` |
| `text-highlight` | `var(--colour-red-light-600)` | `var(--colour-blue-500)` |
| `text-highlight-subtle` | `var(--utility-gray-950)` | `var(--colour-blue-300)` |
| `text-highlight-dark` | `var(--colour-red-light-600)` | `var(--colour-blue-300)` |
| `border-border-primary` | `var(--colour-gray-light-200)` | `var(--colour-gray-dark-700)` |
| `border-border-secondary` | `var(--colour-gray-dark-200)` | `var(--colour-gray-dark-900)` |
| `border-border-overlay` | `var(--colour-gray-light-950-10)` | `var(--colour-gray-light-50-30)` |
| `border-border-highlight` | `var(--colour-gray-light-600)` | `var(--colour-gray-dark-100)` |
| `component-bg-button-primary` | `var(--colour-gray-light-950)` | `var(--colour-base-white)` |
| `component-bg-button-hover` | `var(--colour-gray-light-900)` | `var(--colour-blue-100)` |
| `component-bg-button-pressed` | `var(--colour-gray-light-800)` | `var(--colour-blue-200)` |
| `shadows-shadow-01` | `var(--colour-gray-light-950-50)` | `var(--colour-blue-200-50)` |
| `shadows-shadow-02` | `var(--colour-gray-light-950-10)` | `var(--colour-blue-100-10)` |
| `shadows-glow-01` | `var(--colour-gray-light-50-30)` | `var(--colour-blue-100)` |

**Utility colour scales** — use when you need a specific step in a colour ramp.
Utility scales auto-invert in dark mode (/50 light = /950 dark, etc.).
| Token | Light | Dark | 
|-------|-------|------|
| `utility-blue-50` | `var(--colour-blue-50)` | `var(--colour-blue-950)` |
| `utility-blue-100` | `var(--colour-blue-100)` | `var(--colour-blue-900)` |
| `utility-blue-200` | `var(--colour-blue-200)` | `var(--colour-blue-800)` |
| `utility-blue-300` | `var(--colour-blue-300)` | `var(--colour-blue-700)` |
| `utility-blue-400` | `var(--colour-blue-400)` | `var(--colour-blue-600)` |
| `utility-blue-500` | `var(--colour-blue-500)` | `var(--colour-blue-500)` |
| `utility-blue-600` | `var(--colour-blue-600)` | `var(--colour-blue-400)` |
| `utility-blue-700` | `var(--colour-blue-700)` | `var(--colour-blue-300)` |
| `utility-blue-800` | `var(--colour-blue-800)` | `var(--colour-blue-200)` |
| `utility-blue-900` | `var(--colour-blue-900)` | `var(--colour-blue-100)` |
| `utility-blue-950` | `var(--colour-blue-950)` | `var(--colour-blue-50)` |
| `utility-beige-100` | `var(--colour-gray-dark-100)` | `var(--colour-gray-dark-900)` |
| `utility-beige-200` | `var(--colour-gray-dark-200)` | `var(--colour-gray-dark-800)` |
| `utility-beige-300` | `var(--colour-gray-dark-300)` | `var(--colour-gray-dark-700)` |
| `utility-beige-400` | `var(--colour-gray-dark-400)` | `var(--colour-gray-dark-600)` |
| `utility-beige-500` | `var(--colour-gray-dark-500)` | `var(--colour-gray-dark-500)` |
| `utility-beige-600` | `var(--colour-gray-dark-600)` | `var(--colour-gray-dark-400)` |
| `utility-beige-700` | `var(--colour-gray-dark-700)` | `var(--colour-gray-dark-300)` |
| `utility-beige-800` | `var(--colour-gray-dark-800)` | `var(--colour-gray-dark-200)` |
| `utility-beige-900` | `var(--colour-gray-dark-900)` | `var(--colour-gray-dark-100)` |
| `utility-red-100` | `var(--colour-red-light-100)` | `var(--colour-red-dark-900)` |
| `utility-red-200` | `var(--colour-red-light-200)` | `var(--colour-red-dark-800)` |
| `utility-red-300` | `var(--colour-red-light-300)` | `var(--colour-red-dark-700)` |
| `utility-red-400` | `var(--colour-red-light-400)` | `var(--colour-red-dark-600)` |
| `utility-red-500` | `var(--colour-red-light-500)` | `var(--colour-red-dark-500)` |
| `utility-red-600` | `var(--colour-red-light-600)` | `var(--colour-red-dark-400)` |
| `utility-red-700` | `var(--colour-red-light-700)` | `var(--colour-red-dark-300)` |
| `utility-red-800` | `var(--colour-red-light-800)` | `var(--colour-red-dark-200)` |
| `utility-red-900` | `var(--colour-red-light-900)` | `var(--colour-red-dark-100)` |
| `utility-orange-100` | `var(--colour-orange-100)` | `var(--colour-orange-900)` |
| `utility-orange-200` | `var(--colour-orange-200)` | `var(--colour-orange-800)` |
| `utility-orange-300` | `var(--colour-orange-300)` | `var(--colour-orange-700)` |
| `utility-orange-400` | `var(--colour-orange-400)` | `var(--colour-orange-600)` |
| `utility-orange-500` | `var(--colour-orange-500)` | `var(--colour-orange-500)` |
| `utility-orange-600` | `var(--colour-orange-600)` | `var(--colour-orange-400)` |
| `utility-orange-700` | `var(--colour-orange-700)` | `var(--colour-orange-300)` |
| `utility-orange-800` | `var(--colour-orange-800)` | `var(--colour-orange-200)` |
| `utility-orange-900` | `var(--colour-orange-900)` | `var(--colour-orange-100)` |
| `utility-beige-50` | `var(--colour-gray-dark-50)` | `var(--colour-gray-dark-950)` |
| `utility-red-50` | `var(--colour-red-light-50)` | `var(--colour-red-dark-950)` |
| `utility-orange-50` | `var(--colour-orange-50)` | `var(--colour-orange-950)` |
| `utility-orange-950` | `var(--colour-orange-950)` | `var(--colour-orange-50)` |
| `utility-red-950` | `var(--colour-red-light-950)` | `var(--colour-red-dark-50)` |
| `utility-beige-950` | `var(--colour-gray-dark-950)` | `var(--colour-gray-dark-50)` |
| `utility-gray-50` | `var(--colour-gray-light-50)` | `var(--colour-gray-light-950)` |
| `utility-gray-100` | `var(--colour-gray-light-100)` | `var(--colour-gray-light-900)` |
| `utility-gray-200` | `var(--colour-gray-light-200)` | `var(--colour-gray-light-800)` |
| `utility-gray-300` | `var(--colour-gray-light-300)` | `var(--colour-gray-light-700)` |
| `utility-gray-400` | `var(--colour-gray-light-400)` | `var(--colour-gray-light-600)` |
| `utility-gray-500` | `var(--colour-gray-light-500)` | `var(--colour-gray-light-500)` |
| `utility-gray-600` | `var(--colour-gray-light-600)` | `var(--colour-gray-light-400)` |
| `utility-gray-700` | `var(--colour-gray-light-700)` | `var(--colour-gray-light-300)` |
| `utility-gray-800` | `var(--colour-gray-light-800)` | `var(--colour-gray-light-200)` |
| `utility-gray-900` | `var(--colour-gray-light-900)` | `var(--colour-gray-light-100)` |
| `utility-gray-950` | `var(--colour-gray-light-950)` | `var(--colour-gray-light-50)` |

**Gradient tokens** (use only for gradient implementations)|
| Token | Light | Dark |
|-------|-------|------|
| `utility-gradient-red` | `var(--colour-red-light-600)` | `var(--colour-blue-600)` |
| `utility-gradient-orange` | `var(--colour-orange-400)` | `var(--colour-orange-950)` |
| `utility-gradient-transparent` | `var(--colour-base-white-transparent)` | `var(--colour-base-black-transparent)` |
| `utility-gradient-yellow1` | — | `#ffc31c` |
| `utility-gradient-yellow2` | — | `#a86801` |
| `utility-gradient-green1` | — | `#04b04c` |
| `utility-gradient-green2` | — | `#03411d` |
| `utility-gradient-blue1` | `var(--colour-blue-500)` | `var(--colour-red-light-500)` |
| `utility-gradient-blue2` | `var(--colour-blue-300)` | `var(--colour-blue-950)` |

---

### Spacing Tokens
Never use raw px values, rem values, or Tailwind`s default spacing scale (p-4, mt-8, gap-6, etc.).

| Token | Value |
|-------|-------|
| `spacing-lg` | `var(--size-8)`|
| `spacing-sm`| `var(--size-6)`|
| `spacing-xs`| `var(--size-4)`|
| `spacing-4xs`| `var(--size-1)`|
| `spacing-8xl`| `var(--size-32)`|
| `spacing-7xl`| `var(--size-18)`|
| `spacing-2xl`| `var(--size-10)`|
| `spacing-6xl`| `var(--size-17)`|
| `spacing-xl`| `var(--size-9)`|
| `spacing-3xs`| `var(--size-2)`|
| `spacing-5xl`| `var(--size-16)`|
| `spacing-2xs`| `var(--size-3)`|
| `spacing-9xl`| `var(--size-40)`|
| `spacing-md`| `var(--size-7)`|
| `spacing-none`| `var(--size-0)`|
| `spacing-4xl`| `var(--size-15)`|
| `spacing-3xl`| `var(--size-11)`|


For responsive elements, use **Responsive spaces** tokens

| Token | Breakpoint | Value |
|-------|-----–––––--|-------|
| `xs` | Desktop | `var(--spacing-sm)` |
| `xs` | Tablet | `var(--spacing-xs)` |
| `xs` | Mobile | `var(--spacing-xs)` |
| `sm` | Desktop | `var(--spacing-lg)` |
| `sm` | Tablet | `var(--spacing-md)` |
| `sm` | Mobile | `var(--spacing-md)` |
| `md` | Desktop | `var(--spacing-3xl)` |
| `md` | Tablet | `var(--spacing-2xl)` |
| `md` | Mobile | `var(--spacing-xl)` |
| `lg` | Desktop | `var(--spacing-4xl)` |
| `lg` | Tablet | `var(--spacing-4xl)` |
| `lg` | Mobile | `var(--spacing-3xl)` |
| `xl` | Desktop | `var(--spacing-6xl)` |
| `xl` | Tablet | `var(--spacing-4xl)` |
| `xl` | Mobile | `var(--spacing-2xl)` |
| `2xl` | Desktop | `var(--spacing-8xl)` |
| `2xl` | Tablet | `var(--spacing-6xl)` |
| `2xl` | Mobile | `var(--spacing-4xl)` |
| `3xl` | Desktop | `var(--spacing-9xl)` |
| `3xl` | Tablet | `var(--spacing-7xl)` |
| `3xl` | Mobile | `var(--spacing-5xl)` |

---

### Border Radius Tokens
Never hardcode `border-radius` values. Use the radius tokens below, which are backed by the size primitive scale.

| Token | Value | Primitive | Usage |
|-------|-------|-----------|-------|
| `radius-sm` | 12px | `var(--size-6)` | Carousel cards, small surfaces |
| `radius-md` | 16px | `var(--size-7)` | Divider top corners (mobile) |
| `radius-lg` | 20px | `var(--size-8)` | Divider top corners (tablet) |
| `radius-xl` | 24px | `var(--size-9)` | Divider top corners (desktop) |
| `radius-full` | 9999px | — | Pills, fully-rounded elements |

These map to Tailwind utilities: `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-full`, plus directional variants (`rounded-tl-md`, `rounded-tr-lg`, etc.).

---

### Typography Tokens

Three font families — use the correct one for the correct role|
- **Geist Mono** → monospaced/code/label text (`M-xl` through `M-2xs`)
- **Geist** → all body and UI text (`B-xl` through `B-3xs`)

Never mix font families outside their intended roles.

**Display styles**
| Style | Font family | Size | Line height | Weight |
| ----- | ----------- | ---- | ----------- | ------ |
| `d-2xl` | `font-family-font-family-body` (Geist) | `font-size-display-2xl` (224px) | — (115%, no token) | `font-weight-medium` (500) |
| `d-xl` | `font-family-font-family-body` (Geist) | `font-size-display-xl` (142px) | — (115%, no token) | `font-weight-medium` (500) |
| `d-lg` | `font-family-font-family-body` (Geist) | `font-size-display-lg` (124px) | — (115%, no token) | `font-weight-medium` (500) |
| `d-md` | `font-family-font-family-body` (Geist) | `font-size-display-md` (80px) | — (115%, no token) | `font-weight-medium` (500) |
| `d-sm` | `font-family-font-family-body` (Geist) | `font-size-display-sm` (60px) | — (115%, no token) | `font-weight-regular` (400) |
| `d-xs` | `font-family-font-family-body` (Geist) | `font-size-display-xs` (44px) | — (110%, no token) | `font-weight-regular` (400) |
| `d-2xs` | `font-family-font-family-body` (Geist) | `font-size-display-2xs` (32px) | — (120%, no token) | `font-weight-regular` (400) |

**Mono styles**
| `m-xl` | `font-family-font-family-mono` (Geist Mono) | `font-size-text-xl` (32px) | `line-height-mono-xl` (40px) | `font-weight-regular` (400) |
| `m-lg` | `font-family-font-family-mono` (Geist Mono) | `font-size-text-md` (24px) | `line-height-mono-lg` (36px) | `font-weight-regular` (400) |
| `m-md` | `font-family-font-family-mono` (Geist Mono) | `font-size-text-sm` (20px) | `line-height-mono-md` (32px) | `font-weight-regular` (400) |
| `m-sm` | `font-family-font-family-mono` (Geist Mono) | `font-size-text-xs` (16px) | `line-height-mono-sm` (28px) | `font-weight-regular` (400) |
| `m-xs` | `font-family-font-family-mono` (Geist Mono) | `font-size-text-2xs` (14px) | `line-height-mono-xs` (24px) | `font-weight-regular` (400) |
| `m-2xs` | `font-family-font-family-mono` (Geist Mono) | `font-size-text-3xs` (12px) | `line-height-mono-2xs` (20px) | `font-weight-regular` (400) |

**Body styles**
| `b-xl` | `font-family-font-family-body` (Geist) | `font-size-text-2xl` (44px) | `line-height-body-xl` (56px) | `font-weight-regular` (400) |
| `b-lg` | `font-family-font-family-body` (Geist) | `font-size-text-xl` (32px) | `line-height-body-lg` (48px) | `font-weight-regular` (400) |
| `b-md` | `font-family-font-family-body` (Geist) | `font-size-text-md` (24px) | `line-height-body-md` (40px) | `font-weight-regular` (400) |
| `b-sm` | `font-family-font-family-body` (Geist) | `font-size-text-sm` (20px) | `line-height-body-sm` (32px) | `font-weight-regular` (400) |
| `b-xs` | `font-family-font-family-body` (Geist) | `font-size-text-xs` (16px) | `line-height-body-xs` (24px) | `font-weight-regular` (400) |
| `b-2xs` | `font-family-font-family-body` (Geist) | `font-size-text-2xs` (14px) | `line-height-body-2xs` (20px) | `font-weight-regular` (400) |
| `b-3xs` | `font-family-font-family-body` (Geist) | `font-size-text-3xs` (12px) | `line-height-body-3xs` (18px) | `font-weight-regular` (400) |

---

### Size Tokens (component sizing, icons, fixed dimensions)

| Token | Value |
|-------|-------|
| `size-2xl` | `var(--size-10)` |
| `size-xl` | `var(--size-9)` |
| `size-lg` | `var(--size-8)` |
| `size-xs` | `var(--size-4)` |
|`size-2xs` | `var(--size-3)` |
| `size-8xl` | `var(--size-32)` |
| `size-sm` | `var(--size-6)` |
| `size-7xl` | `var(--size-18)` |
| `size-6xl` | `var(--size-17)` |
| `size-9xl` | `var(--size-40)` |
| `size-4xl` | `var(--size-15)` |
| `size-3xl` | `var(--size-11)` |
| `size-3xs` | `var(--size-2)` |
| `size-md` | `var(--size-7)` |
| `size-5xl` | `var(--size-16)` |

If a value you need doesn`t exist as a token, stop and flag it. Do not invent a value.

---

## 2. Component Reuse — Read Before You Write

**Before creating any new component, search the codebase for an existing one.**

Run a search across `/components` and `/app` for|
- The element type (e.g. "Button", "Card", "Section", "Heading", "Tag")
- The visual pattern (e.g. "animate", "reveal", "scroll", "grid")

Rules|
- Extend or compose existing components. Do not duplicate them.
- If a component needs a new variant, add a prop to the existing component — don`t create a second component alongside it.
- If a layout pattern appears more than once, it should be a component.
- Shared layout wrappers, section containers, and typography components already exist — use them.

If you genuinely need a new component, name it consistently with existing conventions and place it in the correct folder before use.

---

## 3. Colour — Do Not Override Custom Values

**Never override or replace custom colour tokens with Tailwind defaults or arbitrary values.**

The colour system is intentional and already designed. If a colour looks unexpected|
- Check whether you`re using the correct semantic token (e.g. `--color-surface` vs `--color-background`)
- Check whether a parent component is setting a CSS variable that should be inherited
- Do not "fix" a colour by hardcoding a different value

Dark mode colours are defined in the token system. Do not add separate dark mode overrides using Tailwind`s `dark|` prefix unless a token for that state does not exist.

If you encounter a colour that appears incorrect, flag it with the specific token name and location — do not silently change it.

---

## 4. Consistency — Styling Across Pages

**Every page must feel like it belongs to the same system.**

Before adding any styling to a page or component|
1. Check at least two existing pages for the same pattern
2. Match spacing, typography, and layout exactly
3. Use the same component for the same job — don`t reimplement a heading or section container inline

Specific rules|
- Section padding and max-width must use the same wrapper component or token across all pages
- Heading hierarchy (h1 → h2 → h3) must follow the same type token mapping on every page
- Interactive elements (links, buttons, tags) must use the same hover/focus states everywhere
- Dividers, image captions, and metadata text must use the same styling tokens throughout

If you notice an inconsistency between pages while working, fix it — don`t leave it.

---

## 5. Animation — Consistent Types and Triggers

**All animations must use the same motion system. Do not introduce new patterns.**

Before writing any animation code|
1. Read all existing Framer Motion variants in `/components`
2. Note the `duration`, `easing`, and `delay` values in use
3. Use those values — do not introduce new ones

### Rules

**Scroll reveals|**
- Use `useInView` with `once| true` and `amount| 0.2` unless an existing standard differs
- Trigger is viewport entry, not page load
- Animate `opacity` and `transform` (translateY) only — never width, height, margin, or padding

**Stagger sequences|**
- Use Framer Motion `staggerChildren` on the parent variant
- Stagger delay| match the value already in use (check existing components first)
- Total sequence duration must complete within 700ms of trigger

**Hover and interaction states|**
- Use the same hover animation type and duration across all interactive elements
- Check existing button/card/link components before adding a hover state to anything new

**Easing|**
- Use the easing tokens defined in the project (CSS custom property or JS constant)
- Default| ease-out for entering elements, ease-in for exiting
- Never use linear easing except for loading/progress indicators

**Accessibility|**
- Every animated component must respect `prefers-reduced-motion`
- Reduced motion fallback| instant appear, no translate, no scale
- This must be implemented in every component — not just globally

---

## 6. Code Quality

**Plan before you write. Make changes one file at a time.**

- Read all relevant files before touching anything
- If a task affects more than one file, list the planned changes and confirm before applying
- Do not refactor code that isn`t part of the current task
- Do not change visual output when the task is a refactor
- TypeScript| no `any` types| match the type conventions already in the project
- Imports| no unused imports| use path aliases (`@/components/...`) consistently

---

## 7. When You`re Unsure

- If a token doesn`t exist for the value you need → flag it, don`t hardcode
- If two components could do the job → flag it, don`t create a third
- If a design spec is ambiguous → flag it with a specific question, don`t guess
- If fixing one thing will break another → flag it before making the change

Do not silently make judgement calls on design decisions. Flag them.
