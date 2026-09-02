"use client";

/*
  HeroClose
  ─────────
  The last beat of the home hero — the divider and the cat — timed to start the
  moment the headline above reads as arrived.

  The delay is derived rather than written down, because the headline's length
  is not a fixed quantity: its type is fitted to its box at runtime and the
  browser decides where the copy wraps, so it runs five lines on a desktop and
  twelve on a phone. Every hand-tuned number here has been wrong at some width.
  useHeadlineHandoff reads the count the headline actually measured and returns
  the handover point; until it has one this holds, so the cat cannot start on a
  placeholder delay and then jump when the real one arrives.

  noSafetyFloor: the Divider carries a backdrop-blur, and an element running
  the floor's filter/transform animation becomes a backdrop root, which empties
  it out. That makes the hold above load-bearing — useHeadlineHandoff falls
  back on a timer rather than waiting indefinitely, precisely because nothing
  else would ever reveal this.
*/

import type { ReactNode } from "react";
import { Reveal } from "./reveal";
import { useHeadlineHandoff } from "./word-sync";

export function HeroClose({
  children,
  className,
  revealDelay = 0,
}: {
  children: ReactNode;
  className?: string;
  /** The headline's own reveal delay, so this shares its timeline. */
  revealDelay?: number;
}) {
  const delay = useHeadlineHandoff({ revealDelay });

  return (
    <Reveal as="div" delay={delay ?? 0} hold={delay === null} noY noSafetyFloor className={className}>
      {children}
    </Reveal>
  );
}
