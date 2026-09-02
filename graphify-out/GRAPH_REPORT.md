# Graph Report - New Portfolio  (2026-09-02)

## Corpus Check
- Large corpus: 206 files · ~1,993,888 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder.

## Summary
- 419 nodes · 802 edges · 22 communities (18 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 12 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Case Study Hero
- About Page and Button
- Lottie Cat Animations
- Package Manifest and Tooling
- TypeScript Configuration
- Image Pipeline and Collages
- Design Token Showcase
- Case Study Content Blocks
- Theme and Page Curtain
- Scroll Reveal and Header
- Covid Tracer Case Study
- First Table Media Blocks
- Runtime Dependencies
- First Table Case Study
- Chrome CDP Measurement Scripts
- Blur Placeholder Generator
- Neat Gradient Background
- Image Sizes Generator
- Journey Step Diagram
- ESLint Configuration
- Next.js Configuration
- PostCSS Configuration

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `Reveal()` - 14 edges
3. `useIsDark()` - 13 edges
4. `remapColors()` - 10 edges
5. `useHeroIntroSkip()` - 9 edges
6. `RevealWords()` - 9 edges
7. `GlassImage()` - 9 edges
8. `Button()` - 8 edges
9. `Divider()` - 8 edges
10. `useHasMounted()` - 8 edges

## Surprising Connections (you probably didn't know these)
- `AboutCat()` --calls--> `useSectionReveal()`  [EXTRACTED]
  app/components/about-cat.tsx → app/components/section-reveal-context.tsx
- `HeroText()` --indirect_call--> `markHeroIntroSeen()`  [INFERRED]
  app/components/hero-text.tsx → app/components/hero-seen.ts
- `ThemeToggle()` --calls--> `useIsDark()`  [EXTRACTED]
  app/components/theme-toggle.tsx → app/components/use-is-dark.ts
- `AboutCat()` --calls--> `remapColors()`  [EXTRACTED]
  app/components/about-cat.tsx → app/components/lottie-utils.ts
- `AboutCat()` --calls--> `useIsDark()`  [EXTRACTED]
  app/components/about-cat.tsx → app/components/use-is-dark.ts

## Import Cycles
- None detected.

## Communities (22 total, 4 thin omitted)

### Community 0 - "Case Study Hero"
Cohesion: 0.06
Nodes (53): CaseStudyHero(), MetaItem, getServerSnapshot(), getSnapshot(), markHeroIntroSeen(), subscribe(), useHeroIntroSeen(), useHeroIntroSkip() (+45 more)

### Community 1 - "About Page and Button"
Cohesion: 0.08
Nodes (26): artwork, awards, experience, metadata, arrowVariants, Button(), isExternalHref(), MotionLink (+18 more)

### Community 2 - "Lottie Cat Animations"
Cohesion: 0.15
Nodes (25): AboutCat(), DARK_MAP, AboutCat, HeroCat, MeCat, Star, DARK_MAP, HeroCat() (+17 more)

### Community 3 - "Package Manifest and Tooling"
Cohesion: 0.07
Nodes (29): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node (+21 more)

### Community 4 - "TypeScript Configuration"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 5 - "Image Pipeline and Collages"
Cohesion: 0.11
Nodes (18): ArtworkStrip(), BioCollage(), blurFor(), IMAGE_BLUR, IMAGE_RATIOS, IMAGE_SIZES, sizesFor(), CARD_CLASS (+10 more)

### Community 6 - "Design Token Showcase"
Cohesion: 0.10
Nodes (13): Hypothesis(), SectionHeader(), BODY_STYLES, DISPLAY_STYLES, FINDINGS, GRADIENT_TOKENS, JOURNEY, PRIMITIVE_RAMPS (+5 more)

### Community 7 - "Case Study Content Blocks"
Cohesion: 0.13
Nodes (16): KeyParagraph(), BasisOutcomeMedia(), ProcessMedia(), PrototypeMedia(), SolutionMedia(), OptionCard(), OptionCards(), ResearchFindings() (+8 more)

### Community 8 - "Theme and Page Curtain"
Cohesion: 0.13
Nodes (17): BLUR_LAYERS, CurtainEdge(), FEATHER_PX, PageCurtain(), Phase, stop(), Target, targetForClick() (+9 more)

### Community 9 - "Scroll Reveal and Header"
Cohesion: 0.14
Nodes (15): SectionReveal(), SectionRevealContext, SectionRevealState, Tag, SiteHeader(), BackdropTone, cache, isMedia() (+7 more)

### Community 10 - "Covid Tracer Case Study"
Cohesion: 0.14
Nodes (12): Hmw(), Insight(), ApproachMedia(), DesignMedia(), FlowDiagram(), OutcomeMedia(), Stat(), Stats() (+4 more)

### Community 11 - "First Table Media Blocks"
Cohesion: 0.12
Nodes (14): LoopingVideo(), DetailVideo, FTDesignSystemMedia(), FTRedesignMedia(), FTResearchMedia(), FTValidationMedia(), OUTCOME_ROW1, OUTCOME_ROW2 (+6 more)

### Community 12 - "Runtime Dependencies"
Cohesion: 0.12
Nodes (17): @firecms/neat, framer-motion, geist, lottie-react, next, dependencies, @firecms/neat, framer-motion (+9 more)

### Community 13 - "First Table Case Study"
Cohesion: 0.17
Nodes (11): Column(), Divider(), FindingsTable(), FTOutcomeMedia(), FTProblemMedia(), blockers, findings, frictionPoints (+3 more)

### Community 14 - "Chrome CDP Measurement Scripts"
Cohesion: 0.21
Nodes (8): CHROME_PATHS, connectCDP(), findChrome(), launchChrome(), out, PAGES, PORT, WIDTHS

### Community 15 - "Blur Placeholder Generator"
Cohesion: 0.20
Nodes (8): body, bytes, entries, EXT, files, OUT, PUBLIC_DIR, ROOT

### Community 16 - "Neat Gradient Background"
Cohesion: 0.28
Nodes (7): GradientBg(), NeatGradientBg, darkColors, defaultConfig, lightColors, NeatGradientBg(), paintStaticFallback()

### Community 17 - "Image Sizes Generator"
Cohesion: 0.40
Nodes (4): body, entries, measured, OUT

## Knowledge Gaps
- **165 isolated node(s):** `experience`, `awards`, `artwork`, `metadata`, `DARK_MAP` (+160 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 192 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useIsDark()` connect `Lottie Cat Animations` to `Theme and Page Curtain`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `ThemeToggle()` connect `Theme and Page Curtain` to `Scroll Reveal and Header`, `Lottie Cat Animations`, `Design Token Showcase`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **Why does `EASE` connect `Case Study Hero` to `Theme and Page Curtain`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `useIsDark()` (e.g. with `getSnapshot()` and `subscribe()`) actually correct?**
  _`useIsDark()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `experience`, `awards`, `artwork` to the rest of the system?**
  _165 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Case Study Hero` be split into smaller, more focused modules?**
  _Cohesion score 0.0625 - nodes in this community are weakly interconnected._
- **Should `About Page and Button` be split into smaller, more focused modules?**
  _Cohesion score 0.08235294117647059 - nodes in this community are weakly interconnected._