import type { CaseStudy, FAQItem } from "@/lib/data";
import { services, socialLinks } from "@/lib/data";
import type { BlogPost } from "@/lib/blog";

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
      "Markoholics is an AI-native GTM agency for Series A-C SaaS, fintech, and AI startups — running strategy, content, and demand generation as one autonomous system.",
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

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Mohammad H. Rahman",
    url: absoluteUrl("/about#founder"),
    jobTitle: "Founder",
    worksFor: {
      "@type": "Organization",
      name: "Markoholics",
      url: SITE_URL,
    },
    alumniOf: "University of Sheffield",
    knowsAbout: [
      "Go-To-Market Strategy",
      "Digital Strategy",
      "Performance Marketing",
      "Brand Management",
    ],
    sameAs: ["https://in.linkedin.com/in/theotherrahman"],
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

export function blogPostJsonLd(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDescription,
    url: absoluteUrl(`/blog/${post.slug}`),
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    author: {
      "@type": "Person",
      name: post.author,
      url: absoluteUrl("/about#founder"),
      sameAs: "https://in.linkedin.com/in/theotherrahman",
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
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(`/blog/${post.slug}`),
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function reviewJsonLd({
  authorName,
  reviewBody,
}: {
  authorName: string;
  reviewBody: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "ProfessionalService",
      name: "Markoholics",
      url: SITE_URL,
    },
    author: {
      "@type": "Person",
      name: authorName,
    },
    reviewBody,
    publisher: {
      "@type": "Organization",
      name: "Markoholics",
      url: SITE_URL,
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
