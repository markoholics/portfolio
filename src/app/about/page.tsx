import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import TextReveal from "@/components/TextReveal";
import MagneticButton from "@/components/MagneticButton";
import { approachSteps } from "@/lib/data";

export const metadata: Metadata = {
  title: "About",
  description:
    "Markoholics is a GTM and growth strategy practice built for tech founders who intend to win their category, not chase impressions.",
};

export default function AboutPage() {
  return (
    <div className="bg-black pt-40">
      <section className="container-edge pb-24">
        <Reveal>
          <span className="eyebrow block mb-6">About Markoholics</span>
          <h1 className="font-display text-white text-5xl md:text-7xl leading-[0.95] max-w-4xl">
            <TextReveal text="We think like operators, not advisors." />
          </h1>
          <p className="text-grey text-lg max-w-2xl mt-8">
            Markoholics was built on a simple premise. The team running
            campaigns should be the same team that designed the strategy. We
            work as an embedded growth team for tech founders launching and
            marketing technology products, helping them move fast without
            burning the brand they are building.
          </p>
        </Reveal>
      </section>

      <section className="section-pad border-t hairline">
        <div className="container-edge grid-12">
          <div className="col-span-12 lg:col-span-5">
            <Reveal>
              <span className="eyebrow block mb-6">Our Point of View</span>
              <h2 className="font-display text-white text-3xl md:text-4xl leading-tight">
                Category leaders are not built on tactics. They are built on
                systems.
              </h2>
            </Reveal>
          </div>
          <div className="col-span-12 lg:col-span-6 lg:col-start-7 mt-10 lg:mt-0 space-y-6">
            <Reveal delay={0.1}>
              <p className="text-grey text-lg">
                Most agencies sell channels. We build the system that
                connects them: positioning that holds up under scrutiny,
                content that compounds instead of resetting every quarter,
                paid acquisition that respects unit economics, demand
                generation that sales actually trusts, and AI workflows that
                remove busywork instead of adding noise.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <p className="text-grey text-lg">
                That only works when one team owns the whole motion. So
                that is how we are structured. Strategists who stay close
                enough to execution to know what is actually working, and
                specialists who never lose sight of the plan.
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
                Founders building the next category-defining tech company.
              </h2>
            </Reveal>
          </div>
          <div className="col-span-12 lg:col-span-6 lg:col-start-7 mt-10 lg:mt-0">
            <Reveal delay={0.1}>
              <p className="text-grey text-lg">
                We partner directly with founders and founding marketing
                teams at technology companies, from early-stage startups
                preparing to launch to scaling companies entering new
                markets. Our job is to help you launch and market your
                product with the same rigor you bring to building it.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section-pad border-t hairline bg-charcoal/20">
        <div className="container-edge">
          <Reveal>
            <span className="eyebrow block mb-12">How We Operate</span>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-grey/10">
            {approachSteps.map((step, i) => (
              <Reveal key={step.index} delay={i * 0.1}>
                <div className="bg-black p-8 h-full">
                  <span className="font-display text-5xl text-grey/40 block mb-8">
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

      <section className="section-pad border-t hairline text-center">
        <Reveal>
          <h2 className="font-display text-white text-4xl md:text-6xl leading-tight max-w-3xl mx-auto mb-10">
            We work with a small number of founders at a time, by design.
          </h2>
          <MagneticButton href="/contact" variant="solid">
            Book a Strategy Call
          </MagneticButton>
        </Reveal>
      </section>
    </div>
  );
}
