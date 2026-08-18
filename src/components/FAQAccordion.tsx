"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { FAQItem } from "@/lib/data";
import Reveal from "@/components/Reveal";
import TextReveal from "@/components/TextReveal";

export default function FAQAccordion({
  items,
  eyebrow = "Common Questions",
  heading = "Before you book.",
}: {
  items: FAQItem[];
  eyebrow?: string;
  heading?: string;
}) {
  const [open, setOpen] = useState<number | null>(null);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <section className="section-pad bg-black border-t hairline">
      <div className="container-edge">
        <div className="grid-12 mb-16">
          <div className="col-span-12 lg:col-span-5">
            <Reveal>
              <span className="eyebrow block mb-6">{eyebrow}</span>
              <h2 className="text-white font-display text-4xl md:text-5xl lg:text-6xl leading-tight">
                <TextReveal text={heading} triggerOnView />
              </h2>
            </Reveal>
          </div>
        </div>

        <div className="border-t hairline max-w-3xl">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={item.q} delay={i * 0.05}>
                <div
                  className="border-b hairline cursor-pointer"
                  onClick={() => setOpen(isOpen ? null : i)}
                  data-cursor-hover
                >
                  <div className="flex items-start justify-between gap-6 py-7">
                    <h3 className="text-white font-display text-lg md:text-xl leading-snug">
                      {item.q}
                    </h3>
                    <span
                      className={`text-grey text-2xl shrink-0 mt-0.5 transition-transform duration-300 ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    >
                      +
                    </span>
                  </div>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="text-grey pb-7 leading-relaxed">{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}
