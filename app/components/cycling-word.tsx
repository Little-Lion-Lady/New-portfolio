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
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
    }, INTERVAL);
    return () => clearInterval(id);
  }, [words.length]);

  return (
    // overflow-hidden clips the entering/exiting words so they only show
    // inside the container height — gives the slot-machine illusion.
    <span
      className="inline-grid overflow-hidden"
      style={{
        minWidth: `${Math.max(...words.map((w) => w.length))}ch`,
        lineHeight: "1em",
        maskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={words[index]}
          className={`[grid-area:1/1] ${className ?? ""}`}
          initial={reduced ? { opacity: 0 } : { y: "110%", opacity: 0, filter: "blur(6px)" }}
          animate={reduced ? { opacity: 1 } : { y: "0%", opacity: 1, filter: "blur(0px)" }}
          exit={reduced ? { opacity: 0 } : { y: "-110%", opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.22, ease: [0, 0, 0.2, 1] }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
