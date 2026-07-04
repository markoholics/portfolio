"use client";

import { pricingTiers } from "@/lib/data";
import Reveal from "@/components/Reveal";
import TextReveal from "@/components/TextReveal";

export default function ServicesSection() {
  return (
    <section className="section-pad bg-black border-t hairline">
      <div className="container-edge">
        <div className="grid-12 mb-16">
          <div className="col-span-12 lg:col-span-5">
            <Reveal>
              <span className="eyebrow block mb-6">Productized Engagements</span>
              <h2 className="text-white font-display text-4xl md:text-5xl lg:text-6xl leading-tight">
                <TextReveal text="Three ways to" triggerOnView as="span" className="block" />
                <TextReveal text="work with us." triggerOnView as="span" className="block" delay={0.1} />
              </h2>
            </Reveal>
          </div>
          <div className="col-span-12 lg:col-span-5 lg:col-start-8 flex items-end">
            <Reveal delay={0.15}>
              <p className="text-grey text-lg">
                Starting at $3,500/month. All engagements are outcome-based,
                not time-based. We don&apos;t sell hours — we build systems
                that generate returns.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-grey/10">
          {pricingTiers.map((tier, i) => (
            <Reveal key={tier.name} delay={i * 0.1}>
              <div
                className={`relative flex flex-col h-full p-8 md:p-10 ${
                  tier.highlight ? "bg-white" : "bg-black"
                }`}
              >
                {tier.highlight && (
                  <span
                    className="absolute top-0 right-8 text-[0.6rem] uppercase tracking-[0.22em] px-3 py-1.5 font-medium"
                    style={{ background: "var(--color-accent)", color: "#000" }}
                  >
                    Most Popular
                  </span>
                )}

                <div className="mb-8">
                  <span
                    className={`font-display text-5xl block mb-6 ${
                      tier.highlight ? "text-black/30" : "text-grey/30"
                    }`}
                  >
                    {tier.index}
                  </span>
                  <h3
                    className={`font-display text-2xl md:text-3xl mb-2 ${
                      tier.highlight ? "text-black" : "text-white"
                    }`}
                  >
                    {tier.name}
                  </h3>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span
                      className={`font-display text-4xl md:text-5xl ${
                        tier.highlight ? "text-black" : "text-white"
                      }`}
                    >
                      {tier.price}
                    </span>
                    <span
                      className={`text-sm ${
                        tier.highlight ? "text-black/60" : "text-grey"
                      }`}
                    >
                      {tier.period}
                    </span>
                  </div>
                  <p
                    className={`text-sm leading-relaxed ${
                      tier.highlight ? "text-black/70" : "text-grey"
                    }`}
                  >
                    {tier.description}
                  </p>
                </div>

                <ul className="space-y-3 mb-10 flex-1">
                  {tier.deliverables.map((item) => (
                    <li
                      key={item}
                      className={`flex items-start gap-3 text-sm ${
                        tier.highlight ? "text-black/80" : "text-mist"
                      }`}
                    >
                      <span
                        className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                        style={{
                          background: tier.highlight
                            ? "#000"
                            : "var(--color-accent)",
                        }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>

                <a
                  href={tier.href}
                  target={tier.href.startsWith("http") ? "_blank" : undefined}
                  rel={tier.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  data-cursor-hover
                  className={`inline-flex items-center justify-center gap-2 px-6 py-4 text-[0.75rem] uppercase tracking-[0.18em] transition-all duration-300 ${
                    tier.highlight
                      ? "bg-black text-white hover:bg-black/80"
                      : "border hairline text-mist hover:bg-white hover:text-black hover:border-white"
                  }`}
                >
                  {tier.cta}
                </a>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3}>
          <p className="text-grey/50 text-xs text-center mt-8">
            Not sure which tier fits? Start with the GTM Audit. It pays for itself before the engagement begins.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
