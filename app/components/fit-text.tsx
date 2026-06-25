"use client";

import { useEffect, useRef, useState } from "react";

const BASE_SIZE = 100;

export function FitText({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);
  // fontSize state keeps React re-renders correct; direct DOM write handles
  // the case where state value doesn't change (React bails out) but the DOM
  // was temporarily mutated during measurement.
  const [fontSize, setFontSize] = useState<number>(BASE_SIZE);

  useEffect(() => {
    const span = spanRef.current;
    const container = containerRef.current;
    if (!span || !container) return;

    let raf = 0;
    const fit = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        // Switch to inline-block so getBoundingClientRect gives the text's
        // intrinsic width — display:block always fills the container width.
        span.style.display = "inline-block";
        span.style.fontSize = `${BASE_SIZE}px`;
        const naturalWidth = span.getBoundingClientRect().width;

        // Restore immediately so the span is never visibly at 100px.
        span.style.display = "block";

        if (!naturalWidth) return;

        const rect = container.getBoundingClientRect();
        const paddingLeft = parseFloat(getComputedStyle(container).paddingLeft) || 0;
        const textStart = rect.left + paddingLeft;
        // Fill to the footer's right edge (which clips at main's padding boundary),
        // not clientWidth (which would overshoot by main's right padding).
        const footer = container.closest("footer");
        const clipRight = footer
          ? footer.getBoundingClientRect().right
          : document.documentElement.clientWidth;
        const available = (clipRight - textStart) * 0.985;
        const newSize = (available / naturalWidth) * BASE_SIZE;

        // Write directly so the DOM is always correct even when React bails
        // out because newSize matches the current state value.
        span.style.fontSize = `${newSize}px`;
        setFontSize(newSize);
      });
    };

    fit();
    document.fonts.ready.then(fit);
    // Use window resize — ResizeObserver on the container fires on height
    // changes too, which creates a feedback loop when font size changes.
    window.addEventListener("resize", fit, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", fit);
    };
  }, [children]);

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
