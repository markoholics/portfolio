import { describe, it, expect } from "vitest";
import { validateScoredReport } from "@/lib/gtmIndex/validate";
import type { EvidenceLedger, ScoredReport } from "@/lib/gtmIndex/types";

function baseLedger(overrides: Partial<EvidenceLedger> = {}): EvidenceLedger {
  return {
    status: "ok",
    message: null,
    company_name: "Acme Corp",
    company_domain: "acme.com",
    pages_fetched: [{ url: "https://acme.com", page_type: "homepage", result: "ok" }],
    social_access: [],
    above_the_fold: {
      headline: "Ship faster",
      subheadline: null,
      primary_cta: "Get started",
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
    pricing_visibility: "not_checked",
    conversion_paths: [],
    social_signals: [],
    search_findability: { own_name_results: "n/a", category_results: "n/a", third_party_descriptions: [] },
    competitors_seen: [],
    apparent_stage: { value: "early", basis: "homepage copy" },
    evidence: [
      { id: "E1", source_url: "https://acme.com", source_type: "homepage", observed: "Headline reads Ship faster." },
      { id: "E2", source_url: "https://acme.com", source_type: "homepage", observed: "Primary CTA is Get started." },
    ],
    not_checked: [],
    ...overrides,
  };
}

function baseReport(overrides: Partial<ScoredReport> = {}): ScoredReport {
  const pillars = [
    { pillar: "Position", weight: 25, score: 5, provisional: false, one_line: "Decent frame." },
    { pillar: "Proof", weight: 20, score: 4, provisional: false, one_line: "Thin proof." },
    { pillar: "Buyer", weight: 15, score: 6, provisional: false, one_line: "Named buyer." },
    { pillar: "Message", weight: 15, score: 7, provisional: false, one_line: "Clear message." },
    { pillar: "Path", weight: 15, score: 5, provisional: false, one_line: "One CTA." },
    { pillar: "Presence", weight: 10, score: 3, provisional: false, one_line: "Scattered." },
  ];
  // Matches round(sum(score/10 * weight)) for the pillars above: 52.5 -> 53
  const score = Math.round(
    pillars.reduce((sum, p) => sum + (p.score / 10) * p.weight, 0)
  );

  return {
    status: "ok",
    message: null,
    company_name: "Acme Corp",
    company_domain: "acme.com",
    method_note: "Scored on public evidence only.",
    index: {
      score,
      band: "Partly Framed",
      provisional: false,
      primary_failure_pattern: "Proof Gap",
      secondary_failure_pattern: null,
    },
    summary: {
      headline_diagnosis: "The homepage leads with speed, not with the one thing competitors cannot claim.",
      two_sentence_test: {
        what_a_stranger_would_say: "A tool that helps teams ship faster.",
        verdict: "Partial",
        reason: "Category is clear, differentiation is not.",
      },
      pillars,
      top_findings: [
        { finding: "The headline names no specific buyer.", evidence_ids: ["E1"], confidence: "High" },
        { finding: "The CTA is generic.", evidence_ids: ["E2"], confidence: "Medium" },
      ],
      locked_preview: ["Full pillar breakdown", "Five step positioning read"],
    },
    full_report: {
      email_opening_line: "Your homepage is fast to load and clear about the category.",
      pillar_deep_dives: [],
      five_step_read: [],
      contradiction_scan: [],
      competitor_frame_check: null,
      frame_options: [],
      messaging_hypotheses: [],
      quick_wins: [],
      plan_30_60_90: { days_0_30: [], days_31_60: [], days_61_90: [] },
      what_we_cannot_see: ["Pipeline", "Conversion rates"],
      questions_for_the_founder: [],
      caveats: [],
    },
    internal: {
      icp_fit: "Medium",
      icp_fit_reasons: [],
      india_relevance: "Unclear",
      apparent_stage: "early",
      suggested_call_angle: "Ask about differentiation.",
      opening_questions: [],
      red_flags: [],
    },
    ...overrides,
  };
}

describe("validateScoredReport", () => {
  it("accepts a report whose evidence ids all exist and whose arithmetic matches", () => {
    const result = validateScoredReport(baseLedger(), baseReport());
    expect(result.valid).toBe(true);
    expect(result.issues).toHaveLength(0);
  });

  it("rejects a report that cites an evidence id missing from the ledger", () => {
    const report = baseReport();
    report.summary.top_findings[0].evidence_ids = ["E99"];
    const result = validateScoredReport(baseLedger(), report);
    expect(result.valid).toBe(false);
    expect(result.issues.some((i) => i.includes("E99"))).toBe(true);
  });

  it("rejects a report whose index score does not match the pillar arithmetic", () => {
    const report = baseReport({});
    report.index.score = 10;
    const result = validateScoredReport(baseLedger(), report);
    expect(result.valid).toBe(false);
    expect(result.issues.some((i) => i.includes("arithmetic"))).toBe(true);
  });

  it("rejects a report whose summary contains fix-style language", () => {
    const report = baseReport();
    report.summary.headline_diagnosis = "You should rewrite the headline to name a buyer.";
    const result = validateScoredReport(baseLedger(), report);
    expect(result.valid).toBe(false);
    expect(result.issues.some((i) => i.includes("fix-style"))).toBe(true);
  });

  it("always passes insufficient_data reports without checking fields that are null", () => {
    const report = baseReport({ status: "insufficient_data", message: "Could not reach the site." });
    const result = validateScoredReport(baseLedger(), report);
    expect(result.valid).toBe(true);
  });
});
