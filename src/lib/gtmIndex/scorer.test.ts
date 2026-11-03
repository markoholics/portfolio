import { describe, it, expect } from "vitest";
import { buildScoredReport, scoreBuyer, scorePath, scorePosition, scoreProof } from "@/lib/gtmIndex/scorer";
import { validateScoredReport } from "@/lib/gtmIndex/validate";
import type { EvidenceLedger } from "@/lib/gtmIndex/types";

function weakLedger(): EvidenceLedger {
  return {
    status: "ok",
    message: null,
    company_name: "Generic Co",
    company_domain: "genericco.com",
    pages_fetched: [{ url: "https://genericco.com", page_type: "homepage", result: "ok" }],
    social_access: [
      { channel: "linkedin", url: null, access: "not_provided", note: "" },
      { channel: "instagram", url: null, access: "not_provided", note: "" },
      { channel: "x", url: null, access: "not_provided", note: "" },
    ],
    above_the_fold: {
      headline: "A seamless, world-class platform",
      subheadline: "Cutting-edge solutions for everyone.",
      primary_cta: "Contact us",
      secondary_cta: null,
    },
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
    pricing_visibility: "not_found",
    conversion_paths: [{ label: "Contact us", type: "contact", where: "homepage" }],
    social_signals: [],
    search_findability: { own_name_results: "n/a", category_results: "n/a", third_party_descriptions: [] },
    competitors_seen: [],
    apparent_stage: { value: "unclear", basis: "no strong signal" },
    evidence: [{ id: "E1", source_url: "https://genericco.com", source_type: "homepage H1", observed: "Headline reads a seamless, world-class platform." }],
    not_checked: [],
  };
}

function strongLedger(): EvidenceLedger {
  return {
    status: "ok",
    message: null,
    company_name: "Acme Analytics",
    company_domain: "acmeanalytics.com",
    pages_fetched: [
      { url: "https://acmeanalytics.com", page_type: "homepage", result: "ok" },
      { url: "https://acmeanalytics.com/pricing", page_type: "pricing", result: "ok" },
      { url: "https://acmeanalytics.com/customers", page_type: "customers", result: "ok" },
    ],
    social_access: [
      { channel: "linkedin", url: "https://linkedin.com/company/acme", access: "partial", note: "og tags only" },
      { channel: "instagram", url: null, access: "not_provided", note: "" },
      { channel: "x", url: null, access: "not_provided", note: "" },
    ],
    above_the_fold: {
      headline: "Catch fraud in machine generated data before it costs you a chargeback",
      subheadline: "Built for risk teams at payment companies processing over a million events a day.",
      primary_cta: "Book a demo",
      secondary_cta: "See pricing",
    },
    category_language: [{ term: "Acme Analytics: Fraud detection for payments", where: "title tag", evidence_id: "E1" }],
    claims_made: [
      { claim: "unlike a generic database, Acme is built only for fraud signals.", where: "homepage", evidence_id: "E2" },
    ],
    proof_assets: {
      customer_logos: 8,
      case_studies: 4,
      named_testimonials: 3,
      quantified_outcomes: [{ outcome: "cut false positives by 40%", evidence_id: "E3" }],
      third_party_validation: [{ item: "Links to g2.com", evidence_id: "E4" }],
    },
    buyer_language: [
      { who_or_pain: "risk team", where: "homepage", evidence_id: "E5" },
      { who_or_pain: "fintech", where: "homepage", evidence_id: "E6" },
      { who_or_pain: "enterprise", where: "homepage", evidence_id: "E7" },
    ],
    pricing_visibility: "public",
    conversion_paths: [{ label: "Book a demo", type: "demo", where: "homepage" }],
    social_signals: [],
    search_findability: { own_name_results: "n/a", category_results: "n/a", third_party_descriptions: [] },
    competitors_seen: [],
    apparent_stage: { value: "growth", basis: "case study volume" },
    evidence: [
      { id: "E1", source_url: "https://acmeanalytics.com", source_type: "homepage title tag", observed: "Title tag reads Acme Analytics: Fraud detection for payments." },
      { id: "E2", source_url: "https://acmeanalytics.com", source_type: "page copy", observed: "Found comparison language." },
      { id: "E3", source_url: "https://acmeanalytics.com", source_type: "page copy", observed: "Found a quantified outcome claim." },
      { id: "E4", source_url: "https://acmeanalytics.com", source_type: "homepage links", observed: "Found a link to g2.com." },
      { id: "E5", source_url: "https://acmeanalytics.com", source_type: "page copy", observed: "Found the term risk team." },
      { id: "E6", source_url: "https://acmeanalytics.com", source_type: "page copy", observed: "Found the term fintech." },
      { id: "E7", source_url: "https://acmeanalytics.com", source_type: "page copy", observed: "Found the term enterprise." },
    ],
    not_checked: [],
  };
}

describe("individual pillar scorers", () => {
  it("scores Position lower when jargon-heavy and no differentiator claim exists", () => {
    const weak = scorePosition(weakLedger());
    const strong = scorePosition(strongLedger());
    expect(weak.rawScore).toBeLessThan(strong.rawScore);
  });

  it("scores Proof at the floor when no proof assets are found", () => {
    const { rawScore, observability } = scoreProof(weakLedger());
    expect(rawScore).toBeLessThanOrEqual(3);
    expect(observability).toBe("Low");
  });

  it("scores Buyer higher with more named role/industry/size hits", () => {
    expect(scoreBuyer(strongLedger()).rawScore).toBeGreaterThan(scoreBuyer(weakLedger()).rawScore);
  });

  it("penalises Path for a single, vague contact-only CTA with no pricing page", () => {
    const weak = scorePath(weakLedger());
    const strong = scorePath(strongLedger());
    expect(strong.rawScore).toBeGreaterThanOrEqual(weak.rawScore);
  });
});

describe("buildScoredReport", () => {
  it("produces an internally valid report for a strong ledger", () => {
    const ledger = strongLedger();
    const report = buildScoredReport(ledger);
    expect(report.status).toBe("ok");
    expect(report.index.score).toBeGreaterThan(0);
    expect(report.index.score).toBeLessThanOrEqual(100);
    const { valid, issues } = validateScoredReport(ledger, report);
    expect(valid, issues.join("; ")).toBe(true);
  });

  it("produces an internally valid report for a weak ledger, scoring it lower", () => {
    const strongReport = buildScoredReport(strongLedger());
    const weakReport = buildScoredReport(weakLedger());
    expect(weakReport.index.score).toBeLessThan(strongReport.index.score);
    const { valid } = validateScoredReport(weakLedger(), weakReport);
    expect(valid).toBe(true);
  });

  it("always marks Presence as provisional, since search visibility can't be checked", () => {
    const report = buildScoredReport(strongLedger());
    const presence = report.summary.pillars.find((p) => p.pillar === "Presence");
    expect(presence?.provisional).toBe(true);
  });

  it("marks all five positioning steps as needing founder input", () => {
    const report = buildScoredReport(strongLedger());
    expect(report.full_report.five_step_read).toHaveLength(5);
    expect(report.full_report.five_step_read.every((s) => s.needs_founder_input)).toBe(true);
  });

  it("passes through status insufficient_data without scoring", () => {
    const report = buildScoredReport({ ...weakLedger(), status: "insufficient_data", message: "Could not fetch." });
    expect(report.status).toBe("insufficient_data");
    expect(report.summary.pillars).toHaveLength(0);
  });
});
