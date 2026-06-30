"use client";

import { motion } from "framer-motion";
import MagneticButton from "@/components/MagneticButton";
import AbstractField from "@/components/AbstractField";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-end overflow-hidden bg-black">
      <AbstractField />

      <div className="container-edge relative z-10 pb-24 pt-40 w-full">
        <div className="eyebrow mb-8">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            GTM &amp; Growth Strategy for Technology Companies
          </motion.span>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-white font-display font-medium leading-[0.95] tracking-tight text-[14vw] sm:text-[10vw] lg:text-[6.5vw] max-w-6xl"
        >
          We build the growth engines behind tech&apos;s most ambitious companies.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-grey text-lg md:text-xl max-w-xl mt-10"
        >
          GTM strategy, content, social, performance, and demand generation —
          five disciplines run as a single growth motion.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-wrap gap-4 mt-12"
        >
          <MagneticButton href="/contact" variant="solid">
            Book a Strategy Call
          </MagneticButton>
          <MagneticButton href="/work" variant="outline">
            See the Work
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
