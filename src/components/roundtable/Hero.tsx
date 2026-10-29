"use client";

import Reveal from "@/components/Reveal";
import TextReveal from "@/components/TextReveal";
import MagneticButton from "@/components/MagneticButton";
import { HERO_COPY } from "@/content/roundtable";

export default function Hero() {
  return (
    <section className="relative bg-black overflow-hidden">
      <div className="container-edge relative z-10 pb-20 pt-40 w-full">
        <div className="eyebrow mb-8 overflow-hidden">
          <span className="inline-block" style={{ color: "var(--color-accent)" }}>
            {HERO_COPY.eyebrow}
          </span>
        </div>

        <h1 className="text-white font-display font-medium leading-[0.95] tracking-tight text-[12vw] sm:text-[8vw] lg:text-[5.5vw] max-w-5xl">
          <TextReveal text={HERO_COPY.headingPlain} priority />
          <span style={{ color: "var(--color-accent)" }}>
            <TextReveal
              text={HERO_COPY.headingAccent}
              priority
              delay={HERO_COPY.headingPlain.trim().split(" ").length * 0.06}
            />
          </span>
        </h1>

        <Reveal delay={0.3}>
          <p className="text-grey text-lg md:text-xl max-w-2xl mt-8 leading-relaxed">
            {HERO_COPY.lead}
          </p>
        </Reveal>

        <Reveal delay={0.4}>
          <div className="flex flex-wrap items-center gap-6 mt-12">
            <MagneticButton href="#interest" variant="solid">
              {HERO_COPY.primaryButton}
            </MagneticButton>
            <a
              href="#formats"
              data-cursor-hover
              className="text-mist hover:text-white underline underline-offset-4 transition-colors"
            >
              {HERO_COPY.secondaryLink}
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.5}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-20 border-t hairline pt-10">
            {HERO_COPY.statStrip.map((stat) => (
              <div key={stat.label}>
                <span className="font-display text-3xl md:text-4xl text-white block mb-2">
                  {stat.value}
                </span>
                <span className="text-grey text-sm leading-snug block">{stat.label}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
