import { AnimatedSvg } from "./animated-svg";
import { meCat } from "./animations";

export function MeCat({ className, fit = false }: { className?: string; fit?: boolean }) {
  return (
    <div className={className}>
      {/*
        `fit` fills the parent box in BOTH axes instead of deriving height from
        the artwork's own ratio. The SVG keeps its viewBox and a default
        preserveAspectRatio of xMidYMid meet, so it scales down to be
        CONTAINED by that box — which lets a caller cap the height and know the
        cat can never outgrow the frame it sits in, exactly as before.
      */}
      <AnimatedSvg
        markup={meCat}
        style={fit ? { width: "100%", height: "100%" } : { width: "100%", height: "auto" }}
      />
    </div>
  );
}
