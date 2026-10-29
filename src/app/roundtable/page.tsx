import type { Metadata } from "next";
import { SITE_URL, webPageJsonLd, breadcrumbJsonLd, roundtableEventSeriesJsonLd } from "@/lib/seo";
import { ROUNDTABLE_META, ROUNDTABLE_PATH } from "@/content/roundtable";
import Hero from "@/components/roundtable/Hero";
import Formats from "@/components/roundtable/Formats";
import Moderator from "@/components/roundtable/Moderator";
import About from "@/components/roundtable/About";
import WhyJoin from "@/components/roundtable/WhyJoin";
import CtaBand from "@/components/roundtable/CtaBand";
import InterestForm from "@/components/roundtable/InterestForm";

export const metadata: Metadata = {
  title: { absolute: ROUNDTABLE_META.title },
  description: ROUNDTABLE_META.description,
  alternates: { canonical: ROUNDTABLE_PATH },
  openGraph: {
    title: ROUNDTABLE_META.title,
    description: ROUNDTABLE_META.description,
    url: `${SITE_URL}${ROUNDTABLE_PATH}`,
    siteName: "Markoholics",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: ROUNDTABLE_META.title,
    description: ROUNDTABLE_META.description,
  },
};

export default function RoundtablePage() {
  return (
    <div className="bg-black">
      <Hero />
      <Formats />
      <Moderator />
      <About />
      <WhyJoin />
      <CtaBand />
      <InterestForm />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webPageJsonLd({
              name: ROUNDTABLE_META.title,
              description: ROUNDTABLE_META.description,
              path: ROUNDTABLE_PATH,
            })
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(roundtableEventSeriesJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Roundtable", path: ROUNDTABLE_PATH },
            ])
          ),
        }}
      />
    </div>
  );
}
