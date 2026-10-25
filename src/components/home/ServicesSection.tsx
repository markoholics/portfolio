"use client";

import { PRICING_PLANS, PRICING } from "@/lib/fit-check/config";
import Reveal from "@/components/Reveal";
import TextReveal from "@/components/TextReveal";
import MagneticButton from "@/components/MagneticButton";

const TIER_INDEX = ["01", "02", "03"];

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
                Starting at ₹{PRICING.proofSprint.amount.toLocaleString("en-IN")} (+GST) for
                a six month Proof Sprint. All engagements are outcome-based,
                not time-based. We don&apos;t sell hours — we build systems
                that generate returns.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-grey/10">
          {PRICING_PLANS.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 0.1}>
              <div
                className={`relative flex flex-col h-full p-8 md:p-10 ${
                  plan.highlight ? "bg-white" : "bg-black"
                }`}
              >
                {plan.highlight && (
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
                      plan.highlight ? "text-black/30" : "text-grey/30"
                    }`}
                  >
                    {TIER_INDEX[i]}
                  </span>
                  <h3
                    className={`font-display text-2xl md:text-3xl mb-2 ${
                      plan.highlight ? "text-black" : "text-white"
                    }`}
                  >
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-2 mb-4 flex-wrap">
                    <span
                      className={`font-display text-4xl md:text-5xl ${
                        plan.highlight ? "text-black" : "text-white"
                      }`}
                    >
                      ₹{plan.amount.toLocaleString("en-IN")}
                    </span>
                    <span
                      className={`text-sm ${
                        plan.highlight ? "text-black/60" : "text-grey"
                      }`}
                    >
                      + GST
                    </span>
                  </div>
                  <p
                    className={`text-sm leading-relaxed ${
                      plan.highlight ? "text-black/70" : "text-grey"
                    }`}
                  >
                    {plan.period}
                  </p>
                </div>

                <ul className="space-y-3 mb-10 flex-1">
                  {plan.features.map((item) => (
                    <li
                      key={item}
                      className={`flex items-start gap-3 text-sm ${
                        plan.highlight ? "text-black/80" : "text-mist"
                      }`}
                    >
                      <span
                        className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                        style={{
                          background: plan.highlight
                            ? "#000"
                            : "var(--color-accent)",
                        }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>

                <p
                  className={`text-xs leading-relaxed ${
                    plan.highlight ? "text-black/60" : "text-grey/70"
                  }`}
                >
                  {plan.commitment}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3}>
          <p className="text-grey/50 text-xs text-center mt-8">
            Not sure which tier fits? Take the Fit Check and find out in about ninety seconds.
          </p>
          <div className="flex justify-center mt-8">
            <MagneticButton href="/fit-check" variant="solid">
              Take the Fit Check
            </MagneticButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
