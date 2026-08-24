import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import TextReveal from "@/components/TextReveal";
import WorkGrid from "@/components/work/WorkGrid";
import FAQAccordion from "@/components/FAQAccordion";
import { workFaqItems } from "@/lib/data";
import { webPageJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Growth Engine Case Studies: Our GTM Work",
  description:
    "Go-to-market growth engines built for EQRGen and Byosync across strategy, content, and AI-native demand generation.",
  alternates: { canonical: "/work" },
};

export default function WorkIndex() {
  return (
    <div className="bg-black pt-40">
      <section className="container-edge pb-16">
        <Reveal>
          <span className="eyebrow block mb-6">Selected Work</span>
          <h1 className="font-display text-white text-5xl md:text-7xl leading-[0.95] max-w-3xl">
            <TextReveal text="GTM engines built for category leaders." />
          </h1>
          <p className="text-grey text-lg max-w-2xl mt-8">
            Every engagement below is a full GTM system, not a single campaign:
            strategy, content, paid, demand generation, and AI operations run
            together against a number the founder actually cares about. We
            work with a small roster of Series A-C tech companies at a time,
            which is why we can show real pipeline, revenue, and activation
            numbers instead of vanity metrics.
          </p>
          <p className="text-grey text-lg max-w-2xl mt-4">
            The case studies here span dynamic QR infrastructure and trust
            and consent technology, each with a different GTM problem:
            category education and market validation. What is consistent
            across both is the operating model: one senior team running
            strategy and execution together, instrumented from day one so
            we know within weeks whether a motion is working.
          </p>
        </Reveal>
      </section>
      <WorkGrid />
      <FAQAccordion
        items={workFaqItems}
        eyebrow="Questions About Our Work"
        heading="Before you dig in."
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webPageJsonLd({
              name: "Work | Markoholics",
              description: metadata.description as string,
              path: "/work",
            })
          ),
        }}
      />
    </div>
  );
}
