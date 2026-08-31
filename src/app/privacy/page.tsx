import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import TextReveal from "@/components/TextReveal";
import { CONTACT_EMAIL } from "@/lib/data";
import { webPageJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Markoholics collects, uses, and protects the personal data of visitors and contacts to markoholics.com.",
  alternates: { canonical: "/privacy" },
};

const LAST_UPDATED = "August 31, 2026";

export default function PrivacyPage() {
  return (
    <div className="bg-black pt-40">
      <section className="container-edge pb-16">
        <Reveal>
          <span className="eyebrow block mb-6">Legal</span>
          <h1 className="font-display text-white text-4xl md:text-5xl lg:text-6xl leading-tight max-w-3xl">
            <TextReveal text="Privacy Policy." />
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
              Who this policy covers
            </h2>
            <p className="text-grey text-lg leading-relaxed">
              This policy applies to markoholics.com, operated by Creative
              Engineering Enterprises Private Limited (&quot;Markoholics,&quot;
              &quot;we,&quot; &quot;us&quot;). It explains what personal data
              we collect from visitors and prospective clients, why we
              collect it, and how you can control it.
            </p>
          </Reveal>

          <Reveal delay={0.05}>
            <h2 className="font-display text-white text-2xl md:text-3xl leading-tight mb-4">
              What we collect
            </h2>
            <p className="text-grey text-lg leading-relaxed mb-4">
              When you submit our contact form, we collect the information
              you provide directly: your name, email address, and,
              optionally, your company name and message. We use this solely
              to respond to your inquiry and, if you become a client, to
              deliver our services.
            </p>
            <p className="text-grey text-lg leading-relaxed">
              We also use standard web analytics and advertising tools —
              Google Analytics and the Meta Pixel — which collect
              information automatically as you browse the site, such as
              pages visited, referral source, device and browser type, and
              approximate location. These tools set cookies and similar
              identifiers in your browser.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="font-display text-white text-2xl md:text-3xl leading-tight mb-4">
              How we use your data
            </h2>
            <p className="text-grey text-lg leading-relaxed">
              We use contact form submissions to respond to inquiries and
              scope potential engagements. We use analytics data to
              understand how visitors use the site and to measure the
              performance of our own marketing, including ads run through
              Meta. We do not sell personal data to third parties.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <h2 className="font-display text-white text-2xl md:text-3xl leading-tight mb-4">
              Where your data is stored
            </h2>
            <p className="text-grey text-lg leading-relaxed">
              Contact form submissions are stored in a secure, access-controlled
              database. Analytics data collected by Google Analytics and the
              Meta Pixel is stored and processed by Google and Meta under
              their own respective privacy policies.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <h2 className="font-display text-white text-2xl md:text-3xl leading-tight mb-4">
              Your rights
            </h2>
            <p className="text-grey text-lg leading-relaxed">
              You can request a copy of the personal data we hold about you,
              ask us to correct it, or ask us to delete it, by emailing us at
              the address below. We will respond within a reasonable time.
              You can also opt out of Google Analytics tracking using
              Google&apos;s own{" "}
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="underline underline-offset-2 hover:text-white transition-colors"
              >
                browser opt-out add-on
              </a>
              , and manage ad personalization directly in your Meta account
              settings.
            </p>
          </Reveal>

          <Reveal delay={0.25}>
            <h2 className="font-display text-white text-2xl md:text-3xl leading-tight mb-4">
              Changes to this policy
            </h2>
            <p className="text-grey text-lg leading-relaxed">
              We may update this policy from time to time as our tools or
              practices change. The &quot;Last updated&quot; date at the top
              of this page always reflects the current version.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <h2 className="font-display text-white text-2xl md:text-3xl leading-tight mb-4">
              Contact
            </h2>
            <p className="text-grey text-lg leading-relaxed">
              Questions about this policy, or requests regarding your data,
              can be sent to{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="underline underline-offset-2 hover:text-white transition-colors"
              >
                {CONTACT_EMAIL}
              </a>
              . Markoholics is operated by Creative Engineering Enterprises
              Private Limited, D NO 22, 4th Floor Vijaya, Bank Colony 6 Cross
              Road, Banaswadi, Bangalore North, Bangalore- 560043, Karnataka,
              India.
            </p>
          </Reveal>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webPageJsonLd({
              name: "Privacy Policy | Markoholics",
              description: metadata.description as string,
              path: "/privacy",
            })
          ),
        }}
      />
    </div>
  );
}
