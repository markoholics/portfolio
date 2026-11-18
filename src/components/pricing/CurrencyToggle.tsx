"use client";

import type { Currency } from "@/lib/fit-check/config";

export default function CurrencyToggle({
  currency,
  onChange,
}: {
  currency: Currency;
  onChange: (currency: Currency) => void;
}) {
  return (
    <div className="inline-flex border hairline" role="group" aria-label="Currency">
      {(["INR", "USD"] as const).map((c) => (
        <button
          key={c}
          type="button"
          data-cursor-hover
          onClick={() => onChange(c)}
          aria-pressed={currency === c}
          className={`px-4 py-2 text-xs uppercase tracking-[0.15em] transition-colors ${
            currency === c ? "bg-white text-black" : "text-grey hover:text-white"
          }`}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
