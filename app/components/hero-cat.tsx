import { AnimatedSvg } from "./animated-svg";
import { heroCat } from "./animations";

/*
  The home hero's cat.

  Was a Lottie mount that remapped four colours in JavaScript on every theme
  change, behind `dynamic({ ssr: false })` so it could not render until React
  had hydrated. It is now a static SVG that animates itself in CSS: no player,
  no client component, no theme pass at runtime — the dark palette is a
  handful of custom properties in globals.css.

  Aspect ratio and height:auto are kept from the Lottie wrapper so the
  utilities the caller passes (max-h-full, w-auto, the negative margins that
  overlap the divider) go on behaving exactly as they did.
*/
export function HeroCat({ className }: { className?: string }) {
  return (
    <AnimatedSvg
      markup={heroCat}
      className={className}
      style={{ aspectRatio: "1632/818", height: "auto" }}
    />
  );
}
