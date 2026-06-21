import { ThemeToggle } from "./theme-toggle";

// Figma "Header" component. Responsive grid: 4 cols (mobile) / 8 (tablet) / 12 (desktop),
// gap-lg, bg gradient bg-primary → transparent. Text B-3xs (mobile/tablet) → B-2xs (desktop).
// Mobile: name + one nav + toggle. Tablet/desktop: name + role + two nav + toggle.
// Padding per Figma: mobile px-md/pt-xs/pb-2xl · tablet+desktop pt-lg/pb-3xl · px 3xl→5xl.
// Sticky + -mx bleed is page-level chrome; toggle is a placeholder until ThemeToggle (#5).
export function SiteHeader() {
  return (
    <header
      className="fixed inset-x-0 top-0 z-50 px-0 pt-xs pb-2xl md:pt-lg md:pb-3xl lg:px-5xl"
      style={{ background: "linear-gradient(to bottom, var(--bg-primary) 0%, var(--bg-transparency) 100%)" }}
    >
      <nav className="grid grid-cols-4 items-center gap-lg md:grid-cols-8 lg:grid-cols-12">
        <p className="col-start-1 col-span-2 b-3xs text-text-primary md:col-span-1 lg:col-span-2 lg:b-2xs">
          Maryna Babych
        </p>
        <p className="hidden b-3xs text-text-primary md:col-start-2 md:col-span-2 md:block lg:col-start-3 lg:b-2xs">
          Lead Product Designer
        </p>
        <a
          href="#work"
          className="hidden b-3xs text-text-primary transition-colors hover:text-text-primary-hover lg:col-start-10 lg:block lg:justify-self-start lg:b-2xs"
        >
          Work
        </a>
        <a
          href="#about"
          className="hidden justify-self-start b-3xs text-text-primary transition-colors hover:text-text-primary-hover md:col-start-7 md:block lg:col-start-11 lg:b-2xs"
        >
          About
        </a>
        <ThemeToggle className="col-start-4 justify-self-end md:col-start-8 lg:col-start-12" />
      </nav>
    </header>
  );
}
