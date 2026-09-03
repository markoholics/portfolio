"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface Objection {
  q: string;
  a: string;
}

export default function ObjectionsAccordion({ items }: { items: Objection[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="border-t border-white/10">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q} className="border-b border-white/10">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-start justify-between gap-6 py-6 text-left"
            >
              <h3 className="font-display text-lg text-white sm:text-xl">{item.q}</h3>
              <span
                className={`mt-0.5 shrink-0 text-2xl text-[#01A6C8] transition-transform duration-300 ${
                  isOpen ? "rotate-45" : ""
                }`}
                aria-hidden="true"
              >
                +
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="pb-6 leading-relaxed text-white/70">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
