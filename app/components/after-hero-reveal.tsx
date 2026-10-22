"use client";

/*
  AfterHeroReveal
  ───────────────
  A SectionReveal for the first section under the home hero: it reveals on
  scroll like any other, but never before the hero has finished arriving.

  It exists because the hero no longer fills the viewport. At a 600px cap on a
  ~870px screen the top of "Selected works" is on screen at load, so its own
  in-view trigger fires on the first frame and its cascade runs underneath the
  headline's — two unrelated reveals competing for the same second, which reads
  as the page arriving in pieces rather than in order.

  The moment to wait for cannot be written down, for the same reason HeroClose
  derives its delay rather than hard-coding one: the headline fits its type at
  runtime and the browser decides the wrap, so the hero lands at 1.4s on a wide
  screen and past 2.4s on a phone. So this asks the headline. useHeadlineHandoff
  returns when the copy READS as arrived — the point HeroClose starts on — and
  one HERO_CLOSE_DURATION past that is the divider and cat fully settled, i.e.
  the last thing in the hero to stop moving.

  Two things make the plumbing more than a delay:

  - `notBefore` is an absolute timestamp, while the handoff is seconds from the
    start of the reveal timeline. Both this and the hero mount on the same
    client pass, so this component's own mount is that origin. Captured once,
    never recomputed, or a re-render would push the deadline forward. Held in
    a lazy useState initializer rather than a ref: the value is read during
    render to build `notBefore`, and render may neither call an impure
    function like Date.now() nor depend on a ref's contents. The initializer
    is the sanctioned place for a one-time capture like this.

  - The answer is null for the first frames, and SectionReveal's `active` is
    one-way. Releasing the section before the handoff resolves would be
    permanent, so it `hold`s until there is a real timestamp to gate on rather
    than gating on `undefined`. The hold is short — the headline publishes its
    wrap as soon as it has fitted — and useHeadlineHandoff's own timeout means
    a headline that never reports still answers, so this cannot stall forever.

  Only for a page whose hero is a line-grouped <h1>. Anywhere else the hook
  finds no headline and falls back on its timer, which is a pause with nothing
  to justify it — use SectionReveal directly there.
*/

import type { CSSProperties, ReactNode } from "react";
import { useState } from "react";
import { SectionReveal } from "./section-reveal-context";
import { useHeadlineHandoff } from "./word-sync";
import { useIntroLiftedAt } from "./use-intro";
import { HERO_CLOSE_DURATION } from "./motion-timing";

export function AfterHeroReveal({
  children,
  delay = 0,
  revealDelay = 0,
  as = "section",
  className,
  style,
  id,
}: {
  children: ReactNode;
  /** Extra wait after the gate opens, as on SectionReveal. */
  delay?: number;
  /** The hero headline's own reveal delay, so this shares its timeline. */
  revealDelay?: number;
  as?: "section" | "div" | "footer";
  className?: string;
  style?: CSSProperties;
  id?: string;
}) {
  const handoff = useHeadlineHandoff({ revealDelay });
  const [mountedAt] = useState(() => Date.now());
  // The hero's timeline starts when the intro loader lifts, if there was one.
  const liftedAt = useIntroLiftedAt();
  const origin = liftedAt === null ? null : Math.max(mountedAt, liftedAt);

  const notBefore =
    handoff === null || origin === null
      ? undefined
      : origin + (handoff + HERO_CLOSE_DURATION) * 1000;

  return (
    <SectionReveal
      as={as}
      delay={delay}
      notBefore={notBefore}
      hold={notBefore === undefined}
      className={className}
      style={style}
      id={id}
    >
      {children}
    </SectionReveal>
  );
}
