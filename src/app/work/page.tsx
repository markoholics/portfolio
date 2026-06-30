import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import TextReveal from "@/components/TextReveal";
import WorkGrid from "@/components/work/WorkGrid";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Go-to-market and growth engines built for EQRGen, Byosync, Aditi Consulting, and Snapmint across GTM strategy, content, social, performance, demand generation, and AI transformation.",
};

export default function WorkIndex() {
  return (
    <div className="bg-black pt-40">
      <section className="container-edge pb-16">
        <Reveal>
          <span className="eyebrow block mb-6">Selected Work</span>
          <h1 className="font-display text-white text-5xl md:text-7xl leading-[0.95] max-w-3xl">
            <TextReveal text="Engines built for category leaders." />
          </h1>
        </Reveal>
      </section>
      <WorkGrid />
    </div>
  );
}
