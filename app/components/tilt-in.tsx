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

import { useRef, type ReactNode } from "react";
import { m, useInView, useReducedMotion } from "framer-motion";
import { useSectionReveal } from "./section-reveal-context";
import { useIntroLiftedAt } from "./use-intro";
import { useHasMounted, useRevealTrigger, DURATION, EASE, IN_VIEW } from "./reveal";

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
  const inView = useInView(ref, IN_VIEW);
  const reducedMotion = useReducedMotion();
  const { active, immediate: ctxImmediate } = useSectionReveal();
  const parent = useRevealTrigger();
  const isImmediate = immediate || ctxImmediate;
  const mounted = useHasMounted();
  // Inside a Reveal: same trigger, same delay as the fade. Otherwise fall back
  // to this element's own in-view gate.
  const introDone = useIntroLiftedAt() !== null;
  const shouldAnimate = parent ? parent.active : introDone && (isImmediate ? mounted : active && inView);
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
      transition={{ duration: DURATION, ease: EASE, delay: startDelay }}
    >
      {children}
    </m.div>
  );
}
