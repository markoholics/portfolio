import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import TextReveal from "@/components/TextReveal";
import { CONTACT_EMAIL } from "@/lib/data";
import { webPageJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that govern use of markoholics.com and engagements with Markoholics.",
  alternates: { canonical: "/terms" },
};

const LAST_UPDATED = "August 31, 2026";

export default function TermsPage() {
  return (
    <div className="bg-black pt-40">
      <section className="container-edge pb-16">
        <Reveal>
          <span className="eyebrow block mb-6">Legal</span>
          <h1 className="font-display text-white text-4xl md:text-5xl lg:text-6xl leading-tight max-w-3xl">
            <TextReveal text="Terms of Service." />
          </h1>
          <p className="text-grey text-lg max-w-2xl mt-8">
            Last updated: {LAST_UPDATED}
          </p>
        </Reveal>
      </section>

      <section className="section-pad pt-0">
        <div className="container-edge max-w-3xl space-y-12">
          <Reveal>
            <h2 className="font-display text-white text-2xl md:text-3xl leading-tight mb-4">
              Acceptance of these terms
            </h2>
            <p className="text-grey text-lg leading-relaxed">
              These terms govern your use of markoholics.com, operated by
              Creative Engineering Enterprises Private Limited
              (&quot;Markoholics,&quot; &quot;we,&quot; &quot;us&quot;). By
              browsing this site or submitting the contact form, you agree
              to these terms. They do not, by themselves, create a client
              engagement.
            </p>
          </Reveal>

          <Reveal delay={0.05}>
            <h2 className="font-display text-white text-2xl md:text-3xl leading-tight mb-4">
              Service engagements
            </h2>
            <p className="text-grey text-lg leading-relaxed">
              Content on this site, including service descriptions, pricing
              tiers, and case study results, is informational and does not
              itself constitute an offer or contract. An actual engagement —
              scope, pricing, timeline, and deliverables — is governed
              exclusively by the separate signed agreement sent after a
              strategy call, not by anything published on this website.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="font-display text-white text-2xl md:text-3xl leading-tight mb-4">
              Intellectual property
            </h2>
            <p className="text-grey text-lg leading-relaxed">
              The content on this site — including text, case studies,
              graphics, and the Markoholics name and logo — belongs to
              Creative Engineering Enterprises Private Limited unless
              otherwise credited. You may not reproduce, redistribute, or
              use it commercially without our written permission.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <h2 className="font-display text-white text-2xl md:text-3xl leading-tight mb-4">
              No warranty
            </h2>
            <p className="text-grey text-lg leading-relaxed">
              This site and its content are provided &quot;as is,&quot;
              without warranties of any kind. Case study results describe
              specific past engagements and are not a guarantee of results
              for any other company.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <h2 className="font-display text-white text-2xl md:text-3xl leading-tight mb-4">
              Limitation of liability
            </h2>
            <p className="text-grey text-lg leading-relaxed">
              To the fullest extent permitted by law, Markoholics is not
              liable for any indirect, incidental, or consequential damages
              arising from your use of this website. This does not limit
              liability under any separately signed client agreement.
            </p>
          </Reveal>

          <Reveal delay={0.25}>
            <h2 className="font-display text-white text-2xl md:text-3xl leading-tight mb-4">
              Governing law
            </h2>
            <p className="text-grey text-lg leading-relaxed">
              These terms are governed by the laws of India, and any dispute
              arising from them is subject to the exclusive jurisdiction of
              the courts of Bengaluru, Karnataka.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <h2 className="font-display text-white text-2xl md:text-3xl leading-tight mb-4">
              Contact
            </h2>
            <p className="text-grey text-lg leading-relaxed">
              Questions about these terms can be sent to{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="underline underline-offset-2 hover:text-white transition-colors"
              >
                {CONTACT_EMAIL}
              </a>
              . Markoholics is operated by Creative Engineering Enterprises
              Private Limited, D NO 22, 4th Floor Vijaya, Bank Colony 6 Cross
              Road, Banaswadi, Bangalore North, Bangalore- 560043, Karnataka,
              India. CIN: U62099KA2026PTC225694.
            </p>
          </Reveal>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webPageJsonLd({
              name: "Terms of Service | Markoholics",
              description: metadata.description as string,
              path: "/terms",
            })
          ),
        }}
      />
    </div>
  );
}
