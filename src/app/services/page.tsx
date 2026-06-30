import type { Metadata } from "next";
import Link from "next/link";
import { services, caseStudies } from "@/lib/data";
import Reveal from "@/components/Reveal";
import MagneticButton from "@/components/MagneticButton";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Marketing Strategy & GTM Strategy, Content Marketing, Social Media Marketing, Performance Marketing, and Demand Generation & Growth Marketing — Markoholics' five disciplines, run as one growth engine.",
};

export default function ServicesPage() {
  return (
    <div className="bg-black pt-40">
      <section className="container-edge pb-24">
        <Reveal>
          <span className="eyebrow block mb-6">Services</span>
          <h1 className="font-display text-white text-5xl md:text-7xl leading-[0.95] max-w-3xl">
            Five disciplines. One growth engine.
          </h1>
          <p className="text-grey text-lg max-w-xl mt-8">
            Each discipline stands on its own. Run together, they compound —
            strategy informing content, content feeding paid, paid feeding
            demand gen, all reporting to the same growth plan.
          </p>
        </Reveal>
      </section>

      {services.map((service) => {
        const related = caseStudies.filter((cs) =>
          cs.servicesUsed.includes(service.slug)
        );
        return (
          <section
            id={service.slug}
            key={service.slug}
            className="section-pad border-t hairline scroll-mt-24"
          >
            <div className="container-edge grid-12">
              <div className="col-span-12 lg:col-span-4">
                <Reveal>
                  <span className="font-display text-grey/40 text-6xl block mb-6">
                    {service.index}
                  </span>
                  <h2 className="font-display text-white text-3xl md:text-4xl leading-tight mb-6">
                    {service.name}
                  </h2>
                  <p className="text-grey">{service.description}</p>
                </Reveal>
              </div>

              <div className="col-span-12 lg:col-span-4 lg:col-start-6 mt-10 lg:mt-0">
                <Reveal delay={0.1}>
                  <span className="eyebrow block mb-5">What&apos;s Included</span>
                  <ul className="space-y-3">
                    {service.included.map((item) => (
                      <li key={item} className="text-mist flex items-start gap-3">
                        <span className="mt-2 w-1 h-1 rounded-full bg-grey shrink-0" />
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
                      <span className="text-grey/60">[Case study to be added]</span>
                    )}
                  </div>
                </Reveal>
              </div>
            </div>
          </section>
        );
      })}

      <section className="section-pad border-t hairline text-center">
        <Reveal>
          <h2 className="font-display text-white text-4xl md:text-6xl leading-tight max-w-3xl mx-auto mb-10">
            Ready to put all five to work?
          </h2>
          <MagneticButton href="/contact" variant="solid">
            Start a Project
          </MagneticButton>
        </Reveal>
      </section>
    </div>
  );
}
