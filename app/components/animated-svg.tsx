import type { CSSProperties } from "react";

/*
  Renders one of the generated animations from ./animations.

  A Server Component with no state and no effects, so the drawing ships as
  static HTML and costs nothing to hydrate. That is the point of the exercise:
  these used to be `next/dynamic({ ssr: false })` Lottie mounts, which meant a
  170KB player, a client bundle, and nothing on screen until React had booted.

  The markup is injected rather than parsed into JSX because it IS markup —
  generated, checked in, and reviewed as a diff. It contains no interpolated
  or user-supplied content of any kind; see scripts/generate-animations.mjs.
*/
export function AnimatedSvg({
  markup,
  className,
  style,
}: {
  markup: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={className ? `animated-svg ${className}` : "animated-svg"}
      style={style}
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}
