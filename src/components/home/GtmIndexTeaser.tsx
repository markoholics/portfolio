import Reveal from "@/components/Reveal";
import TextReveal from "@/components/TextReveal";
import MagneticButton from "@/components/MagneticButton";
import { HOMEPAGE_TEASER_COPY, GTM_INDEX_PATH } from "@/content/gtmIndex";

export default function GtmIndexTeaser() {
  return (
    <section className="section-pad bg-black border-t hairline">
      <div className="container-edge text-center">
        <Reveal>
          <span className="eyebrow block mb-8" style={{ color: "var(--color-accent)" }}>
            {HOMEPAGE_TEASER_COPY.eyebrow}
          </span>
          <h2 className="font-display text-white text-4xl md:text-6xl leading-[0.95] max-w-3xl mx-auto">
            <TextReveal text={HOMEPAGE_TEASER_COPY.heading} triggerOnView className="block" />
          </h2>
          <p className="text-grey text-lg max-w-xl mx-auto mt-8">{HOMEPAGE_TEASER_COPY.sub}</p>

          <div className="flex flex-wrap justify-center gap-3 mt-10">
            {HOMEPAGE_TEASER_COPY.chips.map((chip) => (
              <span
                key={chip}
                className="text-xs uppercase tracking-[0.12em] border hairline px-4 py-2 text-mist"
              >
                {chip}
              </span>
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <MagneticButton href={GTM_INDEX_PATH} variant="solid" className="w-full sm:w-auto justify-center">
              {HOMEPAGE_TEASER_COPY.primaryButton}
            </MagneticButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
