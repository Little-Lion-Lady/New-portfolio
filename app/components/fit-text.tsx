"use client";

import { useEffect, useRef, useState } from "react";

const BASE_SIZE = 100;

export function FitText({
  children,
  className,
  heightRatio = 1.0,
}: {
  children: string;
  className?: string;
  // When < 1.0, clips the container to this fraction of the natural line-box
  // height and bottom-aligns the text so the cap height rides to the top edge.
  heightRatio?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);
  const [fontSize, setFontSize] = useState<number>(BASE_SIZE);

  useEffect(() => {
    const span = spanRef.current;
    const container = containerRef.current;
    if (!span || !container) return;

    let raf = 0;
    const fit = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        span.style.display = "inline-block";
        span.style.fontSize = `${BASE_SIZE}px`;
        const naturalWidth = span.getBoundingClientRect().width;

        span.style.display = "block";

        if (!naturalWidth) return;

        const rect = container.getBoundingClientRect();
        const paddingLeft = parseFloat(getComputedStyle(container).paddingLeft) || 0;
        const textStart = rect.left + paddingLeft;
        const footer = container.closest("footer");
        const clipRight = footer
          ? footer.getBoundingClientRect().right
          : document.documentElement.clientWidth;
        const available = (clipRight - textStart) * 0.985;
        const newSize = (available / naturalWidth) * BASE_SIZE;

        span.style.fontSize = `${newSize}px`;

        if (heightRatio < 1.0) {
          // lineHeight is the computed px value (newSize × 1.15 from the parent class).
          const lineHeight = parseFloat(getComputedStyle(span).lineHeight);
          container.style.height = `${lineHeight * heightRatio}px`;
          container.style.overflow = "hidden";
          container.style.display = "flex";
          container.style.alignItems = "flex-end";
        }

        setFontSize(newSize);
      });
    };

    fit();
    document.fonts.ready.then(fit);
    window.addEventListener("resize", fit, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", fit);
    };
  }, [children, heightRatio]);

  return (
    <div ref={containerRef} className={className}>
      <span
        ref={spanRef}
        style={{ fontSize: `${fontSize}px`, display: "block", whiteSpace: "nowrap" }}
      >
        {children}
      </span>
    </div>
  );
}
