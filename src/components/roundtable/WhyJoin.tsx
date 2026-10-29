"use client";

import Reveal from "@/components/Reveal";
import { WHY_JOIN_COPY } from "@/content/roundtable";

export default function WhyJoin() {
  return (
    <section className="section-pad bg-black border-t hairline">
      <div className="container-edge">
        <Reveal>
          <div className="border hairline p-8 md:p-12">
            <span className="eyebrow block mb-10" style={{ color: "var(--color-accent)" }}>
              {WHY_JOIN_COPY.eyebrow}
            </span>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
              {WHY_JOIN_COPY.items.map((item, i) => (
                <Reveal key={item} delay={i * 0.08}>
                  <li className="flex items-start gap-4 text-white text-lg leading-snug">
                    <span
                      className="mt-2.5 w-2 h-2 shrink-0"
                      style={{ background: "var(--color-accent)" }}
                    />
                    {item}
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
