"use client";

/*
  SectionReveal + context (shared dependency for Reveal / ScrambleText).
  ─────────────────────────────────────────────────────────────────────
  An invisible scroll-trigger. It never animates itself; it watches its own
  position and, on first intersection, flips a context flag to `true`. Children
  (Reveal, ScrambleText, images) stay hidden until the section releases them.

  - IntersectionObserver at threshold 0.15, fire-once (disconnects after).
  - `delay` waits N ms after intersection; `notBefore` gates on an absolute
    Date.now() timestamp (for staggering sibling sections).
  - Reduced motion: activate immediately on mount.
  - SSR-safe: `active` starts false, so server HTML and first client paint match.
*/

import { useReducedMotion } from "framer-motion";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

const SectionRevealContext = createContext<boolean>(true);

export function useSectionActive() {
  return useContext(SectionRevealContext);
}

type Tag = "section" | "div" | "footer";

export function SectionReveal({
  children,
  delay = 0,
  notBefore,
  as = "section",
  className,
  style,
  id,
}: {
  children: ReactNode;
  delay?: number;
  notBefore?: number;
  as?: Tag;
  className?: string;
  style?: CSSProperties;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    if (reducedMotion) {
      // Defer to avoid calling setState synchronously in the effect body.
      timeoutId = window.setTimeout(() => setActive(true), 0);
      return () => clearTimeout(timeoutId);
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          const wait = (notBefore ? Math.max(0, notBefore - Date.now()) : 0) + delay;
          timeoutId = window.setTimeout(() => setActive(true), wait);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, [delay, notBefore, reducedMotion]);

  const Tag = as;

  return (
    <SectionRevealContext.Provider value={active}>
      <Tag ref={ref as unknown as React.RefObject<HTMLElement>} className={className} style={style} id={id}>
        {children}
      </Tag>
    </SectionRevealContext.Provider>
  );
}
