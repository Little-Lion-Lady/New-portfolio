import { AnimatedSvg } from "./animated-svg";
import { aboutCat } from "./animations";

/*
  The Backstory cat.

  This used to hold its Lottie mount back until the section scrolled into
  view, to avoid paying the player's init cost on initial page load. There is
  no player and no init cost any more, so the gate is gone and this renders as
  static HTML like the others.

  What the gate also did, incidentally, was keep the animation from running
  while off screen. A CSS animation on a 38KB drawing is far cheaper than a
  Lottie rAF loop, and browsers throttle off-screen composited animations, so
  that is not being paid for in the same way — but it is a real change, and
  the same question the marquees raise (they animate off screen too).
*/
export function AboutCat({ className }: { className?: string }) {
  return (
    <div className={className}>
      <AnimatedSvg markup={aboutCat} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
