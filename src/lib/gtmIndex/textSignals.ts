// Pure, deterministic text/markup analysis used by the zero-cost GTM
// Index scorer. Every function here takes already-fetched content and
// returns a concrete, checkable signal: no model call, no judgment call
// that can't be traced back to a specific word, count or element.
import type { CheerioAPI } from "cheerio";

export const JARGON_TERMS = [
  "seamless",
  "cutting-edge",
  "cutting edge",
  "next-generation",
  "next generation",
  "revolutionize",
  "revolutionary",
  "world-class",
  "best-in-class",
  "innovative",
  "disruptive",
  "game-changing",
  "game changer",
  "synergy",
  "synergies",
  "unlock",
  "leverage",
  "holistic",
  "end-to-end",
  "one-stop-shop",
  "turnkey",
  "robust",
  "paradigm",
  "state-of-the-art",
  "empowering",
  "empower",
  "unparalleled",
  "unrivaled",
  "transformative",
  "frictionless",
  "solutioning",
];

export const BUYER_ROLE_TERMS = [
  "founder",
  "ceo",
  "cto",
  "cmo",
  "coo",
  "head of growth",
  "head of marketing",
  "head of sales",
  "marketer",
  "marketing team",
  "engineer",
  "engineering team",
  "developer",
  "product manager",
  "sales team",
  "revops",
  "growth lead",
  "operator",
];

export const INDUSTRY_TERMS = [
  "saas",
  "fintech",
  "healthcare",
  "ecommerce",
  "e-commerce",
  "ai",
  "startups",
  "enterprise",
  "b2b",
  "b2c",
  "retail",
  "logistics",
  "manufacturing",
  "education",
  "edtech",
  "insurance",
  "real estate",
  "legal",
  "agencies",
  "developers",
];

export const COMPANY_SIZE_TERMS = [
  "enterprise",
  "smb",
  "small business",
  "startups",
  "mid-market",
  "teams of",
  "solopreneur",
  "freelancer",
];

const THIRD_PARTY_HOSTS = ["g2.com", "capterra.com", "trustpilot.com", "producthunt.com", "clutch.co"];

const NAV_LIKE_LABELS = new Set([
  "home",
  "about",
  "about us",
  "blog",
  "contact",
  "careers",
  "privacy",
  "terms",
  "login",
  "log in",
  "sign in",
]);

export function findKeywordHits(text: string, terms: string[]): string[] {
  const lower = text.toLowerCase();
  const found = new Set<string>();
  for (const term of terms) {
    if (lower.includes(term)) found.add(term);
  }
  return [...found];
}

export function countJargon(text: string): string[] {
  return findKeywordHits(text, JARGON_TERMS);
}

// A short, actionable, non-navigational link/button label is treated as a
// call to action. Dedupes by lowercased label so "Get started" appearing
// three times on a page counts once.
export function extractCtaLabels($: CheerioAPI): string[] {
  const labels = new Set<string>();
  $("a, button").each((_, el) => {
    const text = $(el).text().trim().replace(/\s+/g, " ");
    if (!text || text.length > 40) return;
    const lower = text.toLowerCase();
    if (NAV_LIKE_LABELS.has(lower)) return;
    const looksActionable = /^(get|book|sign|try|start|buy|contact|request|subscribe|download|schedule|talk|join|see|explore|learn)\b/i.test(
      text
    );
    if (looksActionable) labels.add(text);
  });
  return [...labels];
}

export function countTestimonials($: CheerioAPI): number {
  let count = $("blockquote").length;
  count += $('[class*="testimonial" i], [id*="testimonial" i], [class*="review" i]').length;
  return count;
}

export function countLogoLikeImages($: CheerioAPI): number {
  let count = 0;
  $('[class*="logo" i], [class*="client" i], [class*="customer" i], [class*="trusted" i], [class*="brand" i]').each(
    (_, el) => {
      count += $(el).find("img").length;
    }
  );
  return count;
}

export function findThirdPartyValidationLinks($: CheerioAPI, baseUrl: string): string[] {
  const found = new Set<string>();
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");
    if (!href) return;
    try {
      const resolved = new URL(href, baseUrl);
      const host = THIRD_PARTY_HOSTS.find((h) => resolved.hostname.endsWith(h));
      if (host) found.add(host);
    } catch {
      // ignore unparsable hrefs
    }
  });
  return [...found];
}

// Rough proxy for a quantified outcome claim: a percentage, a multiplier
// ("3x"), or a currency figure, each kept with a little surrounding
// context so a reader can judge for themselves whether it's a real claim.
export function findQuantifiedOutcomes(text: string): string[] {
  const pattern = /([^.]{0,40}(\d+(\.\d+)?\s?(%|x\b)|[$₹]\s?\d[\d,]*\+?)[^.]{0,40})/gi;
  const matches = text.match(pattern) ?? [];
  return matches.map((m) => m.trim()).slice(0, 10);
}

export function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}
