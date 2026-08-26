import type { CaseStudy, FAQItem } from "@/lib/data";
import { services, socialLinks } from "@/lib/data";

export const SITE_URL = "https://www.markoholics.com";

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path}`;
}

export function serviceName(slug: string): string {
  return services.find((s) => s.slug === slug)?.name ?? slug;
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Markoholics",
    legalName: "Creative Engineering Enterprises Private Limited",
    url: SITE_URL,
    logo: absoluteUrl("/icon.svg"),
    description:
      "AI-native GTM engines for Series A-C tech founders. Strategy, content, demand generation, and AI operations run as one autonomous system.",
    email: "markoholics@outlook.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "D NO 22, 4th Floor Vijaya, Bank Colony 6 Cross Road, Banaswadi, Bangalore North",
      addressLocality: "Bengaluru",
      addressRegion: "Karnataka",
      postalCode: "560043",
      addressCountry: "IN",
    },
    areaServed: ["United States", "United Kingdom", "Singapore", "United Arab Emirates", "India"],
    priceRange: "$500-$6,500",
    founder: {
      "@type": "Person",
      name: "Mohammad H. Rahman",
      sameAs: "https://in.linkedin.com/in/theotherrahman",
    },
    knowsAbout: [
      "Go-To-Market Strategy",
      "B2B SaaS Growth Marketing",
      "AI Workflow Optimization",
      "Demand Generation",
      "Performance Marketing",
      "Content Marketing",
    ],
    sameAs: socialLinks.map((s) => s.href),
  };
}

export function faqJsonLd(items: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export function webPageJsonLd({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url: absoluteUrl(path),
    isPartOf: {
      "@type": "WebSite",
      name: "Markoholics",
      url: SITE_URL,
    },
  };
}

export function caseStudyJsonLd(cs: CaseStudy) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${cs.name} Case Study`,
    description: `How Markoholics built the growth engine for ${cs.name}: ${cs.oneLiner}`,
    url: absoluteUrl(`/work/${cs.slug}`),
    about: cs.sector,
    author: {
      "@type": "Organization",
      name: "Markoholics",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Markoholics",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/icon.svg"),
      },
    },
  };
}

export function caseStudyFaqItems(cs: CaseStudy): FAQItem[] {
  return [
    {
      q: `What GTM challenge did ${cs.name} face?`,
      a: cs.challenge,
    },
    {
      q: `What results did ${cs.name} achieve working with Markoholics?`,
      a: cs.results.map((r) => `${r.value} ${r.label.toLowerCase()}`).join(", ") + ".",
    },
    {
      q: `Which Markoholics services were used for ${cs.name}?`,
      a: `${cs.name} used ${cs.servicesUsed.map(serviceName).join(", ")} to build and run its growth engine.`,
    },
  ];
}
