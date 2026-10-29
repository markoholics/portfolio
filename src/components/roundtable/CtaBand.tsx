"use client";

import Reveal from "@/components/Reveal";
import { CTA_BAND_COPY } from "@/content/roundtable";
import { CONTACT_EMAIL } from "@/lib/data";

export default function CtaBand() {
  return (
    <section style={{ background: "var(--color-accent)" }}>
      <div className="container-edge py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <Reveal>
              <h2 className="font-display text-black text-3xl md:text-5xl leading-tight mb-4">
                {CTA_BAND_COPY.heading}
              </h2>
              <p className="text-black/80 text-lg mb-8 max-w-xl">{CTA_BAND_COPY.sub}</p>
              <a
                href="#interest"
                data-cursor-hover
                className="inline-flex items-center justify-center gap-2 bg-black text-white px-8 py-4 text-sm uppercase tracking-[0.14em] hover:bg-black/80 transition-colors"
              >
                {CTA_BAND_COPY.scrollButton}
              </a>
            </Reveal>
          </div>

          <div className="lg:col-span-5 lg:text-right">
            <Reveal delay={0.1}>
              <span className="block text-black/70 text-xs uppercase tracking-[0.18em] mb-3">
                {CTA_BAND_COPY.getInTouchLabel}
              </span>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                data-cursor-hover
                className="block text-black font-display text-2xl md:text-3xl font-medium underline underline-offset-4 decoration-2 break-all"
              >
                {CONTACT_EMAIL}
              </a>
              <span className="block text-black/80 text-sm mt-3">{CTA_BAND_COPY.socialLine}</span>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
