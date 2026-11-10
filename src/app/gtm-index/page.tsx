import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import TextReveal from "@/components/TextReveal";
import GtmIndexTool from "@/components/gtm-index/GtmIndexTool";
import { GTM_INDEX_META, HERO_COPY } from "@/content/gtmIndex";
import { SITE_URL, webPageJsonLd } from "@/lib/seo";

const PATH = "/gtm-index";

export const metadata: Metadata = {
  title: { absolute: GTM_INDEX_META.title },
  description: GTM_INDEX_META.description,
  alternates: { canonical: PATH },
  openGraph: {
    title: GTM_INDEX_META.title,
    description: GTM_INDEX_META.description,
    url: `${SITE_URL}${PATH}`,
    siteName: "Markoholics",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: GTM_INDEX_META.title,
    description: GTM_INDEX_META.description,
  },
};

export default function GtmIndexPage() {
  return (
    <div className="bg-black pt-40 pb-24">
      <section className="container-edge pb-16">
        <Reveal>
          <span className="eyebrow block mb-6">{HERO_COPY.eyebrow}</span>
          <h1 className="font-display text-white text-4xl md:text-5xl lg:text-6xl leading-tight max-w-3xl">
            <TextReveal text={HERO_COPY.heading} />
          </h1>
          <p className="text-grey text-lg mt-6 max-w-2xl">{HERO_COPY.sub}</p>
        </Reveal>
      </section>

      <section className="section-pad pt-0">
        <div className="container-edge max-w-3xl">
          <Reveal delay={0.1}>
            <GtmIndexTool />
          </Reveal>
        </div>
      </section>

      <section className="section-pad pt-16 border-t hairline">
        <div className="container-edge max-w-3xl">
          <Reveal>
            <span className="eyebrow block mb-6">How this works</span>
            <p className="text-grey leading-relaxed mb-4">
              We fetch your homepage and a few linked pages directly, no AI reads them, and run
              fixed, rule-based checks against the six pillars from our own guide to{" "}
              <Link
                href="/blog/product-positioning-exercise"
                className="underline underline-offset-2 hover:text-white transition-colors"
              >
                product positioning
              </Link>
              : counting calls to action, testimonials, named buyers, generic phrases and more. Every
              finding cites the exact page it came from.
            </p>
            <p className="text-grey leading-relaxed">
              That also means this free scan has real limits: it can&apos;t search the web for how
              others describe you or find your competitors, and it can&apos;t judge whether your
              positioning is the right call, only whether the concrete signals are there. The page
              above shows your score and a short summary. The full report, with the full pillar
              breakdown, specific quick wins, a 30, 60 and 90 day plan, and exactly what this scan
              could not check, goes to your inbox.
            </p>
          </Reveal>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webPageJsonLd({
              name: GTM_INDEX_META.title,
              description: GTM_INDEX_META.description,
              path: PATH,
            })
          ),
        }}
      />
    </div>
  );
}
