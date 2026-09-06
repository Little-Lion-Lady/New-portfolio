"use client";

/*
  SectionReveal + context (shared dependency for Reveal / ScrambleText).
  ─────────────────────────────────────────────────────────────────────
  A scroll-trigger by default: it watches its own position and, on first
  intersection, flips a context flag to `true`. Children (Reveal, ScrambleText,
  images) stay hidden until the section releases them.

  - IntersectionObserver at threshold 0.05 with a 10% bottom root margin,
    fire-once (disconnects after).
  - `delay` waits N ms after intersection; `notBefore` gates on an absolute
    Date.now() timestamp (for staggering sibling sections).
  - `hold` suspends the trigger entirely: no observer, no activation, until it
    goes false. It exists for `notBefore` values that have to be MEASURED
    before they can be known — a section timed off the home hero cannot know
    when the hero lands until the headline reports its wrap. Without it such a
    section fires on its first in-view frame with no timestamp to wait for, and
    `active` is one-way, so the gate it was given never applies. Mirrors
    Reveal's prop of the same name.
  - `immediate`: skip the observer entirely and release children on mount, and
    tell child Reveals (via context) to ignore their own in-view gate. Used on
    pages that should reveal all content at once on load (About, case studies)
    rather than progressively on scroll.
  - Reduced motion: activate immediately on mount.
  - SSR-safe: `active` starts false, so server HTML and first client paint match.
*/

import { useReducedMotion } from "framer-motion";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

type SectionRevealState = { active: boolean; immediate: boolean };

const SectionRevealContext = createContext<SectionRevealState>({
  active: true,
  immediate: false,
});

export function useSectionReveal() {
  return useContext(SectionRevealContext);
}

type Tag = "section" | "div" | "footer";

export function SectionReveal({
  children,
  delay = 0,
  notBefore,
  hold = false,
  immediate = false,
  as = "section",
  className,
  style,
  id,
}: {
  children: ReactNode;
  delay?: number;
  notBefore?: number;
  hold?: boolean;
  immediate?: boolean;
  as?: Tag;
  className?: string;
  style?: CSSProperties;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    let timeoutId: number | undefined;

    // Immediate (or reduced motion): release on mount, no scroll gating.
    if (immediate || reducedMotion) {
      timeoutId = window.setTimeout(() => setActive(true), 0);
      return () => clearTimeout(timeoutId);
    }

    // Held: the caller is still working out the timestamp to gate on. Attach
    // nothing and activate nothing — the effect re-runs when this goes false.
    // Deliberately below the branch above: reduced motion still releases at
    // once, since holding it would be a delay with no animation to justify it.
    if (hold) return;

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          const wait = (notBefore ? Math.max(0, notBefore - Date.now()) : 0) + delay;
          timeoutId = window.setTimeout(() => setActive(true), wait) as number;
          observer.disconnect();
        }
      },
      // Matches the gate in <Reveal>: a low threshold plus a positive bottom
      // root margin releases the section just before it scrolls into view, so
      // its children are already moving by the time they are on screen.
      { threshold: 0.05, rootMargin: "0px 0px 10% 0px" },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, [delay, notBefore, hold, reducedMotion, immediate]);

  const Tag = as;
  const contextValue = useMemo(() => ({ active, immediate }), [active, immediate]);

  return (
    <SectionRevealContext.Provider value={contextValue}>
      <Tag ref={ref as unknown as React.RefObject<never>} className={className} style={style} id={id}>
        {children}
      </Tag>
    </SectionRevealContext.Provider>
  );
}
