"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function ProgressBar({ current, total }: { current: number; total: number }) {
  const reduceMotion = useReducedMotion();
  const percent = Math.round((current / total) * 100);

  return (
    <div
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-label={`Question ${current} of ${total}`}
      className="h-1 w-full bg-white/10 overflow-hidden"
    >
      <motion.div
        className="h-full bg-white"
        initial={false}
        animate={{ width: `${percent}%` }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}
