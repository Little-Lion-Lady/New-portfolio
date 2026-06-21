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
import {
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
    if (reducedMotion) {
      setActive(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          const wait = (notBefore ? Math.max(0, notBefore - Date.now()) : 0) + delay;
          window.setTimeout(() => setActive(true), wait);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, notBefore, reducedMotion]);

  const Tag = as;

  return (
    <SectionRevealContext.Provider value={active}>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <Tag ref={ref as any} className={className} style={style} id={id}>
        {children}
      </Tag>
    </SectionRevealContext.Provider>
  );
}
