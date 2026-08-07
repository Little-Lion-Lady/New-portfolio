"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

// Figma "Header" component. Responsive grid: 4 cols (mobile) / 8 (tablet) / 12 (desktop),
// gap-lg, bg gradient bg-primary → transparent. Text B-3xs (mobile/tablet) → B-2xs (desktop).
// Mobile: name + one nav + toggle. Tablet/desktop: name + role + two nav + toggle.
// Padding per Figma: mobile px-md/pt-xs/pb-2xl · tablet+desktop pt-lg/pb-3xl · px 3xl→5xl.
// Progressive blur: 4 stacked backdrop-filter layers with gradient masks — strongest at top,
// fades to zero at the bottom edge. Background gradient paints above the blur layers.
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isAbout = pathname === "/about";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 overflow-hidden px-md pt-md pb-lg md:px-xl md:pt-lg md:pb-xl lg:px-5xl lg:pb-2xl">
      {/* Progressive blur — full-height layers stacked in place (NOT flex/margin overlap:
          percentage margins resolve against width, which collapses on a short header).
          Cumulative model: every layer is solid black at the very top and only differs in
          how far down it fades to transparent. Stronger blur fades out higher, weaker blur
          reaches further down. Since backdrop-filters compound, the top gets every layer
          (max blur) and layers drop out one-by-one going down, so the total blur decays as
          one smooth ramp — no triangular peaks, no bands — to 0 at the bottom edge. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 transition-opacity duration-300" style={{ opacity: scrolled ? 1 : 0 }}>
        {[
          { blur: 1,   mask: "black 0%, black 40%, transparent 100%" },
          { blur: 2,   mask: "black 0%, black 33%, transparent 85%" },
          { blur: 4,   mask: "black 0%, black 26%, transparent 70%" },
          { blur: 7.5, mask: "black 0%, black 19%, transparent 55%" },
          { blur: 14,  mask: "black 0%, black 12%, transparent 42%" },
          { blur: 30,  mask: "black 0%, black 6%,  transparent 30%" },
        ].map(({ blur, mask }) => (
          <div
            key={blur}
            className="absolute inset-0"
            style={{
              backdropFilter: `blur(${blur}px)`,
              WebkitBackdropFilter: `blur(${blur}px)`,
              maskImage: `linear-gradient(to bottom, ${mask})`,
              WebkitMaskImage: `linear-gradient(to bottom, ${mask})`,
            }}
          />
        ))}
      </div>
      {/* Background gradient painted above blur layers */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{ background: "linear-gradient(to bottom, var(--bg-primary) 0%, var(--bg-transparency) 100%)", opacity: scrolled ? 1 : 0 }}
      />
      <nav className="relative grid grid-cols-4 items-center gap-lg md:grid-cols-8 lg:grid-cols-12">
        <Link href="/" className="col-start-1 col-span-2 b-3xs text-text-primary transition-colors hover:text-text-primary-hover md:col-span-2 lg:col-span-2 lg:b-2xs">
          Maryna Babych
        </Link>
        <p className="hidden whitespace-nowrap b-3xs text-text-primary md:col-start-3 md:col-span-2 md:block lg:col-start-3 lg:b-2xs">
          Lead Product Designer
        </p>
        {isAbout && (
          <Link
            href="/#work"
            className="hidden b-3xs text-text-primary transition-colors hover:text-text-primary-hover lg:col-start-10 lg:block lg:justify-self-start lg:b-2xs"
          >
            Work
          </Link>
        )}
        {!isAbout && (
          <Link
            href="/about"
            className="col-start-3 justify-self-end b-3xs text-text-primary transition-colors hover:text-text-primary-hover md:col-start-7 md:justify-self-start lg:col-start-11 lg:b-2xs"
          >
            About
          </Link>
        )}
        <ThemeToggle className="col-start-4 justify-self-end md:col-start-8 lg:col-start-12" />
      </nav>
    </header>
  );
}
