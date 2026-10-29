"use client";

import Reveal from "@/components/Reveal";
import { FORMATS_COPY } from "@/content/roundtable";

export default function Formats() {
  return (
    <section id="formats" className="section-pad bg-black border-t hairline scroll-mt-24">
      <div className="container-edge">
        <Reveal>
          <span className="eyebrow block mb-6" style={{ color: "var(--color-accent)" }}>
            Two formats
          </span>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-grey/10">
          {FORMATS_COPY.formats.map((format, i) => (
            <Reveal key={format.heading} delay={i * 0.1}>
              <div className="bg-black p-8 md:p-10 h-full flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <span className="eyebrow" style={{ color: "var(--color-accent)" }}>
                    {format.tag}
                  </span>
                  <span className="text-grey text-xs uppercase tracking-[0.12em]">
                    {format.rightLabel}
                  </span>
                </div>

                <h3 className="font-display text-white text-2xl md:text-3xl mb-3">
                  {format.heading}
                </h3>
                <span className="font-display text-4xl md:text-5xl text-white block mb-8">
                  {format.bigNumber}
                </span>

                <ul className="space-y-3 flex-1">
                  {format.points.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-sm text-mist">
                      <span
                        className="mt-2 w-1.5 h-1.5 shrink-0"
                        style={{ background: "var(--color-accent)" }}
                      />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3}>
          <p className="text-grey/60 text-xs text-center mt-8">{FORMATS_COPY.note}</p>
        </Reveal>
      </div>
    </section>
  );
}
