import Reveal from "@/components/Reveal";
import TextReveal from "@/components/TextReveal";
import MagneticButton from "@/components/MagneticButton";
import {
  HOMEPAGE_TEASER_COPY,
  ROUNDTABLE_HOME_HREF,
  ROUNDTABLE_HOME_FORMATS_HREF,
} from "@/content/roundtable";

export default function RoundtableTeaser() {
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

          <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 sm:gap-6 mt-12">
            <MagneticButton
              href={ROUNDTABLE_HOME_HREF}
              variant="solid"
              className="w-full sm:w-auto justify-center"
            >
              {HOMEPAGE_TEASER_COPY.primaryButton}
            </MagneticButton>
            <a
              href={ROUNDTABLE_HOME_FORMATS_HREF}
              data-cursor-hover
              className="text-mist hover:text-white underline underline-offset-4 transition-colors min-h-[44px] flex items-center"
            >
              {HOMEPAGE_TEASER_COPY.secondaryLink}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
