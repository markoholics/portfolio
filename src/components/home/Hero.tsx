"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import MagneticButton from "@/components/MagneticButton";
import AbstractField from "@/components/AbstractField";
import TextReveal from "@/components/TextReveal";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-end overflow-hidden bg-black"
    >
      <motion.div style={{ y: bgY }} className="absolute inset-0">
        <AbstractField />
      </motion.div>

      <motion.div
        style={{ y: textY, opacity }}
        className="container-edge relative z-10 pb-24 pt-40 w-full"
      >
        <div className="eyebrow mb-8 overflow-hidden">
          <motion.span
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block"
          >
            GTM &amp; Growth Strategy for Tech Founders
          </motion.span>
        </div>

        <h1 className="text-white font-display font-medium leading-[0.95] tracking-tight text-[14vw] sm:text-[10vw] lg:text-[6.5vw] max-w-6xl">
          <TextReveal text="We build the growth engines behind tech's most ambitious founders." />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="text-grey text-lg md:text-xl max-w-xl mt-10"
        >
          GTM strategy, content, social, performance, demand generation, and
          AI transformation: six disciplines run as a single growth motion
          for founders building what comes next.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="flex flex-wrap gap-4 mt-12"
        >
          <MagneticButton href="/contact" variant="solid">
            Book a Strategy Call
          </MagneticButton>
          <MagneticButton href="/work" variant="outline">
            See the Work
          </MagneticButton>
        </motion.div>
      </motion.div>
    </section>
  );
}
