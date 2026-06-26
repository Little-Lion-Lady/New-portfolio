"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const INTERVAL = 2400;

export function CyclingWord({
  words,
  className,
}: {
  words: string[];
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), INTERVAL);
    return () => clearInterval(id);
  }, [words.length]);

  return (
    // No overflow-hidden — the mask-image clips overflow content too, so words
    // at y:±110% are hidden by the transparent gradient stops without a hard edge.
    // Blur lives on the child and is zero when the word is at rest, so there
    // is nothing to clip harshly at the left/right edges.
    <span
      className="inline-grid"
      style={{
        minWidth: `${Math.max(...words.map((w) => w.length))}ch`,
        lineHeight: "1.2em",
        paddingLeft: "24px",
        paddingTop: "1em",
        paddingBottom: "1em",
        marginLeft: "-24px",
        maskImage:
          "linear-gradient(to bottom, transparent 0px, black 1em, black calc(100% - 1em), transparent 100%)",
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={words[index]}
          className={`[grid-area:1/1] ${className ?? ""}`}
          initial={reduced ? { opacity: 0 } : { y: "40%", opacity: 0, filter: "blur(16px)" }}
          animate={reduced ? { opacity: 1 } : { y: "0%", opacity: 1, filter: "blur(0px)" }}
          exit={reduced ? { opacity: 0 } : { y: "-40%", opacity: 0, filter: "blur(16px)" }}
          transition={
            reduced
              ? { duration: 0.2 }
              : {
                  duration: 0.32,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  opacity: { duration: 0.18, ease: "linear" },
                }
          }
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
