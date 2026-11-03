import { describe, it, expect } from "vitest";
import * as cheerio from "cheerio";
import {
  countJargon,
  countLogoLikeImages,
  countTestimonials,
  extractCtaLabels,
  findKeywordHits,
  findQuantifiedOutcomes,
  findThirdPartyValidationLinks,
  wordCount,
} from "@/lib/gtmIndex/textSignals";

describe("countJargon", () => {
  it("finds known generic phrases in text", () => {
    const hits = countJargon("We offer a seamless, cutting-edge, world-class platform.");
    expect(hits).toContain("seamless");
    expect(hits).toContain("cutting-edge");
    expect(hits).toContain("world-class");
  });

  it("returns an empty array for specific, jargon-free text", () => {
    expect(countJargon("We cut invoice processing time from 3 days to 15 minutes.")).toHaveLength(0);
  });

  it("dedupes repeated hits", () => {
    expect(countJargon("seamless seamless seamless")).toEqual(["seamless"]);
  });
});

describe("findKeywordHits", () => {
  it("is case insensitive and returns only matched terms", () => {
    const hits = findKeywordHits("Built for FOUNDERS and SaaS teams.", ["founder", "saas", "fintech"]);
    expect(hits.sort()).toEqual(["founder", "saas"]);
  });
});

describe("extractCtaLabels", () => {
  it("extracts actionable button and link labels, excluding nav-like ones", () => {
    const $ = cheerio.load(`
      <nav><a href="/about">About</a><a href="/">Home</a></nav>
      <a href="/start">Get started</a>
      <button>Book a demo</button>
      <a href="/pricing">Contact us</a>
    `);
    const labels = extractCtaLabels($);
    expect(labels).toContain("Get started");
    expect(labels).toContain("Book a demo");
    expect(labels).toContain("Contact us");
    expect(labels).not.toContain("About");
    expect(labels).not.toContain("Home");
  });

  it("dedupes identical labels", () => {
    const $ = cheerio.load(`<a href="/a">Get started</a><a href="/b">Get started</a>`);
    expect(extractCtaLabels($)).toEqual(["Get started"]);
  });
});

describe("countTestimonials", () => {
  it("counts blockquotes and testimonial-classed elements", () => {
    const $ = cheerio.load(`
      <blockquote>Great product.</blockquote>
      <div class="testimonial-card">Another quote.</div>
    `);
    expect(countTestimonials($)).toBe(2);
  });

  it("returns 0 when none are present", () => {
    const $ = cheerio.load(`<p>Just some copy.</p>`);
    expect(countTestimonials($)).toBe(0);
  });
});

describe("countLogoLikeImages", () => {
  it("counts images inside logo/client/customer styled containers", () => {
    const $ = cheerio.load(`
      <div class="client-logos"><img src="a.png" /><img src="b.png" /></div>
      <div class="hero"><img src="hero.png" /></div>
    `);
    expect(countLogoLikeImages($)).toBe(2);
  });
});

describe("findThirdPartyValidationLinks", () => {
  it("finds links to known review platforms", () => {
    const html = `<a href="https://www.g2.com/products/acme">G2</a><a href="https://acme.com/about">About</a>`;
    const $ = cheerio.load(html);
    expect(findThirdPartyValidationLinks($, "https://acme.com")).toEqual(["g2.com"]);
  });

  it("returns an empty array when no third party links exist", () => {
    const $ = cheerio.load(`<a href="/about">About</a>`);
    expect(findThirdPartyValidationLinks($, "https://acme.com")).toHaveLength(0);
  });
});

describe("findQuantifiedOutcomes", () => {
  it("finds percentage, multiplier and currency claims with context", () => {
    const hits = findQuantifiedOutcomes("We cut costs by 40%. Customers see 3x faster onboarding. Starting at $99.");
    expect(hits.some((h) => h.includes("40%"))).toBe(true);
    expect(hits.some((h) => h.includes("3x"))).toBe(true);
    expect(hits.some((h) => h.includes("$99"))).toBe(true);
  });

  it("returns an empty array when no quantified claims exist", () => {
    expect(findQuantifiedOutcomes("We help teams work better together.")).toHaveLength(0);
  });
});

describe("wordCount", () => {
  it("counts words, collapsing extra whitespace", () => {
    expect(wordCount("  Ship   faster   today  ")).toBe(3);
  });

  it("returns 0 for empty input", () => {
    expect(wordCount("")).toBe(0);
  });
});
