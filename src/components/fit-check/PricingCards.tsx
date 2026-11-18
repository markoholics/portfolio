"use client";

import { useState } from "react";
import { PRICING_PLANS, formatPlanAmount, type Currency } from "@/lib/fit-check/config";
import Reveal from "@/components/Reveal";
import CurrencyToggle from "@/components/pricing/CurrencyToggle";

// Mirrors the card pattern already used for the homepage's three
// engagement tiers (src/components/home/ServicesSection.tsx): one
// highlighted "Most Popular" card in a row of three, numbered, with a
// bullet list and a CTA-less commitment paragraph in place of a button —
// these are context for the Fit Check, not something to click through.
export default function PricingCards() {
  const [currency, setCurrency] = useState<Currency>("INR");

  return (
    <div className="mb-16">
      <div className="flex justify-end mb-6">
        <CurrencyToggle currency={currency} onChange={setCurrency} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-grey/10">
        {PRICING_PLANS.map((plan, i) => (
          <Reveal key={plan.name} delay={i * 0.1}>
            <div
              className={`relative flex flex-col h-full p-8 ${
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

              <h3
                className={`font-display text-xl md:text-2xl mb-2 ${
                  plan.highlight ? "text-black" : "text-white"
                }`}
              >
                {plan.name}
              </h3>
              <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                <span
                  className={`font-display text-3xl md:text-4xl ${
                    plan.highlight ? "text-black" : "text-white"
                  }`}
                >
                  {formatPlanAmount(
                    currency === "INR" ? plan.amount : plan.usdAmount,
                    currency
                  )}
                </span>
                {currency === "INR" && (
                  <span className={`text-sm ${plan.highlight ? "text-black/60" : "text-grey"}`}>
                    + GST
                  </span>
                )}
              </div>
              <p
                className={`text-xs mb-6 ${plan.highlight ? "text-black/60" : "text-grey"}`}
              >
                {plan.period}
              </p>

              <span
                className={`eyebrow block mb-3 ${plan.highlight ? "text-black/50" : ""}`}
              >
                You get
              </span>
              <ul className="space-y-2.5 mb-6">
                {plan.features.map((item) => (
                  <li
                    key={item}
                    className={`flex items-start gap-3 text-sm ${
                      plan.highlight ? "text-black/80" : "text-mist"
                    }`}
                  >
                    <span
                      className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: plan.highlight ? "#000" : "var(--color-accent)" }}
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <span
                className={`eyebrow block mb-3 ${plan.highlight ? "text-black/50" : ""}`}
              >
                Commitment
              </span>
              <p
                className={`text-sm leading-relaxed ${
                  plan.highlight ? "text-black/70" : "text-grey"
                }`}
              >
                {plan.commitment}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
