"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { services } from "@/lib/data";
import Reveal from "@/components/Reveal";

export default function ServicesSection() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section className="section-pad bg-black">
      <div className="container-edge">
        <div className="grid-12 mb-16">
          <div className="col-span-12 lg:col-span-5">
            <Reveal>
              <span className="eyebrow block mb-6">What We Run</span>
              <h2 className="text-white font-display text-4xl md:text-5xl lg:text-6xl leading-tight">
                Five disciplines.
                <br />
                One growth motion.
              </h2>
            </Reveal>
          </div>
          <div className="col-span-12 lg:col-span-5 lg:col-start-8 flex items-end">
            <Reveal delay={0.15}>
              <p className="text-grey text-lg">
                We don&apos;t hand you off between specialists. The same team
                that sets strategy runs the channels — so nothing gets lost in
                translation between the plan and the execution.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="border-t hairline">
          {services.map((service, i) => {
            const isOpen = active === service.slug;
            return (
              <Reveal key={service.slug} delay={i * 0.05}>
                <div
                  className="border-b hairline cursor-pointer"
                  onClick={() => setActive(isOpen ? null : service.slug)}
                  data-cursor-hover
                >
                  <div className="grid-12 items-center py-8 md:py-10">
                    <span className="col-span-2 md:col-span-1 text-grey font-display text-xl">
                      {service.index}
                    </span>
                    <h3 className="col-span-10 md:col-span-5 text-white font-display text-2xl md:text-3xl">
                      {service.name}
                    </h3>
                    <p className="hidden md:block md:col-span-5 text-grey">
                      {service.short}
                    </p>
                    <span
                      className={`hidden md:flex md:col-span-1 justify-end text-2xl text-white transition-transform duration-300 ${
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
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="grid-12 pb-10">
                          <div className="col-span-12 md:col-span-5 md:col-start-3">
                            <p className="text-grey mb-6 md:hidden">
                              {service.short}
                            </p>
                            <span className="eyebrow block mb-4">
                              What&apos;s Included
                            </span>
                            <ul className="space-y-2">
                              {service.included.map((item) => (
                                <li
                                  key={item}
                                  className="text-mist flex items-start gap-3"
                                >
                                  <span className="text-grey mt-1.5 w-1 h-1 rounded-full bg-grey shrink-0" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="col-span-12 md:col-span-4 mt-6 md:mt-0">
                            <Link
                              href={`/services#${service.slug}`}
                              data-cursor-hover
                              className="btn-outline"
                            >
                              Explore {service.name.split(" ")[0]}
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
