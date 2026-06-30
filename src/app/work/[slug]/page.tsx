import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { caseStudies, services } from "@/lib/data";
import Reveal from "@/components/Reveal";
import MagneticButton from "@/components/MagneticButton";

export function generateStaticParams() {
  return caseStudies.map((cs) => ({ slug: cs.slug }));
}

function getCaseStudy(slug: string) {
  return caseStudies.find((cs) => cs.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) return {};
  return {
    title: `${cs.name} Case Study`,
    description: `How Markoholics built the growth engine for ${cs.name}: ${cs.oneLiner}`,
  };
}

function serviceName(slug: string) {
  return services.find((s) => s.slug === slug)?.name ?? slug;
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) notFound();

  const idx = caseStudies.findIndex((c) => c.slug === slug);
  const next = caseStudies[(idx + 1) % caseStudies.length];

  return (
    <div className="bg-black">
      <section className="relative pt-44 pb-24 border-b hairline overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(217,217,217,0.1),transparent_60%)]" />
        <div className="container-edge relative z-10">
          <Reveal>
            <span className="eyebrow block mb-6">{cs.sector}</span>
            <h1 className="font-display text-white text-5xl md:text-7xl leading-[0.95] mb-8">
              {cs.name}
            </h1>
            <div className="flex flex-wrap gap-2">
              {cs.servicesUsed.map((s) => (
                <span
                  key={s}
                  className="text-xs uppercase tracking-[0.16em] border hairline px-3 py-1.5 text-grey"
                >
                  {serviceName(s)}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-pad border-b hairline">
        <div className="container-edge grid-12">
          <div className="col-span-12 lg:col-span-3">
            <Reveal>
              <span className="eyebrow block">The Challenge</span>
            </Reveal>
          </div>
          <div className="col-span-12 lg:col-span-7">
            <Reveal delay={0.1}>
              <p className="text-mist text-2xl md:text-3xl leading-snug font-display">
                {cs.challenge}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section-pad border-b hairline">
        <div className="container-edge">
          <Reveal>
            <span className="eyebrow block mb-12">Strategy &amp; Execution</span>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-grey/10">
            {cs.strategy.map((item, i) => (
              <Reveal key={item.service} delay={i * 0.1}>
                <div className="bg-black p-8 h-full">
                  <span className="eyebrow block mb-4 text-grey">
                    {serviceName(item.service)}
                  </span>
                  <p className="text-mist">{item.detail}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad border-b hairline bg-charcoal/20">
        <div className="container-edge">
          <Reveal>
            <span className="eyebrow block mb-12">Results</span>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {cs.results.map((r, i) => (
              <Reveal key={r.label} delay={i * 0.1}>
                <div>
                  <span className="font-display text-4xl md:text-5xl text-white block mb-3">
                    {r.value}
                  </span>
                  <span className="text-grey uppercase tracking-[0.12em] text-sm">
                    {r.label}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad border-b hairline">
        <div className="container-edge">
          <Reveal>
            <span className="eyebrow block mb-12">Visual Gallery</span>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <Reveal key={n} delay={n * 0.08}>
                <div className="aspect-video bg-charcoal/40 border hairline relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(217,217,217,0.08),transparent_60%)]" />
                  <span className="eyebrow text-grey/50">
                    {cs.name} — Visual {n} [Placeholder]
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-edge flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <span className="eyebrow block mb-4">Next Case Study</span>
            <Link
              href={`/work/${next.slug}`}
              data-cursor-hover
              className="font-display text-4xl md:text-6xl text-white hover:text-grey transition-colors"
            >
              {next.name} &rarr;
            </Link>
          </div>
          <MagneticButton href="/contact" variant="outline">
            Start a Project
          </MagneticButton>
        </div>
      </section>
    </div>
  );
}
