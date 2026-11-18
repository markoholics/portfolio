"use client";

import { useState } from "react";
import { PRICING_PLANS, formatPlanAmount, type Currency } from "@/lib/fit-check/config";
import Reveal from "@/components/Reveal";
import CurrencyToggle from "@/components/pricing/CurrencyToggle";

const TIER_INDEX = ["01", "02", "03"];

export default function ServicesPricingGrid() {
  const [currency, setCurrency] = useState<Currency>("INR");

  return (
    <>
      <div className="flex justify-end mb-6">
        <CurrencyToggle currency={currency} onChange={setCurrency} />
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
              <span
                className={`font-display text-5xl block mb-4 ${
                  plan.highlight ? "text-black/30" : "text-grey/30"
                }`}
              >
                {TIER_INDEX[i]}
              </span>
              <h2
                className={`font-display text-2xl md:text-3xl mb-2 ${
                  plan.highlight ? "text-black" : "text-white"
                }`}
              >
                {plan.name}
              </h2>
              <div className="flex items-baseline gap-2 mb-4 flex-wrap">
                <span
                  className={`font-display text-4xl ${
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
                className={`text-sm leading-relaxed mb-8 ${
                  plan.highlight ? "text-black/70" : "text-grey"
                }`}
              >
                {plan.period}
              </p>
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
                        background: plan.highlight ? "#000" : "var(--color-accent)",
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
    </>
  );
}
