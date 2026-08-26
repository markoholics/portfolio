import { aiStackLayers } from "@/lib/data";
import Reveal from "@/components/Reveal";
import TextReveal from "@/components/TextReveal";

export default function AiStackSection() {
  return (
    <section className="section-pad bg-charcoal/30 border-y hairline">
      <div className="container-edge">
        <div className="grid-12 mb-16">
          <div className="col-span-12 lg:col-span-6">
            <Reveal>
              <span className="eyebrow block mb-6">The AI Workflow Stack</span>
              <h2 className="text-white font-display text-4xl md:text-5xl lg:text-6xl leading-tight">
                <TextReveal text="The stack that lets three people" triggerOnView as="span" className="block" />
                <TextReveal text="do the work of ten." triggerOnView as="span" className="block" delay={0.1} />
              </h2>
            </Reveal>
          </div>
        </div>

        <div className="hidden md:grid grid-cols-[1fr_2fr_2fr] gap-6 pb-4 border-b hairline mb-2">
          <span className="text-grey text-sm uppercase tracking-[0.12em]">Layer</span>
          <span className="text-grey text-sm uppercase tracking-[0.12em]">Where Human Judgment Leads</span>
          <span className="text-grey text-sm uppercase tracking-[0.12em]">Where AI Leverage Compounds</span>
        </div>

        {aiStackLayers.map((row, i) => (
          <Reveal key={row.index} delay={i * 0.1}>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_2fr] gap-3 md:gap-6 py-6 border-b hairline">
              <span className="font-display text-white text-lg">{row.layer}</span>
              <p className="text-grey">
                <span className="md:hidden text-grey/60 text-xs uppercase tracking-[0.1em] block mb-1">
                  Human Judgment
                </span>
                {row.humanFocus}
              </p>
              <p className="text-grey">
                <span className="md:hidden text-grey/60 text-xs uppercase tracking-[0.1em] block mb-1">
                  AI Leverage
                </span>
                {row.aiLeverage}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
