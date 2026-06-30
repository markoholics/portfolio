import Reveal from "@/components/Reveal";

export default function Testimonial() {
  return (
    <section className="section-pad bg-black">
      <div className="container-edge">
        <div className="grid-12">
          <div className="col-span-12 lg:col-span-10 lg:col-start-2">
            <Reveal>
              <blockquote className="font-display text-3xl md:text-5xl lg:text-6xl leading-tight text-white italic">
                &ldquo;[Client quote placeholder] — Markoholics rebuilt our
                growth motion from the ground up, and the team operated as an
                extension of ours, not a vendor.&rdquo;
              </blockquote>
              <div className="mt-10 flex items-center gap-4">
                <div className="w-12 h-px bg-grey" />
                <span className="text-grey uppercase tracking-[0.18em] text-sm">
                  [Name placeholder], [Title placeholder]
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
