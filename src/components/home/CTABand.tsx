import MagneticButton from "@/components/MagneticButton";
import Reveal from "@/components/Reveal";
import TextReveal from "@/components/TextReveal";
import { CONTACT_EMAIL } from "@/lib/data";

export default function CTABand() {
  return (
    <section className="section-pad bg-black border-t hairline">
      <div className="container-edge text-center">
        <Reveal>
          <span className="eyebrow block mb-8">Start a Project</span>
          <h2 className="font-display text-white text-4xl md:text-6xl lg:text-7xl leading-[0.95] max-w-4xl mx-auto">
            <TextReveal
              text="Let's build the engine behind your next stage of growth."
              triggerOnView
              className="block"
            />
          </h2>
          <div className="flex flex-wrap justify-center gap-4 mt-12">
            <MagneticButton href="/contact" variant="solid">
              Start a Project
            </MagneticButton>
            <a href={`mailto:${CONTACT_EMAIL}`} data-cursor-hover className="btn-outline">
              {CONTACT_EMAIL}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
