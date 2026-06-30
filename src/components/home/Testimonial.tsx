import Reveal from "@/components/Reveal";
import { caseStudies } from "@/lib/data";

export default function Testimonial() {
  const featured = caseStudies.find((cs) => cs.slug === "snapmint") ?? caseStudies[0];

  return (
    <section className="section-pad bg-black">
      <div className="container-edge">
        <div className="grid-12">
          <div className="col-span-12 lg:col-span-10 lg:col-start-2">
            <Reveal>
              <blockquote className="font-display text-3xl md:text-5xl lg:text-6xl leading-tight text-white italic">
                &ldquo;{featured.quote.text}&rdquo;
              </blockquote>
              <div className="mt-10 flex items-center gap-4">
                <div className="w-12 h-px bg-grey" />
                <span className="text-grey uppercase tracking-[0.18em] text-sm">
                  {featured.quote.attribution}
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
