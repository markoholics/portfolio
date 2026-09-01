import { partnerStackLogos } from "@/lib/data";
import Reveal from "@/components/Reveal";
import PartnerLogo from "@/components/home/PartnerLogo";

export default function PartnerStack() {
  return (
    <section className="section-pad py-20! bg-black border-b hairline">
      <div className="container-edge">
        <Reveal>
          <span className="eyebrow block text-center mb-10">Partner Stack</span>
        </Reveal>
        <div className="flex flex-wrap items-center justify-center gap-6">
          {partnerStackLogos.map((partner, i) => (
            <Reveal key={partner.name} delay={i * 0.08}>
              <PartnerLogo partner={partner} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
