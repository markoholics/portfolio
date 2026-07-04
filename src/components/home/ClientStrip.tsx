import { clients } from "@/lib/data";
import Reveal from "@/components/Reveal";

const clientContext: Record<string, string> = {
  eqrgen: "Dynamic QR Infrastructure",
  byosync: "Trust & Consent Tech",
  "aditi-consulting": "Digital Engineering",
  snapmint: "E-commerce Fintech",
};

export default function ClientStrip() {
  return (
    <section className="section-pad py-20! bg-black border-y hairline">
      <div className="container-edge">
        <Reveal>
          <span className="eyebrow block text-center mb-10">
            Trusted by founders at EQRGen, Byosync, Aditi Consulting, and Snapmint
          </span>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {clients.map((client, i) => (
            <Reveal key={client.slug} delay={i * 0.08}>
              <div className="glass-panel flex flex-col items-center justify-center gap-2 h-24 md:h-28 px-4">
                <span className="font-display text-lg md:text-xl text-mist tracking-tight text-center">
                  {client.name}
                </span>
                <span className="text-grey/60 text-[0.6rem] uppercase tracking-[0.18em] text-center">
                  {clientContext[client.slug] ?? "Technology"}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
