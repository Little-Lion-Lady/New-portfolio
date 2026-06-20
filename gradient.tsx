/*
  Gradient
  ────────
  CSS-driven animated radial-blob background. Palette comes from a class
  modifier defined in globals.css, so the @property declarations and keyframes
  stay at root (required by spec).

    palette="red"  → default red/orange (home + 404 + about)
    palette="gold" → yellow/gold (Covid Tracer case study)

  flip = true mirrors the gradient vertically (footer use). blurPx is the
  feathered-edge blur applied via `filter`.
*/

type Palette = "red" | "gold";

export function Gradient({
  palette = "red",
  flip = false,
  blurPx = 25,
  className = "",
}: {
  palette?: Palette;
  flip?: boolean;
  blurPx?: number;
  className?: string;
}) {
  const paletteClass = palette === "gold" ? "hero-gradient-animated--gold" : "";
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 hero-gradient-animated ${paletteClass} ${flip ? "rotate-180" : ""} ${className}`}
      style={{ filter: `blur(${blurPx}px)` }}
    />
  );
}
