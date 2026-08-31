import Reveal from "@/components/Reveal";

export const featuredTestimonial = {
  quote: {
    text: "Markoholics didn't just run campaigns, they built a GTM system we could trust with board-level numbers. The pipeline and the discipline behind it are the reason we scaled as fast as we did.",
    attribution: "Vivek Kumar, Founder, EQRGen",
  },
};

const featured = featuredTestimonial;

export default function Testimonial() {
  return (
    <section className="section-pad bg-black">
      <div className="container-edge">
        <div className="grid-12">
          <div className="col-span-12 lg:col-span-10 lg:col-start-2">
            <Reveal>
              <blockquote className="font-display text-2xl md:text-3xl leading-snug text-white italic">
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
