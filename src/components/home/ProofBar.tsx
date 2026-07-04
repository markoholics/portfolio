import { proofMetrics } from "@/lib/data";
import AnimatedCounter from "@/components/AnimatedCounter";
import Reveal from "@/components/Reveal";

export default function ProofBar() {
  return (
    <section className="section-pad bg-charcoal/30 border-y hairline">
      <div className="container-edge">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6">
          {proofMetrics.map((metric, i) => (
            <Reveal key={metric.label} delay={i * 0.1}>
              <div>
                <div className="font-display text-4xl md:text-6xl text-white mb-3">
                  <AnimatedCounter
                    value={metric.value}
                    prefix={metric.prefix}
                    suffix={metric.suffix}
                  />
                </div>
                <p className="text-grey text-sm uppercase tracking-[0.12em]">
                  {metric.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="text-grey/60 text-xs mt-12">
          Aggregate figures across active and completed client engagements. All engagements are outcome-based, not time-based.
        </p>
      </div>
    </section>
  );
}
