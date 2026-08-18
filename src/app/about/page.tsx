import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import TextReveal from "@/components/TextReveal";
import MagneticButton from "@/components/MagneticButton";
import Byline from "@/components/Byline";
import FAQAccordion from "@/components/FAQAccordion";
import { approachSteps, aboutFaqItems } from "@/lib/data";
import { webPageJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "AI-Native GTM Team for Tech Founders",
  description:
    "Markoholics is an AI-native GTM partner built for Series A-C tech founders who need a growth engine, not an agency. Built by operators, not account managers.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="bg-black pt-40">
      <section className="container-edge pb-24">
        <Reveal>
          <span className="eyebrow block mb-6" style={{ color: "var(--color-accent)" }}>
            About Markoholics
          </span>
          <h1 className="font-display text-white text-5xl md:text-7xl leading-[0.95] max-w-4xl">
            <TextReveal text="Built by GTM operators. Not account managers." />
          </h1>
          <p className="text-grey text-lg max-w-2xl mt-8">
            We are not a marketing agency. We are an AI-native GTM partner that
            builds autonomous growth engines for tech founders who cannot afford
            to guess. Every engagement is run by the same team that designed
            the strategy — because strategy that never touches execution is just
            a deck.
          </p>
          <Byline className="mt-8" />
        </Reveal>
      </section>

      <section className="section-pad border-t hairline">
        <div className="container-edge grid-12">
          <div className="col-span-12 lg:col-span-5">
            <Reveal>
              <span className="eyebrow block mb-6">Our Point of View</span>
              <h2 className="font-display text-white text-3xl md:text-4xl leading-tight">
                AI should multiply humans, not replace the thinking.
              </h2>
            </Reveal>
          </div>
          <div className="col-span-12 lg:col-span-6 lg:col-start-7 mt-10 lg:mt-0 space-y-6">
            <Reveal delay={0.1}>
              <p className="text-grey text-lg">
                Most agencies are running five-year-old playbooks slightly
                faster. AI-native GTM is a fundamentally different leverage
                ratio. Three people producing the output of ten, campaigns
                that self-optimize, and reporting that happens in hours, not
                weeks. That is the engine we build.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <p className="text-grey text-lg">
                We use AI to collapse the time and cost of execution, then
                apply human judgment to strategy, positioning, and the calls
                that cannot be automated. The result is a growth motion that
                compounds without burning budget on overhead.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section-pad border-t hairline bg-charcoal/20">
        <div className="container-edge grid-12">
          <div className="col-span-12 lg:col-span-5">
            <Reveal>
              <span className="eyebrow block mb-6">Who We Work With</span>
              <h2 className="font-display text-white text-3xl md:text-4xl leading-tight">
                Series A-C founders who intend to win their category.
              </h2>
            </Reveal>
          </div>
          <div className="col-span-12 lg:col-span-6 lg:col-start-7 mt-10 lg:mt-0 space-y-4">
            <Reveal delay={0.1}>
              <p className="text-grey text-lg">
                We work with tech founders at AI, SaaS, and fintech companies
                across the US, UK, Singapore, and Dubai. Our clients are
                time-poor, outcome-obsessed, and skeptical of agencies for
                good reason. They have been burned by vendors who optimized
                for deliverables instead of revenue.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="text-grey text-lg">
                We keep our client roster small by design. Every founder we
                work with gets the same senior team that sets strategy.
                No handoffs. No juniors running your paid budget unsupervised.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section-pad border-t hairline">
        <div className="container-edge">
          <Reveal>
            <span className="eyebrow block mb-6" style={{ color: "var(--color-accent)" }}>
              The Growth Engine
            </span>
            <h2 className="font-display text-white text-3xl md:text-4xl mb-16">
              How we operate.
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-grey/10">
            {approachSteps.map((step, i) => (
              <Reveal key={step.index} delay={i * 0.1}>
                <div className="bg-black p-8 h-full">
                  <span className="font-display text-5xl text-grey/30 block mb-8">
                    {step.index}
                  </span>
                  <h3 className="font-display text-2xl text-white mb-4">
                    {step.name}
                  </h3>
                  <p className="text-grey">{step.detail}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <FAQAccordion
        items={aboutFaqItems}
        eyebrow="Questions About Fit"
        heading="Are we right for you?"
      />

      <section className="section-pad border-t hairline text-center">
        <Reveal>
          <h2 className="font-display text-white text-4xl md:text-6xl leading-tight max-w-3xl mx-auto mb-4">
            We work with a small number of founders at a time, by design.
          </h2>
          <p className="text-grey text-lg max-w-lg mx-auto mb-10">
            If you are building a tech company and ready to stop guessing at
            your GTM, book a call. We will tell you in 30 minutes whether
            we are the right fit.
          </p>
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
              name: "About | Markoholics",
              description: metadata.description as string,
              path: "/about",
            })
          ),
        }}
      />
    </div>
  );
}
