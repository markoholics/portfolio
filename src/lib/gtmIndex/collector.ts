// The zero-cost Evidence Collector: gathers the same evidence ledger
// shape the original AI version produced, but by fetching pages directly
// with plain HTTP and cheerio instead of an LLM with web_search/web_fetch
// tools. No API key, no per-run cost. Every entry in evidence[] is a
// concrete, checkable fact tied to a real fetched page, not a model's
// paraphrase of one.
import * as cheerio from "cheerio";
import { fetchPage } from "@/lib/gtmIndex/fetchPage";
import {
  countLogoLikeImages,
  countTestimonials,
  extractCtaLabels,
  findKeywordHits,
  findQuantifiedOutcomes,
  findThirdPartyValidationLinks,
  BUYER_ROLE_TERMS,
  COMPANY_SIZE_TERMS,
  INDUSTRY_TERMS,
} from "@/lib/gtmIndex/textSignals";
import type {
  EvidenceConversionPath,
  EvidenceItem,
  EvidenceLedger,
  EvidencePageFetched,
  EvidenceSocialAccess,
  GtmIndexAnalyzeInput,
} from "@/lib/gtmIndex/types";

const LINK_PRIORITIES: { type: EvidencePageFetched["page_type"]; patterns: RegExp }[] = [
  { type: "pricing", patterns: /\b(pricing|plans)\b/i },
  { type: "product", patterns: /\b(product|solutions|features|platform)\b/i },
  { type: "customers", patterns: /\b(customers|clients|case[- ]?stud(y|ies)|success[- ]?stor(y|ies))\b/i },
  { type: "about", patterns: /\b(about|team|company)\b/i },
  { type: "blog", patterns: /\b(blog|resources|insights)\b/i },
];

const PRICE_PATTERN = /[$₹€£]\s?\d|\d+\s?(usd|inr|eur|gbp|\/\s?mo|\/\s?month|\/\s?year)/i;
const CONTACT_ONLY_PATTERN = /\b(contact us|talk to sales|request a quote|get a quote|book a call)\b/i;

class EvidenceBuilder {
  private items: EvidenceItem[] = [];
  private counter = 1;

  add(sourceUrl: string, sourceType: string, observed: string): string {
    const id = `E${this.counter++}`;
    this.items.push({ id, source_url: sourceUrl, source_type: sourceType, observed });
    return id;
  }

  all(): EvidenceItem[] {
    return this.items;
  }
}

function visibleText($: cheerio.CheerioAPI): string {
  return $("body")
    .clone()
    .find("script, style, noscript")
    .remove()
    .end()
    .text()
    .replace(/\s+/g, " ")
    .trim();
}

