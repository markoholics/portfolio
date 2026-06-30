import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/contact/ContactForm";
import { CONTACT_EMAIL } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a project with Markoholics. Tell us what you're building — we'll respond within one business day.",
};

export default function ContactPage() {
  return (
    <div className="bg-black pt-40">
      <section className="container-edge pb-20">
        <Reveal>
          <span className="eyebrow block mb-6">Contact</span>
          <h1 className="font-display text-white text-5xl md:text-7xl leading-[0.95] max-w-3xl">
            Tell us what you&apos;re building.
          </h1>
        </Reveal>
      </section>

      <section className="section-pad pt-0 border-t hairline">
        <div className="container-edge grid-12">
          <div className="col-span-12 lg:col-span-5">
            <Reveal>
              <p className="text-grey text-lg mb-10">
                Share a few details and we&apos;ll set up a strategy call.
                Prefer email? Reach us directly.
              </p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                data-cursor-hover
                className="font-display text-2xl md:text-3xl text-white hover:text-grey transition-colors block mb-10"
              >
                {CONTACT_EMAIL}
              </a>
              <span className="eyebrow block mb-3">Region</span>
              <p className="text-grey">Remote-first, working with technology companies globally.</p>
            </Reveal>
          </div>
          <div className="col-span-12 lg:col-span-6 lg:col-start-7 mt-12 lg:mt-0">
            <Reveal delay={0.1}>
              <ContactForm />
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
