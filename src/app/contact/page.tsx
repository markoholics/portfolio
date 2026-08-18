import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import TextReveal from "@/components/TextReveal";
import ContactForm from "@/components/contact/ContactForm";
import CalendlyPopup from "@/components/CalendlyPopup";
import Byline from "@/components/Byline";
import FAQAccordion from "@/components/FAQAccordion";
import { CONTACT_EMAIL, contactFaqItems } from "@/lib/data";
import { webPageJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Book a GTM Strategy Call",
  description:
    "Start a project with Markoholics. Tell us what you're building, and we'll respond within one business day.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="bg-black pt-40">
      <CalendlyPopup />
      <section className="container-edge pb-20">
        <Reveal>
          <span className="eyebrow block mb-6">Contact</span>
          <h1 className="font-display text-white text-5xl md:text-7xl leading-[0.95] max-w-3xl">
            <TextReveal text="Tell us what you're building." />
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
              <p className="text-grey mb-8">
                Remote-first, working with technology companies globally,
                including founders across the US, UK, Singapore, and Dubai.
              </p>
              <span className="eyebrow block mb-3">What Happens Next</span>
              <p className="text-grey mb-8">
                We read every submission personally. If there is a fit, you
                will hear back within one business day with either a few
                qualifying questions or a direct link to book a 30-minute
                strategy call. If it is not a fit, we will tell you that too,
                rather than string out a sales process that will not close.
              </p>
              <span className="eyebrow block mb-3">Getting Started</span>
              <p className="text-grey">
                Most engagements start with a 30-minute strategy call where we
                walk through your current GTM motion, where it is leaking
                revenue, and whether our model is the right fit. If we agree
                it is, we send an agreement and first invoice, and work
                begins as soon as payment clears. Most clients are live
                within seven days of signing, with a weekly sprint cadence
                and monthly strategy reviews from there.
              </p>
              <Byline className="mt-8" />
            </Reveal>
          </div>
          <div className="col-span-12 lg:col-span-6 lg:col-start-7 mt-12 lg:mt-0">
            <Reveal delay={0.1}>
              <ContactForm />
            </Reveal>
          </div>
        </div>
      </section>

      <FAQAccordion
        items={contactFaqItems}
        eyebrow="Before You Reach Out"
        heading="What to expect."
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webPageJsonLd({
              name: "Contact | Markoholics",
              description: metadata.description as string,
              path: "/contact",
            })
          ),
        }}
      />
    </div>
  );
}
