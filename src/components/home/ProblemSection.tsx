import Reveal from "@/components/Reveal";
import TextReveal from "@/components/TextReveal";

const problems = [
  {
    label: "The handoff problem",
    body: "The strategist designs the funnel. A different team writes the content. A third agency runs the ads. None of them talk. The result is strategy that looks good in a deck and dies in execution.",
  },
  {
    label: "The channel trap",
    body: "You don't need more content. You don't need a bigger ad budget. You need a GTM system where every channel compounds the one before it, built by one team that owns the whole motion.",
  },
  {
    label: "The AI gap",
    body: "Most agencies are running the same playbook they ran five years ago, slightly faster. AI-native GTM means different leverage ratios, different output velocity, and different economics for your growth spend.",
  },
];

export default function ProblemSection() {
  return (
    <section className="section-pad bg-black border-t hairline">
      <div className="container-edge">
        <div className="grid-12 mb-16">
          <div className="col-span-12 lg:col-span-5">
            <Reveal>
              <span className="eyebrow block mb-6">The Problem with Agencies</span>
              <h2 className="text-white font-display text-4xl md:text-5xl lg:text-6xl leading-tight">
                <TextReveal text="Most agencies fail founders." triggerOnView as="span" className="block" />
              </h2>
            </Reveal>
          </div>
          <div className="col-span-12 lg:col-span-5 lg:col-start-8 flex items-end">
            <Reveal delay={0.15}>
              <p className="text-grey text-lg">
                Not because they lack talent. Because they are structured for
                deliverables, not outcomes. You deserve a growth system, not a
                content calendar and a monthly report.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-grey/10">
          {problems.map((p, i) => (
            <Reveal key={p.label} delay={i * 0.1}>
              <div className="bg-black p-8 md:p-10 h-full border-t-2" style={{ borderColor: "var(--color-accent)" }}>
                <span className="eyebrow block mb-6" style={{ color: "var(--color-accent)" }}>
                  {p.label}
                </span>
                <p className="text-grey text-base leading-relaxed">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
