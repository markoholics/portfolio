"use client";

import Reveal from "@/components/Reveal";
import { MODERATOR_COPY } from "@/content/roundtable";

export default function Moderator() {
  return (
    <section className="section-pad bg-black border-t hairline">
      <div className="container-edge grid-12">
        <div className="col-span-12 lg:col-span-5">
          <Reveal>
            <span className="eyebrow block mb-6" style={{ color: "var(--color-accent)" }}>
              {MODERATOR_COPY.eyebrow}
            </span>
            <h2 className="font-display text-white text-4xl md:text-5xl leading-tight">
              {MODERATOR_COPY.nameLine1}
            </h2>
            <h2
              className="font-display text-4xl md:text-5xl leading-tight"
              style={{ color: "var(--color-accent)" }}
            >
              {MODERATOR_COPY.nameLine2}
            </h2>
          </Reveal>
        </div>

        <div className="col-span-12 lg:col-span-6 lg:col-start-7 mt-10 lg:mt-0">
          <Reveal delay={0.1}>
            <p className="text-white text-lg mb-5">{MODERATOR_COPY.role}</p>
            <p className="text-grey text-lg leading-relaxed">{MODERATOR_COPY.bio}</p>
          </Reveal>
        </div>
      </div>

      <div className="container-edge mt-16">
        <Reveal delay={0.15}>
          <span className="eyebrow block mb-8 text-grey">{MODERATOR_COPY.audienceReachLabel}</span>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6 border-t hairline pt-10">
            {MODERATOR_COPY.reach.map((item) => {
              const tile = (
                <>
                  <span className="font-display text-3xl md:text-4xl text-white block mb-2">
                    {item.value}
                  </span>
                  <span className="text-grey text-sm block">
                    {item.platform} {item.suffix}
                  </span>
                </>
              );
              if (!item.href) {
                return (
                  <div key={item.platform}>{tile}</div>
                );
              }
              return (
                <a
                  key={item.platform}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor-hover
                  className="block hover:opacity-80 transition-opacity"
                >
                  {tile}
                </a>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="text-grey text-sm mt-8 max-w-2xl">
            <strong className="text-white font-medium">{MODERATOR_COPY.reachFootnoteBold}</strong>
            {MODERATOR_COPY.reachFootnoteRest}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
