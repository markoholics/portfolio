"use client";

import { motion } from "framer-motion";

export default function TextReveal({
  text,
  className = "",
  delay = 0,
  stagger = 0.06,
  as: Tag = "span",
  triggerOnView = false,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: "span" | "h1" | "h2" | "h3";
  triggerOnView?: boolean;
}) {
  const words = text.split(" ");
  const animationProps = triggerOnView
    ? {
        initial: { y: "110%" },
        whileInView: { y: "0%" },
        viewport: { once: true, margin: "-80px" },
      }
    : {
        initial: { y: "110%" },
        animate: { y: "0%" },
      };

  return (
    <Tag className={className}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="inline-block overflow-hidden align-bottom pb-[0.08em] mr-[0.28em]"
        >
          <motion.span
            className="inline-block"
            {...animationProps}
            transition={{
              duration: 0.9,
              delay: delay + i * stagger,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
