import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import TextReveal from "@/components/TextReveal";
import FitCheckFlow from "@/components/fit-check/FitCheckFlow";
import PricingCards from "@/components/fit-check/PricingCards";
import { LANDING_COPY, PROGRESS_COPY } from "@/lib/fit-check/copy";
import { SHOW_PRICE_ANCHOR } from "@/lib/fit-check/config";
import { SITE_URL, webPageJsonLd } from "@/lib/seo";

const TITLE = "Fit Check · Markoholics";
const DESCRIPTION =
  "Seven short questions, about ninety seconds. Find out whether Markoholics is the right AI native growth partner for your business.";
const PATH = "/fit-check";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}${PATH}`,
    siteName: "Markoholics",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function FitCheckPage() {
  return (
    <div className="bg-black pt-40 pb-24">
      <section className="container-edge pb-16">
        <Reveal>
          <span className="eyebrow block mb-6">{LANDING_COPY.eyebrow}</span>
          <h1 className="font-display text-white text-4xl md:text-5xl lg:text-6xl leading-tight max-w-3xl">
            <TextReveal text={LANDING_COPY.heading} />
          </h1>
          <p className="text-grey text-lg mt-6 max-w-2xl">{LANDING_COPY.subheading}</p>

          {SHOW_PRICE_ANCHOR && (
            <div className="mt-10 border hairline p-6 glass-panel max-w-2xl">
              <p className="font-display text-xl md:text-2xl text-white">
                {LANDING_COPY.priceAnchorLabel}
              </p>
              <p className="text-grey text-sm mt-2">{LANDING_COPY.priceAnchorSupport}</p>
            </div>
          )}
        </Reveal>
      </section>

      <section className="section-pad pt-0 pb-0 border-t hairline">
        <div className="container-edge">
          <Reveal>
            <span className="eyebrow block mb-6">Three Ways To Work With Us</span>
            <PricingCards />
          </Reveal>
        </div>
      </section>

      <section className="section-pad pt-0">
        <div className="container-edge">
          <Reveal delay={0.1}>
            <p className="eyebrow text-center mb-10">{PROGRESS_COPY.promise}</p>
            <FitCheckFlow />
          </Reveal>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webPageJsonLd({
              name: TITLE,
              description: DESCRIPTION,
              path: PATH,
            })
          ),
        }}
      />
    </div>
  );
}
