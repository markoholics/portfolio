"use client";

import Reveal from "@/components/Reveal";
import AnimatedCounter from "@/components/AnimatedCounter";
import { ABOUT_COPY } from "@/content/roundtable";

export default function About() {
  return (
    <section className="section-pad bg-black border-t hairline">
      <div className="container-edge">
        <Reveal>
          <div className="border hairline p-8 md:p-12">
            <span className="eyebrow block mb-6" style={{ color: "var(--color-accent)" }}>
              {ABOUT_COPY.eyebrow}
            </span>
            <h2 className="font-display text-white text-3xl md:text-4xl leading-tight mb-12 max-w-2xl">
              {ABOUT_COPY.statement}
            </h2>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6">
              {ABOUT_COPY.metrics.map((metric, i) => (
                <Reveal key={metric.label} delay={i * 0.1}>
                  <div>
                    <div
                      className="font-display text-4xl md:text-6xl mb-3"
                      style={{ color: "var(--color-accent)" }}
                    >
                      <AnimatedCounter value={metric.value} prefix={metric.prefix} suffix={metric.suffix} />
                    </div>
                    <p className="text-grey text-xs uppercase tracking-[0.12em] leading-snug">
                      {metric.label}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>

            <p className="text-grey/60 text-xs mt-8">{ABOUT_COPY.disclosure}</p>

            <div className="mt-12 pt-8 border-t hairline">
              <span className="text-grey text-xs uppercase tracking-[0.12em] block mb-5">
                {ABOUT_COPY.partnersLabel}
              </span>
              <div className="flex flex-wrap gap-3">
                {ABOUT_COPY.partners.map((partner) => (
                  <span
                    key={partner}
                    className="text-mist text-sm border hairline px-4 py-2"
                  >
                    {partner}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
