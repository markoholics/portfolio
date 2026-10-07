import Image from "next/image";
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
            const content = partner.logo ? (
              <div className="glass-panel flex items-center justify-center h-24 w-24 md:h-28 md:w-28 transition-colors group-hover:border-white/30">
                <Image
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  width={40}
                  height={40}
                  className="h-10 w-10 md:h-12 md:w-12 object-contain opacity-80 transition-opacity duration-200 group-hover:opacity-100"
                />
              </div>
            ) : (
              <div className="glass-panel flex items-center justify-center h-24 md:h-28 px-10 transition-colors group-hover:border-white/30">
                <span className="font-display text-xl md:text-2xl text-mist tracking-tight text-center no-underline transition-colors group-hover:text-white">
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
                    className="group block no-underline"
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
