import { approachSteps } from "@/lib/data";
import Reveal from "@/components/Reveal";
import TextReveal from "@/components/TextReveal";

export default function ApproachSection() {
  return (
    <section className="section-pad bg-black">
      <div className="container-edge">
        <div className="grid-12 mb-16">
          <div className="col-span-12 lg:col-span-6">
            <Reveal>
              <span className="eyebrow block mb-6">How We Work</span>
              <h2 className="text-white font-display text-4xl md:text-5xl lg:text-6xl leading-tight">
                <TextReveal text="A system, not a sprint." triggerOnView />
              </h2>
            </Reveal>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-grey/10">
          {approachSteps.map((step, i) => (
            <Reveal key={step.index} delay={i * 0.1}>
              <div className="bg-black p-8 md:p-10 h-full">
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
  );
}
