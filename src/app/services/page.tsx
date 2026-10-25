import type { Metadata } from "next";
import Link from "next/link";
import { services, caseStudies, servicesFaqItems } from "@/lib/data";
import { PRICING_PLANS } from "@/lib/fit-check/config";
import Reveal from "@/components/Reveal";
import TextReveal from "@/components/TextReveal";
import MagneticButton from "@/components/MagneticButton";
import FAQAccordion from "@/components/FAQAccordion";
import { webPageJsonLd, serviceJsonLd } from "@/lib/seo";

const TIER_INDEX = ["01", "02", "03"];

export const metadata: Metadata = {
  title: "GTM Strategy, Content & Demand Generation",
  description:
    "AI-native GTM execution across strategy, content, performance marketing, and demand generation. Three tiers starting at ₹75,000.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <div className="bg-black pt-40">
      <section className="container-edge pb-24">
        <Reveal>
          <span className="eyebrow block mb-6" style={{ color: "var(--color-accent)" }}>
            Services
          </span>
          <h1 className="font-display text-white text-4xl md:text-5xl lg:text-6xl leading-tight max-w-3xl">
            <TextReveal text="One GTM system. Three ways in." />
          </h1>
          <p className="text-grey text-lg max-w-xl mt-8">
            We do not sell hours or deliverable lists. We build GTM systems that
            compound, and we run them for you. Choose the entry point that matches
            where you are today.
          </p>
        </Reveal>
      </section>

      <section className="border-t hairline">
        <div className="container-edge py-24">
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

      <section className="border-t hairline">
        <div className="container-edge py-24">
          <Reveal>
            <span className="eyebrow block mb-6">What Each Engagement Covers</span>
            <h2 className="font-display text-white text-3xl md:text-4xl mb-4">
              Six disciplines. One growth motion.
            </h2>
            <p className="text-grey text-lg max-w-xl mb-16">
              Every tier draws from the same six practice areas. What changes is
              the scope, the AI tooling depth, and how much of the operating load
              we carry for you.
            </p>
          </Reveal>

          {services.map((service) => {
            const related = caseStudies.filter((cs) =>
              cs.servicesUsed.includes(service.slug)
            );
            return (
              <section
                id={service.slug}
                key={service.slug}
                className="py-14 border-t hairline scroll-mt-24"
              >
                <div className="grid-12">
                  <div className="col-span-12 lg:col-span-4">
                    <Reveal>
                      <span className="font-display text-grey/40 text-5xl block mb-4">
                        {service.index}
                      </span>
                      <h3 className="font-display text-white text-2xl md:text-3xl leading-tight mb-4">
                        {service.name}
                      </h3>
                      <p className="text-grey">{service.description}</p>
                    </Reveal>
                  </div>

                  <div className="col-span-12 lg:col-span-4 lg:col-start-6 mt-10 lg:mt-0">
                    <Reveal delay={0.1}>
                      <span className="eyebrow block mb-5">What&apos;s Included</span>
                      <ul className="space-y-3">
                        {service.included.map((item) => (
                          <li key={item} className="text-mist flex items-start gap-3">
                            <span
                              className="mt-2 w-1.5 h-1.5 rounded-full shrink-0"
                              style={{ background: "var(--color-accent)" }}
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </Reveal>
                  </div>

                  <div className="col-span-12 lg:col-span-3 lg:col-start-10 mt-10 lg:mt-0">
                    <Reveal delay={0.2}>
                      <span className="eyebrow block mb-5">Related Work</span>
                      <div className="flex flex-col gap-3">
                        {related.length > 0 ? (
                          related.map((cs) => (
                            <Link
                              key={cs.slug}
                              href={`/work/${cs.slug}`}
                              data-cursor-hover
                              className="text-white hover:text-grey transition-colors border-b hairline pb-2"
                            >
                              {cs.name} &rarr;
                            </Link>
                          ))
                        ) : (
                          <Link
                            href="/work"
                            data-cursor-hover
                            className="text-white hover:text-grey transition-colors border-b hairline pb-2"
                          >
                            View all work &rarr;
                          </Link>
                        )}
                      </div>
                    </Reveal>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </section>

      <FAQAccordion
        items={servicesFaqItems}
        eyebrow="Questions About Engaging Us"
        heading="Before you choose a tier."
      />

      <section className="section-pad border-t hairline text-center">
        <Reveal>
          <h2 className="font-display text-white text-4xl md:text-6xl leading-tight max-w-3xl mx-auto mb-10">
            Ready to build your growth engine?
          </h2>
          <MagneticButton href="/contact" variant="solid">
            Book a GTM Strategy Call
          </MagneticButton>
        </Reveal>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webPageJsonLd({
              name: "Services | Markoholics",
              description: metadata.description as string,
              path: "/services",
            })
          ),
        }}
      />
      {services.map((service) => (
        <script
          key={service.slug}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd(service)) }}
        />
      ))}
    </div>
  );
}
