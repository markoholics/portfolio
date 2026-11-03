// Validates a Call 2 (Index Analyst) output against the evidence ledger
// Call 1 produced, per the prompt pack's build note #1: reject and retry
// once if any cited evidence ID is missing, the pillar arithmetic does not
// reproduce the index score, or the summary contains fix-style language.
// This is what keeps the audit credible: it cannot score, or recommend,
// what the ledger never observed.
import type { EvidenceLedger, PillarName, ScoredReport } from "@/lib/gtmIndex/types";

const PILLAR_WEIGHTS: Record<PillarName, number> = {
  Position: 25,
  Proof: 20,
  Buyer: 15,
  Message: 15,
  Path: 15,
  Presence: 10,
};

// Phrases that belong in full_report (fixes, rewrites, plans) and never in
// summary (observation and diagnosis only), per rule 7 in the prompt pack.
const FIX_LANGUAGE_PATTERNS = [
  /\bwe recommend\b/i,
  /\byou should\b/i,
  /\btry (?:changing|adding|using|rewriting)\b/i,
  /\bconsider (?:changing|adding|rewriting)\b/i,
  /\brewrite\b/i,
  /\badd a\b/i,
  /\bchange (?:the|your)\b/i,
  /\bfix (?:the|this|your)\b/i,
  /\bnext step(?:s)? (?:is|are) to\b/i,
];

export interface ValidationResult {
  valid: boolean;
  issues: string[];
}

function collectEvidenceIds(value: unknown, into: Set<string>): void {
  if (Array.isArray(value)) {
    for (const item of value) collectEvidenceIds(item, into);
    return;
  }
  if (value && typeof value === "object") {
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      if ((key === "evidence_id" || key === "evidence_ids") && val) {
        if (Array.isArray(val)) {
          for (const id of val) if (typeof id === "string") into.add(id);
        } else if (typeof val === "string") {
          into.add(val);
        }
      } else {
        collectEvidenceIds(val, into);
      }
    }
  }
}

function checkEvidenceIds(ledger: EvidenceLedger, report: ScoredReport, issues: string[]): void {
  const knownIds = new Set(ledger.evidence.map((e) => e.id));
  const citedIds = new Set<string>();
  collectEvidenceIds(report.summary, citedIds);
  collectEvidenceIds(report.full_report, citedIds);

  const missing = [...citedIds].filter((id) => !knownIds.has(id));
  if (missing.length > 0) {
    issues.push(
      `Cited evidence id(s) not present in the ledger: ${missing.slice(0, 10).join(", ")}.`
    );
  }
}

function checkArithmetic(report: ScoredReport, issues: string[]): void {
  const pillars = report.summary?.pillars ?? [];
  const scored = pillars.filter((p) => typeof p.score === "number");
  if (scored.length === 0) return;

  const totalWeight = scored.reduce((sum, p) => sum + p.weight, 0);
  if (totalWeight === 0) return;

  const weightedSum = scored.reduce((sum, p) => sum + ((p.score as number) / 10) * p.weight, 0);
  // Redistribute proportionally across only the pillars that were scored,
  // mirroring the prompt's own redistribution rule for a null pillar.
  const normalized = (weightedSum / totalWeight) * 100;
  const expected = Math.round(normalized);

  if (Math.abs(expected - report.index.score) > 1) {
    issues.push(
      `Index score (${report.index.score}) does not match the pillar arithmetic (expected approximately ${expected}).`
    );
  }

  for (const pillar of pillars) {
    const expectedWeight = PILLAR_WEIGHTS[pillar.pillar as PillarName];
    if (expectedWeight !== undefined && pillar.weight !== expectedWeight) {
      issues.push(`Pillar "${pillar.pillar}" has weight ${pillar.weight}, expected ${expectedWeight}.`);
    }
  }
}

function checkFixLanguage(report: ScoredReport, issues: string[]): void {
  const summaryStrings: string[] = [
    report.summary?.headline_diagnosis ?? "",
    report.summary?.two_sentence_test?.reason ?? "",
    ...(report.summary?.pillars ?? []).map((p) => p.one_line),
    ...(report.summary?.top_findings ?? []).map((f) => f.finding),
  ];

  for (const text of summaryStrings) {
    for (const pattern of FIX_LANGUAGE_PATTERNS) {
      if (pattern.test(text)) {
        issues.push(`Summary contains fix-style language ("${text.slice(0, 80)}...").`);
        return;
      }
    }
  }
}

export function validateScoredReport(ledger: EvidenceLedger, report: ScoredReport): ValidationResult {
  if (report.status === "insufficient_data") {
    return { valid: true, issues: [] };
  }

  const issues: string[] = [];
  checkEvidenceIds(ledger, report, issues);
  checkArithmetic(report, issues);
  checkFixLanguage(report, issues);

  return { valid: issues.length === 0, issues };
}
