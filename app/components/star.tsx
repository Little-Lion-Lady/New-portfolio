import { AnimatedSvg } from "./animated-svg";
import { stars } from "./animations";

export function Star({
  variant = 1,
  className,
}: {
  variant?: 1 | 2 | 3 | 4;
  className?: string;
}) {
  return (
    <AnimatedSvg
      markup={stars[variant - 1]}
      className={className}
      style={{ aspectRatio: "1/1", height: "auto" }}
    />
  );
}
