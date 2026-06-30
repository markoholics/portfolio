"use client";

import { motion } from "framer-motion";

export default function AbstractField({ className = "" }: { className?: string }) {
  const lines = Array.from({ length: 14 });

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(217,217,217,0.08),_transparent_60%)]" />
      <svg className="absolute inset-0 w-full h-full opacity-40" preserveAspectRatio="none">
        {lines.map((_, i) => (
          <motion.line
            key={i}
            x1="0"
            y1={`${(i / lines.length) * 100}%`}
            x2="100%"
            y2={`${((i + 3) / lines.length) * 100}%`}
            stroke="#D9D9D9"
            strokeWidth="0.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.05, 0.25, 0.05] }}
            transition={{
              duration: 6 + (i % 5),
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.9))]" />
    </div>
  );
}
