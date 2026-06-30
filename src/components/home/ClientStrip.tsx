import { clients } from "@/lib/data";
import Reveal from "@/components/Reveal";

export default function ClientStrip() {
  return (
    <section className="section-pad py-20! bg-black border-y hairline">
      <div className="container-edge">
        <Reveal>
          <span className="eyebrow block text-center mb-10">
            Trusted by category-defining tech companies
          </span>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {clients.map((client, i) => (
            <Reveal key={client.slug} delay={i * 0.08}>
              <div className="glass-panel flex items-center justify-center h-24 md:h-28">
                <span className="font-display text-lg md:text-xl text-mist tracking-tight">
                  {client.name}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
