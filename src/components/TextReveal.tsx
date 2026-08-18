"use client";

import { motion } from "framer-motion";

export default function TextReveal({
  text,
  className = "",
  delay = 0,
  stagger = 0.06,
  as: Tag = "span",
  triggerOnView = false,
  priority = false,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: "span" | "h1" | "h2" | "h3";
  triggerOnView?: boolean;
  /**
   * CSS-only reveal that starts on paint instead of waiting for framer-motion
   * to hydrate. Use for above-the-fold headings (LCP candidates) so mobile
   * doesn't pay a JS-hydration tax before the largest content paints.
   */
  priority?: boolean;
}) {
  const words = text.split(" ");

  // The per-word spans below are laid out with CSS margin instead of a real
  // space character (so the reveal clip-mask can wrap each word tightly).
  // That means their raw text content is one run-on word with no
  // whitespace — invisible to sighted users, but it garbles screen readers
  // and breaks phrase-level text extraction (crawlers, find-in-page,
  // copy-paste). We hide the animated spans from assistive tech / text
  // extraction and provide the real, correctly-spaced string alongside it.

  if (priority) {
    return (
      <Tag className={className}>
        <span className="sr-only">{text}</span>
        <span aria-hidden="true">
          {words.map((word, i) => (
            <span
              key={`${word}-${i}`}
              className="inline-block overflow-hidden align-bottom pb-[0.08em] mr-[0.28em]"
            >
              <span
                className="inline-block animate-text-reveal"
                style={{ animationDelay: `${delay + i * stagger}s` }}
              >
                {word}
              </span>
            </span>
          ))}
        </span>
      </Tag>
    );
  }

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
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
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
      </span>
    </Tag>
  );
}
