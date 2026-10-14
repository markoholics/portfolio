import FitCheckFlow from "@/components/fit-check/FitCheckFlow";
import { LANDING_COPY } from "@/lib/fit-check/copy";
import { SHOW_PRICE_ANCHOR } from "@/lib/fit-check/config";

// Drop this into any existing page (e.g. /contact or /services) to embed
// the same Fit Check flow used on the standalone /fit-check page, without
// that page's full hero/OG-image chrome. See README.md in
// src/lib/fit-check for an example.
export default function FitCheckEmbed({ showHeading = true }: { showHeading?: boolean }) {
  return (
    <div className="border hairline p-6 md:p-12 glass-panel">
      {showHeading && (
        <div className="mb-10 text-center">
          <span className="eyebrow block mb-4">{LANDING_COPY.eyebrow}</span>
          <h2 className="font-display text-2xl md:text-3xl text-white mb-4">{LANDING_COPY.heading}</h2>
          {SHOW_PRICE_ANCHOR && (
            <p className="text-grey text-sm">{LANDING_COPY.priceAnchorLabel}</p>
          )}
        </div>
      )}
      <FitCheckFlow />
    </div>
  );
}
