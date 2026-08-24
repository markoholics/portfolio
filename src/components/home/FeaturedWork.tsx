import Link from "next/link";
import { caseStudies, services } from "@/lib/data";
import Reveal from "@/components/Reveal";
import TextReveal from "@/components/TextReveal";

function serviceLabel(slug: string) {
  return services.find((s) => s.slug === slug)?.name.split(" ").slice(0, 2).join(" ") ?? slug;
}

export default function FeaturedWork() {
  return (
    <section className="section-pad bg-charcoal/20">
      <div className="container-edge">
        <div className="grid-12 mb-16">
          <div className="col-span-12 lg:col-span-6">
            <Reveal>
              <span className="eyebrow block mb-6" style={{ color: "var(--color-accent)" }}>Selected Work</span>
              <h2 className="text-white font-display text-4xl md:text-5xl lg:text-6xl leading-tight">
                <TextReveal text="Engines we've built." triggerOnView />
              </h2>
            </Reveal>
          </div>
          <div className="col-span-12 lg:col-span-3 lg:col-start-10 flex items-end justify-start lg:justify-end">
            <Reveal delay={0.15}>
              <Link href="/work" data-cursor-hover className="btn-outline">
                View All Work
              </Link>
            </Reveal>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {caseStudies.map((cs, i) => (
            <Reveal key={cs.slug} delay={i * 0.1}>
              <Link
                href={`/work/${cs.slug}`}
                data-cursor-hover
                className="group block relative overflow-hidden border hairline"
              >
                <div className="relative bg-black flex flex-col justify-end aspect-[4/3]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(217,217,217,0.12),transparent_55%)] transition-opacity duration-500 group-hover:opacity-80" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.06),transparent)]" />
                  <div className="relative z-10 p-8 md:p-10">
                    <div className="flex flex-wrap gap-2 mb-6">
                      {cs.servicesUsed.map((s) => (
                        <span
                          key={s}
                          className="text-[0.65rem] uppercase tracking-[0.18em] border hairline px-3 py-1.5 text-grey"
                        >
                          {serviceLabel(s)}
                        </span>
                      ))}
                    </div>
                    <h3 className="font-display text-3xl md:text-4xl text-white mb-3">
                      {cs.name}
                    </h3>
                    <p className="text-grey max-w-md">{cs.oneLiner}</p>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
