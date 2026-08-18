import { strategicPartners } from "@/lib/data";
import Reveal from "@/components/Reveal";

export default function StrategicPartners() {
  return (
    <section className="section-pad py-20! bg-black border-y hairline">
      <div className="container-edge">
        <Reveal>
          <span className="eyebrow block text-center mb-10">Strategic Partners</span>
        </Reveal>
        <div className="flex flex-wrap items-center justify-center gap-6">
          {strategicPartners.map((partner, i) => {
            const content = (
              <div className="glass-panel flex items-center justify-center h-24 md:h-28 px-10">
                <span className="font-display text-xl md:text-2xl text-mist tracking-tight text-center">
                  {partner.name}
                </span>
              </div>
            );
            return (
              <Reveal key={partner.name} delay={i * 0.08}>
                {partner.href ? (
                  <a
                    href={partner.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor-hover
                    aria-label={`${partner.name} — ${partner.description}`}
                  >
                    {content}
                  </a>
                ) : (
                  <div aria-label={`${partner.name} — ${partner.description}`}>{content}</div>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
