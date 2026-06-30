"use client";

import { useState } from "react";
import Link from "next/link";
import { caseStudies, services } from "@/lib/data";
import Reveal from "@/components/Reveal";

export default function WorkGrid() {
  const [filter, setFilter] = useState<string>("all");

  const filtered =
    filter === "all"
      ? caseStudies
      : caseStudies.filter((cs) => cs.servicesUsed.includes(filter as never));

  return (
    <>
      <section className="container-edge pb-16 flex flex-wrap gap-3 border-y hairline py-8">
        <button
          onClick={() => setFilter("all")}
          data-cursor-hover
          className={`eyebrow px-4 py-2 border transition-colors ${
            filter === "all" ? "border-white text-white" : "hairline text-grey"
          }`}
        >
          All
        </button>
        {services.map((s) => (
          <button
            key={s.slug}
            onClick={() => setFilter(s.slug)}
            data-cursor-hover
            className={`eyebrow px-4 py-2 border transition-colors ${
              filter === s.slug ? "border-white text-white" : "hairline text-grey"
            }`}
          >
            {s.name}
          </button>
        ))}
      </section>

      <section className="section-pad pt-16">
        <div className="container-edge grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filtered.map((cs, i) => (
            <Reveal key={cs.slug} delay={i * 0.08}>
              <Link
                href={`/work/${cs.slug}`}
                data-cursor-hover
                className="group block border hairline overflow-hidden"
              >
                <div className="relative bg-charcoal/30 aspect-[4/3] flex flex-col justify-end">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(217,217,217,0.1),transparent_55%)] group-hover:opacity-80 transition-opacity duration-500" />
                  <div className="relative z-10 p-8">
                    <span className="eyebrow block mb-4">{cs.sector}</span>
                    <h2 className="font-display text-3xl text-white mb-3">
                      {cs.name}
                    </h2>
                    <p className="text-grey">{cs.oneLiner}</p>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
