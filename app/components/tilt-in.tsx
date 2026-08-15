"use client";

/*
  TiltIn
  ──────
  Reveal wrapper for the overlapping glass-frame image cards (WorkImage).
  Each card starts rotated away from its resting tilt and turns into place:
  cards left of the cluster's centre swing anti-clockwise, cards right of it
  swing clockwise. The resting tilt itself stays on the inner element as a
  Tailwind class (it's responsive), so this wrapper only animates the extra
  offset back to 0 and the two transforms compose.

  Trigger: when nested inside a <Reveal> (always, in practice), it fires on
  that Reveal's trigger and delay, so the rotation runs in step with the fade.
  Outside one it falls back to its own in-view observer. Reduced motion
  renders a plain div.
*/

import { useEffect, useRef, useState, type ReactNode } from "react";
import { m, useInView, useReducedMotion } from "framer-motion";
import { useSectionReveal } from "./section-reveal-context";
import { useRevealTrigger } from "./reveal";

export function TiltIn({
  offset,
  delay = 0,
  immediate = false,
  className,
  children,
}: {
  /** Extra degrees to start from; positive = starts clockwise of its resting tilt. */
  offset: number;
  delay?: number;
  immediate?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const reducedMotion = useReducedMotion();
  const { active, immediate: ctxImmediate } = useSectionReveal();
  const parent = useRevealTrigger();
  const isImmediate = immediate || ctxImmediate;
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (isImmediate) setMounted(true);
  }, [isImmediate]);
  // Inside a Reveal: same trigger, same delay as the fade. Otherwise fall back
  // to this element's own in-view gate.
  const shouldAnimate = parent ? parent.active : isImmediate ? mounted : active && inView;
  const startDelay = parent ? parent.delay : delay;

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <m.div
      ref={ref}
      className={className}
      initial={{ rotate: offset }}
      animate={{ rotate: shouldAnimate ? 0 : offset }}
      transition={{ duration: 0.6, ease: [0.175, 0.885, 0.32, 1.1], delay: startDelay }}
    >
      {children}
    </m.div>
  );
}