function looksLikeJsShell(html: string, text: string): boolean {
  return text.length < 200 && /id=["']__next["']|id=["']root["']|<app-root/i.test(html);
}

// A real site's H1/paragraph DOM structure doesn't always match the
// "one heading, one lead paragraph" shape this scan assumes; cap length
// so a messy match still reads as a headline rather than a text dump.
function capLength(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text;
  return `${text.slice(0, maxChars).trim()}…`;
}

function resolveUrl(href: string, base: string): string | null {
  try {
    return new URL(href, base).toString();
  } catch {
    return null;
  }
}

function ctaType(label: string): EvidenceConversionPath["type"] {
  const lower = label.toLowerCase();
  if (/demo|schedule|talk to sales|book a call/.test(lower)) return "demo";
  if (/trial/.test(lower)) return "trial";
  if (/sign up|get started|start free|join/.test(lower)) return "self_serve";
  if (/waitlist|early access|join the list/.test(lower)) return "waitlist";
  if (/contact|talk to|request a quote/.test(lower)) return "contact";
  if (/download/.test(lower)) return "download";
  return "other";
}

export async function collectEvidence(input: GtmIndexAnalyzeInput): Promise<EvidenceLedger> {
  const evidence = new EvidenceBuilder();
  const pagesFetched: EvidencePageFetched[] = [];
  const notChecked: string[] = [
    "Search engine results, AI answer engine citations, and competitor discovery (this free scan does not query any search API).",
    "Anything that requires JavaScript to render (this is a plain HTTP fetch, not a browser).",
    "Authenticated or algorithm-gated content on social platforms.",
  ];

  const home = await fetchPage(input.companyUrl);
  pagesFetched.push({
    url: home.finalUrl,
    page_type: "homepage",
    result: home.ok && home.html ? "ok" : "failed",
  });

  if (!home.ok || !home.html) {
    return insufficientData(
      input,
      `We couldn't fetch ${input.companyUrl} (${home.error ?? "unknown error"}).`
    );
  }

  const $ = cheerio.load(home.html);
  const homeText = visibleText($);

  if (looksLikeJsShell(home.html, homeText)) {
    return insufficientData(
      input,
      "This site appears to render its content with JavaScript, which a plain HTTP fetch cannot read."
    );
  }

  const title = $("title").first().text().trim();
  const metaDescription = $('meta[name="description"]').attr("content")?.trim() ?? null;
  const h1 = $("h1").first().text().trim().replace(/\s+/g, " ");
  const firstParagraphNearH1 = $("h1").first().nextAll("p").first().text().trim() || $("p").first().text().trim();
  const ctaLabels = extractCtaLabels($);
  const companyNameGuess = title.split(/[|–—:-]/)[0].trim() || new URL(input.companyUrl).hostname;
  const companyDomain = new URL(home.finalUrl).hostname.replace(/^www\./, "");

  if (title) evidence.add(home.finalUrl, "homepage title tag", `Title tag reads "${title}".`);
  if (metaDescription)
    evidence.add(home.finalUrl, "homepage meta description", `Meta description reads "${metaDescription}".`);
  if (h1) evidence.add(home.finalUrl, "homepage H1", `Homepage H1 reads "${h1}".`);
  for (const label of ctaLabels.slice(0, 6)) {
    evidence.add(home.finalUrl, "homepage call to action", `Found a call to action labelled "${label}".`);
  }

  // Discover linked pages by priority, from real homepage links only.
  const linkedByType = new Map<EvidencePageFetched["page_type"], string>();
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");
    if (!href) return;
    const resolved = resolveUrl(href, home.finalUrl);
    if (!resolved || !resolved.startsWith(new URL(home.finalUrl).origin)) return;
    const label = `${$(el).text()} ${href}`;
    for (const { type, patterns } of LINK_PRIORITIES) {
      if (!linkedByType.has(type) && patterns.test(label)) linkedByType.set(type, resolved);
    }
  });

  const fetchedSecondary: { type: EvidencePageFetched["page_type"]; url: string; $: cheerio.CheerioAPI; text: string }[] = [];
  for (const [type, url] of linkedByType) {
    if (fetchedSecondary.length >= 5) break;
    const page = await fetchPage(url);
    pagesFetched.push({ url: page.finalUrl, page_type: type, result: page.ok && page.html ? "ok" : "failed" });
    if (page.ok && page.html) {
      const page$ = cheerio.load(page.html);
      fetchedSecondary.push({ type, url: page.finalUrl, $: page$, text: visibleText(page$) });
    }
  }
  for (const { type } of LINK_PRIORITIES) {
    if (!linkedByType.has(type)) notChecked.push(`No ${type} page was found linked from the homepage.`);
  }

  const allPagesForText = [{ $, text: homeText, url: home.finalUrl }, ...fetchedSecondary];
  const combinedText = allPagesForText.map((p) => p.text).join(" ");

  // Proof assets
  let customerLogos = countLogoLikeImages($);
  let namedTestimonials = countTestimonials($);
  for (const page of fetchedSecondary) {
    customerLogos += countLogoLikeImages(page.$);
    namedTestimonials += countTestimonials(page.$);
  }
  const customersPage = fetchedSecondary.find((p) => p.type === "customers");
  const caseStudyLinkCount = customersPage
    ? customersPage.$('a[href*="case" i], a[href*="customer" i], a[href*="story" i]').length
    : null;
  const quantifiedOutcomeStrings = findQuantifiedOutcomes(combinedText);
  const quantifiedOutcomes = quantifiedOutcomeStrings.map((outcome) => ({
    outcome,
    evidence_id: evidence.add(home.finalUrl, "page copy", `Found a quantified outcome claim: "${outcome}".`),
  }));
  const thirdPartyHosts = new Set<string>();
  for (const page of allPagesForText) {
    for (const host of findThirdPartyValidationLinks(page.$, page.url)) thirdPartyHosts.add(host);
  }
  const thirdPartyValidation = [...thirdPartyHosts].map((host) => ({
    item: `Links to ${host}`,
    evidence_id: evidence.add(home.finalUrl, "homepage links", `Found a link to a third party review site: ${host}.`),
  }));

  // Buyer language
  const buyerHits = findKeywordHits(combinedText, [...BUYER_ROLE_TERMS, ...INDUSTRY_TERMS, ...COMPANY_SIZE_TERMS]);
  const buyerLanguage = buyerHits.map((term) => ({
    who_or_pain: term,
    where: "homepage or linked page copy",
    evidence_id: evidence.add(home.finalUrl, "page copy", `Found the term "${term}" in the visible page copy.`),
  }));

  // Pricing visibility
  const pricingPage = fetchedSecondary.find((p) => p.type === "pricing");
  let pricingVisibility: EvidenceLedger["pricing_visibility"] = "not_found";
  if (pricingPage) {
    if (PRICE_PATTERN.test(pricingPage.text)) pricingVisibility = "public";
    else if (CONTACT_ONLY_PATTERN.test(pricingPage.text)) pricingVisibility = "contact_only";
    else pricingVisibility = "partial";
  }

  // Conversion paths
  const conversionPaths: EvidenceConversionPath[] = ctaLabels.slice(0, 6).map((label) => ({
    label,
    type: ctaType(label),
    where: "homepage",
  }));

  // Claims (comparison / differentiation language)
  const claimSentences = combinedText.match(/[^.]{0,20}(unlike|instead of|the only|built specifically for|no other)[^.]{0,80}\./gi) ?? [];
  const claimsMade = claimSentences.slice(0, 5).map((claim) => ({
    claim: claim.trim(),
    where: "homepage or linked page copy",
    evidence_id: evidence.add(home.finalUrl, "page copy", `Found comparison language: "${claim.trim()}".`),
  }));

  // Social access
  const socialInputs: { channel: EvidenceSocialAccess["channel"]; url?: string }[] = [
    { channel: "linkedin", url: input.linkedinUrl },
    { channel: "instagram", url: input.instagramUrl },
    { channel: "x", url: input.xUrl },
  ];
  const socialAccess: EvidenceSocialAccess[] = [];
  for (const { channel, url } of socialInputs) {
    if (!url) {
      socialAccess.push({ channel, url: null, access: "not_provided", note: "No URL was submitted for this channel." });
      continue;
    }
    const page = await fetchPage(url);
    if (!page.ok || !page.html) {
      socialAccess.push({
        channel,
        url,
        access: "blocked",
        note: "The platform returned an error or a login wall to an unauthenticated fetch.",
      });
      continue;
    }
    const social$ = cheerio.load(page.html);
    const ogTitle = social$('meta[property="og:title"]').attr("content");
    const ogDescription = social$('meta[property="og:description"]').attr("content");
    if (ogTitle || ogDescription) {
      if (ogTitle) evidence.add(url, `${channel} profile`, `Public profile title reads "${ogTitle}".`);
      if (ogDescription) evidence.add(url, `${channel} profile`, `Public profile description reads "${ogDescription}".`);
      socialAccess.push({ channel, url, access: "partial", note: "Only public profile metadata was readable." });
    } else {
      socialAccess.push({
        channel,
        url,
        access: "not_assessable",
        note: "The page loaded but exposed no readable public profile text.",
      });
    }
  }

  return {
    status: "ok",
    message: null,
    company_name: companyNameGuess,
    company_domain: companyDomain,
    pages_fetched: pagesFetched,
    social_access: socialAccess,
    above_the_fold: {
      headline: capLength(h1 || title || "Not found", 160),
      subheadline: firstParagraphNearH1 ? capLength(firstParagraphNearH1, 220) : null,
      primary_cta: ctaLabels[0] ?? null,
      secondary_cta: ctaLabels[1] ?? null,
    },
    category_language: [
      ...(title ? [{ term: title, where: "title tag", evidence_id: evidence.all()[0]?.id ?? "E1" }] : []),
    ],
    claims_made: claimsMade,
    proof_assets: {
      customer_logos: customerLogos || null,
      case_studies: caseStudyLinkCount,
      named_testimonials: namedTestimonials || null,
      quantified_outcomes: quantifiedOutcomes,
      third_party_validation: thirdPartyValidation,
    },
    buyer_language: buyerLanguage,
    pricing_visibility: pricingVisibility,
    conversion_paths: conversionPaths,
    social_signals: [],
    search_findability: {
      own_name_results: "Not checked: this free scan does not query search engines.",
      category_results: "Not checked: this free scan does not query search engines.",
      third_party_descriptions: [],
    },
    competitors_seen: [],
    apparent_stage: {
      value: /waitlist|coming soon|early access/i.test(combinedText) ? "pre_launch" : "unclear",
      basis: "Keyword match against the homepage and linked page copy only; this is a weak signal.",
    },
    evidence: evidence.all(),
    not_checked: [...notChecked, "Competitor framing and third-party descriptions (no search access)."],
  };
}

function insufficientData(input: GtmIndexAnalyzeInput, message: string): EvidenceLedger {
  const domain = (() => {
    try {
      return new URL(input.companyUrl).hostname.replace(/^www\./, "");
    } catch {
      return input.companyUrl;
    }
  })();
  return {
    status: "insufficient_data",
    message,
    company_name: domain,
    company_domain: domain,
    pages_fetched: [],
    social_access: [],
    above_the_fold: { headline: "", subheadline: null, primary_cta: null, secondary_cta: null },
    category_language: [],
    claims_made: [],
    proof_assets: {
      customer_logos: null,
      case_studies: null,
      named_testimonials: null,
      quantified_outcomes: [],
      third_party_validation: [],
    },
    buyer_language: [],
    pricing_visibility: "not_checked",
    conversion_paths: [],
    social_signals: [],
    search_findability: { own_name_results: "n/a", category_results: "n/a", third_party_descriptions: [] },
    competitors_seen: [],
    apparent_stage: { value: "unclear", basis: "Could not fetch the site." },
    evidence: [],
    not_checked: [],
  };
}
