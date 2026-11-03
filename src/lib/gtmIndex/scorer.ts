// The zero-cost Index Analyst: scores an EvidenceLedger into a
// ScoredReport using fixed, deterministic rules instead of a model's
// judgment. Every score traces to a concrete count or keyword match from
// the ledger, not an inference. This is a genuinely different, shallower
// tool than the AI version: it cannot judge whether a strength is "what
// the category gets judged on", cannot find competitors, and cannot
// write a bespoke diagnosis. What it can do, honestly and for free, is
// count what is actually on the page and flag concrete gaps.
import { countJargon, wordCount } from "@/lib/gtmIndex/textSignals";
import type {
  EvidenceLedger,
  FailurePattern,
  FiveStepReadItem,
  IndexBand,
  PillarDeepDive,
  PillarName,
  PillarSummary,
  QuickWin,
  ScoredReport,
} from "@/lib/gtmIndex/types";

export const PILLAR_WEIGHTS: Record<PillarName, number> = {
  Position: 25,
  Proof: 20,
  Buyer: 15,
  Message: 15,
  Path: 15,
  Presence: 10,
};

interface PillarRaw {
  pillar: PillarName;
  rawScore: number;
  observability: "High" | "Medium" | "Low";
}

function clamp(value: number, min = 0, max = 10): number {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function applyObservabilityCap(raw: PillarRaw): { score: number; provisional: boolean } {
  if (raw.observability === "Low") {
    return { score: Math.min(raw.rawScore, 7), provisional: true };
  }
  return { score: raw.rawScore, provisional: false };
}

export function scorePosition(ledger: EvidenceLedger): PillarRaw {
  const jargon = countJargon(`${ledger.above_the_fold.headline} ${ledger.above_the_fold.subheadline ?? ""}`);
  let score = 5;
  if (ledger.claims_made.length > 0) score += 3;
  if (jargon.length === 0) score += 1;
  if (jargon.length >= 3) score -= 2;
  if (!ledger.above_the_fold.headline || wordCount(ledger.above_the_fold.headline) < 3) score -= 2;
  return { pillar: "Position", rawScore: clamp(score), observability: "Low" };
}

export function scoreProof(ledger: EvidenceLedger): PillarRaw {
  const logos = ledger.proof_assets.customer_logos ?? 0;
  const testimonials = ledger.proof_assets.named_testimonials ?? 0;
  const quantified = ledger.proof_assets.quantified_outcomes.length;
  const thirdParty = ledger.proof_assets.third_party_validation.length;
  let score = 2;
  if (logos > 0) score += 2;
  if (logos >= 5) score += 1;
  if (testimonials > 0) score += 2;
  if (quantified > 0) score += 2;
  if (thirdParty > 0) score += 1;
  const foundNothing = logos + testimonials + quantified + thirdParty === 0;
  return { pillar: "Proof", rawScore: clamp(score), observability: foundNothing ? "Low" : "Medium" };
}

export function scoreBuyer(ledger: EvidenceLedger): PillarRaw {
  const hits = ledger.buyer_language.length;
  let score: number;
  if (hits === 0) score = 2;
  else if (hits <= 2) score = 5;
  else if (hits <= 5) score = 7;
  else score = 9;
  return { pillar: "Buyer", rawScore: clamp(score), observability: hits === 0 ? "Low" : "Medium" };
}

export function scoreMessage(ledger: EvidenceLedger): PillarRaw {
  const headline = ledger.above_the_fold.headline;
  const subheadline = ledger.above_the_fold.subheadline;
  const jargon = countJargon(`${headline} ${subheadline ?? ""}`);
  let score = 7;
  score -= Math.min(jargon.length, 4);
  if (!headline) score = 1;
  return {
    pillar: "Message",
    rawScore: clamp(score),
    observability: subheadline ? "Medium" : "Low",
  };
}

export function scorePath(ledger: EvidenceLedger): PillarRaw {
  const ctaCount = ledger.conversion_paths.length;
  let score: number;
  if (ctaCount === 0) score = 1;
  else if (ctaCount === 1) score = 8;
  else if (ctaCount === 2) score = 6;
  else score = 4;
  if (ledger.pricing_visibility === "public") score += 1;
  if (ledger.pricing_visibility === "not_found") score -= 1;
  return { pillar: "Path", rawScore: clamp(score), observability: "High" };
}

export function scorePresence(ledger: EvidenceLedger): PillarRaw {
  const socialProvided = ledger.social_access.filter((a) => a.access !== "not_provided").length;
  const socialReadable = ledger.social_access.filter((a) => a.access === "full" || a.access === "partial").length;
  const blogFound = ledger.pages_fetched.some((p) => p.page_type === "blog" && p.result === "ok");
  let score = 2;
  if (socialProvided > 0) score += 1;
  if (socialReadable > 0) score += 2;
  if (blogFound) score += 2;
  // Always Low observability: this pillar's rubric is about search and
  // category discoverability, which a scan with no search API cannot
  // assess at all, so every Presence score here is capped and flagged.
  return { pillar: "Presence", rawScore: clamp(score), observability: "Low" };
}

function allPillars(ledger: EvidenceLedger): PillarRaw[] {
  return [
    scorePosition(ledger),
    scoreProof(ledger),
    scoreBuyer(ledger),
    scoreMessage(ledger),
    scorePath(ledger),
    scorePresence(ledger),
  ];
}

function bandFor(score: number): IndexBand {
  if (score >= 80) return "Category Led";
  if (score >= 60) return "Framed";
  if (score >= 40) return "Partly Framed";
  return "Default Positioned";
}

const PATTERN_BY_PILLAR: Record<PillarName, FailurePattern> = {
  Position: "Origin Market Trap",
  Proof: "Proof Gap",
  Buyer: "Everyone Pitch",
  Message: "Message Drift",
  Path: "Dead End Path",
  Presence: "Low Signal",
};

function pillarOneLine(pillar: PillarName, ledger: EvidenceLedger): string {
  switch (pillar) {
    case "Position": {
      const jargon = countJargon(`${ledger.above_the_fold.headline} ${ledger.above_the_fold.subheadline ?? ""}`);
      return `${ledger.claims_made.length} differentiator phrase(s) and ${jargon.length} generic phrase(s) found above the fold.`;
    }
    case "Proof": {
      const { customer_logos, named_testimonials, quantified_outcomes } = ledger.proof_assets;
      return `${customer_logos ?? 0} logo(s), ${named_testimonials ?? 0} testimonial(s), ${quantified_outcomes.length} quantified claim(s) found.`;
    }
    case "Buyer":
      return `${ledger.buyer_language.length} named role, industry or size term(s) found in the page copy.`;
    case "Message": {
      const jargon = countJargon(`${ledger.above_the_fold.headline} ${ledger.above_the_fold.subheadline ?? ""}`);
      return `Headline is ${wordCount(ledger.above_the_fold.headline)} words with ${jargon.length} generic phrase(s).`;
    }
    case "Path":
      return `${ledger.conversion_paths.length} distinct call(s) to action found; pricing is ${ledger.pricing_visibility.replace("_", " ")}.`;
    case "Presence":
      return `${ledger.social_access.filter((a) => a.access !== "not_provided").length} social channel(s) submitted; search visibility was not checked.`;
  }
}

function pillarDiagnosis(pillar: PillarName, ledger: EvidenceLedger, score: number): string {
  const line = pillarOneLine(pillar, ledger);
  if (pillar === "Position") {
    return ledger.claims_made.length > 0
      ? `${line} At least one comparison or differentiation claim is present, which is the raw material of a deliberate frame, but this scan cannot judge whether that strength is what your chosen category actually gets judged on.`
      : `${line} No comparison or differentiation language was found above the fold, which usually means the page leads with a category label rather than a specific reason to choose you over the default option in that category.`;
  }
  if (pillar === "Proof") {
    return score <= 3
      ? `${line} Nothing a sceptical visitor could independently verify was found on the homepage or the linked customer page.`
      : `${line} Some verifiable proof exists, though this scan cannot judge whether it is specific, named and relevant to the buyer the company says it serves.`;
  }
  if (pillar === "Buyer") {
    return ledger.buyer_language.length === 0
      ? `${line} No named role, industry or company size appears in the visible copy, which reads as speaking to everyone rather than a specific buyer in a specific situation.`
      : `${line} This scan can only confirm the terms appear; it cannot confirm they describe a specific situation with a recognisable trigger.`;
  }
  if (pillar === "Message") {
    return `${line} This is a mechanical word and jargon count, not a judgment of whether a stranger could repeat the two sentence test accurately.`;
  }
  if (pillar === "Path") {
    return ledger.conversion_paths.length === 0
      ? `${line} No call to action was detected at all on the homepage.`
      : ledger.conversion_paths.length > 2
      ? `${line} More than two competing calls to action can leave a visitor unsure which step to take.`
      : `${line}`;
  }
  return `${line} This pillar's rubric is built around search and category discoverability, which this free scan has no way to check without a search API, so the score here rests only on what was submitted and directly fetched.`;
}

function whatWouldRaiseScore(pillar: PillarName, ledger: EvidenceLedger): string {
  switch (pillar) {
    case "Position":
      return "Add a sentence above the fold naming the one thing you do that a named competitor cannot honestly claim.";
    case "Proof":
      return "Add a named customer testimonial, a logo strip, or a quantified outcome a sceptical visitor could check.";
    case "Buyer":
      return "Name a specific role, industry or company size in the headline or subheadline, not a general audience.";
    case "Message":
      return "Cut generic phrases from the headline and subheadline and replace them with the specific outcome you deliver.";
    case "Path":
      return ledger.conversion_paths.length === 0
        ? "Add one clear, visible call to action above the fold."
        : "Reduce to one primary call to action, with at most one lower-commitment alternative.";
    case "Presence":
      return "Submit LinkedIn, Instagram and X URLs with public, readable profile content, and publish on a visible blog or resources section.";
  }
}

function pickPrimaryPattern(scored: { pillar: PillarName; score: number }[], indexScore: number): {
  primary: FailurePattern;
  secondary: FailurePattern | null;
} {
  if (indexScore >= 80) {
    const lowest = [...scored].sort((a, b) => a.score - b.score)[0];
    return { primary: "Category Led", secondary: PATTERN_BY_PILLAR[lowest.pillar] };
  }
  const sorted = [...scored].sort((a, b) => {
    if (a.score !== b.score) return a.score - b.score;
    return PILLAR_WEIGHTS[b.pillar] - PILLAR_WEIGHTS[a.pillar];
  });
  return { primary: PATTERN_BY_PILLAR[sorted[0].pillar], secondary: null };
}

function buildQuickWins(ledger: EvidenceLedger, ids: Record<PillarName, string[]>): QuickWin[] {
  const wins: QuickWin[] = [];
  if (ledger.pricing_visibility === "not_found") {
    wins.push({
      action: "Add a dedicated pricing page, even if it only shows a starting price or a range.",
      pillar: "Path",
      effort: "Low",
      why_this_first: "No pricing page was found at all, which forces every visitor into a sales conversation before they know if they're in range.",
      evidence_ids: ids.Path,
    });
  }
  if (ledger.conversion_paths.length >= 3) {
    wins.push({
      action: "Reduce the homepage to one primary call to action.",
      pillar: "Path",
      effort: "Low",
      why_this_first: `${ledger.conversion_paths.length} competing calls to action were found, which forces a visitor to choose instead of act.`,
      evidence_ids: ids.Path,
    });
  }
  if ((ledger.proof_assets.named_testimonials ?? 0) === 0) {
    wins.push({
      action: "Add at least one named, specific customer testimonial.",
      pillar: "Proof",
      effort: "Medium",
      why_this_first: "No testimonial was found on the homepage or the linked customer page.",
      evidence_ids: ids.Proof,
    });
  }
  if (ledger.proof_assets.quantified_outcomes.length === 0) {
    wins.push({
      action: "Add one quantified outcome a prospect could verify or ask about.",
      pillar: "Proof",
      effort: "Medium",
      why_this_first: "No specific number, percentage or result was found anywhere in the fetched pages.",
      evidence_ids: ids.Proof,
    });
  }
  if (ledger.buyer_language.length === 0) {
    wins.push({
      action: "Name a specific buyer role, industry or company size above the fold.",
      pillar: "Buyer",
      effort: "Low",
      why_this_first: "The copy names no specific audience, which reads as speaking to everyone.",
      evidence_ids: ids.Buyer,
    });
  }
  if (ledger.proof_assets.third_party_validation.length === 0) {
    wins.push({
      action: "Link to at least one third party review site (G2, Capterra, Trustpilot, Clutch).",
      pillar: "Proof",
      effort: "Low",
      why_this_first: "No third party validation link was found.",
      evidence_ids: ids.Proof,
    });
  }
  return wins.slice(0, 5);
}

function buildFiveStepRead(): FiveStepReadItem[] {
  const steps: { step: number; step_name: string; note: string }[] = [
    { step: 1, step_name: "Let go of the origin story", note: "Only you know whether your current category label is the one you started with out of habit, or a deliberate choice." },
    { step: 2, step_name: "Isolate what is genuinely unique", note: "This depends on internal facts (your model, your data, your process) a public page scan cannot see." },
    { step: 3, step_name: "Translate uniqueness into customer value", note: "This depends on what your uniqueness lets specific customers do, which is not observable from outside." },
    { step: 4, step_name: "Find who feels that value most", note: "This depends on your own win and loss data, not on anything visible on a public page." },
    { step: 5, step_name: "Choose the market frame of reference", note: "This is the step this scan can least support: picking the right frame is a judgment call, not a count." },
  ];
  return steps.map((s) => ({
    step: s.step,
    step_name: s.step_name,
    inference: s.note,
    confidence: "Low",
    needs_founder_input: true,
    evidence_ids: [],
  }));
}

export function buildScoredReport(ledger: EvidenceLedger): ScoredReport {
  if (ledger.status === "insufficient_data") {
    return {
      status: "insufficient_data",
      message: ledger.message,
      company_name: ledger.company_name,
      company_domain: ledger.company_domain,
      method_note: "",
      index: { score: 0, band: "Default Positioned", provisional: true, primary_failure_pattern: "", secondary_failure_pattern: null },
      summary: {
        headline_diagnosis: "",
        two_sentence_test: { what_a_stranger_would_say: "", verdict: "Fail", reason: "" },
        pillars: [],
        top_findings: [],
        locked_preview: [],
      },
      full_report: {
        email_opening_line: "",
        pillar_deep_dives: [],
        five_step_read: [],
        contradiction_scan: [],
        competitor_frame_check: null,
        frame_options: [],
        messaging_hypotheses: [],
        quick_wins: [],
        plan_30_60_90: { days_0_30: [], days_31_60: [], days_61_90: [] },
        what_we_cannot_see: [],
        questions_for_the_founder: [],
        caveats: [],
      },
      internal: {
        icp_fit: "Low",
        icp_fit_reasons: [],
        india_relevance: "Unclear",
        apparent_stage: "unclear",
        suggested_call_angle: "",
        opening_questions: [],
        red_flags: [],
      },
    };
  }

  const raws = allPillars(ledger);
  const applied = raws.map((r) => ({ pillar: r.pillar, ...applyObservabilityCap(r) }));
  // All six pillars are always scored by this deterministic version (no
  // pillar is ever left null), so the weights already sum to 100 and no
  // redistribution is needed; this mirrors the original pack's formula
  // for the common case where every pillar was assessed.
  const weightedSum = applied.reduce((sum, p) => sum + (p.score / 10) * PILLAR_WEIGHTS[p.pillar], 0);
  const indexScore = Math.round(weightedSum);
  const band = bandFor(indexScore);
  const provisionalPillars = applied.filter((p) => p.provisional);
  const indexProvisional =
    provisionalPillars.some((p) => PILLAR_WEIGHTS[p.pillar] >= 20) || provisionalPillars.length >= 2;

  const { primary, secondary } = pickPrimaryPattern(applied, indexScore);

  const evidenceIdsByPillar: Record<PillarName, string[]> = {
    Position: ledger.claims_made.map((c) => c.evidence_id),
    Proof: [
      ...ledger.proof_assets.quantified_outcomes.map((q) => q.evidence_id),
      ...ledger.proof_assets.third_party_validation.map((t) => t.evidence_id),
    ],
    Buyer: ledger.buyer_language.map((b) => b.evidence_id),
    Message: ledger.evidence.filter((e) => e.source_type.includes("headline") || e.source_type.includes("H1")).map((e) => e.id),
    Path: ledger.evidence.filter((e) => e.source_type.includes("call to action")).map((e) => e.id),
    Presence: [],
  };

  const pillars: PillarSummary[] = applied.map((p) => ({
    pillar: p.pillar,
    weight: PILLAR_WEIGHTS[p.pillar],
    score: p.score,
    provisional: p.provisional,
    one_line: pillarOneLine(p.pillar, ledger),
  }));

  const pillarDeepDives: PillarDeepDive[] = applied.map((p) => ({
    pillar: p.pillar,
    score: p.score,
    anchor_reached: p.score <= 3 ? "Low" : p.score <= 6 ? "Mid" : "High",
    diagnosis: pillarDiagnosis(p.pillar, ledger, p.score),
    evidence_ids: evidenceIdsByPillar[p.pillar],
    what_would_raise_the_score: whatWouldRaiseScore(p.pillar, ledger),
  }));

  const sortedLowest = [...applied].sort((a, b) => a.score - b.score);
  const lowestPillar = sortedLowest[0];

  const jargonHits = countJargon(`${ledger.above_the_fold.headline} ${ledger.above_the_fold.subheadline ?? ""}`);
  const twoSentence = [ledger.above_the_fold.headline, ledger.above_the_fold.subheadline].filter(Boolean).join(". ");
  const twoSentenceVerdict: "Pass" | "Partial" | "Fail" = !ledger.above_the_fold.headline
    ? "Fail"
    : jargonHits.length === 0 && ledger.above_the_fold.subheadline
    ? "Pass"
    : "Partial";

  const topFindings = [
    {
      finding: `The biggest constraint is ${primary}, concentrated in the ${lowestPillar.pillar} pillar (${lowestPillar.score}/10).`,
      evidence_ids: evidenceIdsByPillar[lowestPillar.pillar].slice(0, 3),
      confidence: "High" as const,
    },
    {
      finding:
        jargonHits.length > 0
          ? `The headline or subheadline uses ${jargonHits.length} generic phrase(s): ${jargonHits.slice(0, 3).join(", ")}.`
          : "No generic marketing jargon was detected above the fold.",
      evidence_ids: ledger.evidence.filter((e) => e.source_type.includes("H1") || e.source_type.includes("meta")).map((e) => e.id).slice(0, 2),
      confidence: "High" as const,
    },
    {
      finding: `Pricing is ${ledger.pricing_visibility.replace("_", " ")}, with ${ledger.conversion_paths.length} call(s) to action on the homepage.`,
      evidence_ids: evidenceIdsByPillar.Path.slice(0, 2),
      confidence: "High" as const,
    },
  ];

  const quickWins = buildQuickWins(ledger, evidenceIdsByPillar);
  const plan = {
    days_0_30: quickWins.filter((w) => w.effort === "Low").map((w) => w.action),
    days_31_60: quickWins.filter((w) => w.effort === "Medium").map((w) => w.action),
    days_61_90: [
      "Work through the five step positioning exercise (markoholics.com/blog/product-positioning-exercise) to settle steps two through five, which this scan cannot answer for you.",
    ],
  };

  const messagingHypotheses = jargonHits.slice(0, 3).map((term) => ({
    where: "Homepage headline or subheadline",
    current: `Uses the phrase "${term}".`,
    hypothesis_to_test: `Replace "${term}" with a specific, concrete outcome your product delivers.`,
    reasoning: "A generic phrase doesn't differentiate: a competitor could put the same word on their own homepage.",
    evidence_ids: ledger.evidence.filter((e) => e.observed.toLowerCase().includes(term)).map((e) => e.id).slice(0, 1),
  }));

  const report: ScoredReport = {
    status: "ok",
    message: null,
    company_name: ledger.company_name,
    company_domain: ledger.company_domain,
    method_note:
      "Scored by the free, zero-cost Markoholics GTM Index: direct, rule-based checks against your public pages, not an AI reading of them. Provisional where a pillar's rubric needs information this scan cannot observe.",
    index: {
      score: indexScore,
      band,
      provisional: indexProvisional,
      primary_failure_pattern: primary,
      secondary_failure_pattern: secondary,
    },
    summary: {
      headline_diagnosis: `${ledger.company_name}'s biggest constraint right now is ${primary.toLowerCase()}, centred on the ${lowestPillar.pillar} pillar.`,
      two_sentence_test: {
        what_a_stranger_would_say: twoSentence || "Not enough above-the-fold copy was found to run this test.",
        verdict: twoSentenceVerdict,
        reason:
          twoSentenceVerdict === "Pass"
            ? "A clear headline and subheadline were found with no detected generic phrases."
            : twoSentenceVerdict === "Fail"
            ? "No usable headline was found."
            : `A headline was found, but ${jargonHits.length > 0 ? "it uses generic phrasing" : "no subheadline was found to complete the test"}.`,
      },
      pillars,
      top_findings: topFindings,
      locked_preview: [
        "Full pillar breakdown with every signal detected, page by page",
        "Specific quick wins ranked by effort",
        "A 30, 60 and 90 day action plan",
        "Exactly what this free scan could not check",
        "The five positioning questions worth answering before spending on GTM",
      ],
    },
    full_report: {
      email_opening_line: `I ran ${ledger.company_name} through the free Markoholics GTM Index. Here is exactly what your public pages show, and what they don't.`,
      pillar_deep_dives: pillarDeepDives,
      five_step_read: buildFiveStepRead(),
      contradiction_scan: [],
      competitor_frame_check: null,
      frame_options: [],
      messaging_hypotheses: messagingHypotheses,
      quick_wins: quickWins,
      plan_30_60_90: plan,
      what_we_cannot_see: [
        "Pipeline, conversion rates and win/loss reasons.",
        "Sales call content and how prospects actually object.",
        "Product usage data.",
        "Pricing negotiations and actual deal sizes.",
        "Search engine results, AI answer engine citations, and named competitors (this free scan has no search access).",
        ...ledger.not_checked,
      ],
      questions_for_the_founder: [
        "What specific capability do you have that no competitor could honestly claim?",
        "Which customers get disproportionate value from that capability, not just some value?",
        "If you described this company in a market that is not where the idea started, what market would make your strength obvious?",
        "What would a sceptical prospect need to see before they believed your biggest claim?",
        "Where does your own team describe the company differently than the website does?",
      ],
      caveats: [
        "This is the free, zero-cost GTM Index: direct rule-based checks against your public pages, not an AI reading or judging them.",
        "No competitor discovery or search-engine visibility check was performed; this scan has no search access.",
        "Alternative market frame suggestions are intentionally left out here rather than filled with generic advice that could apply to any company.",
      ],
    },
    internal: {
      icp_fit: lowestPillar.score <= 3 && ledger.proof_assets.named_testimonials ? "Medium" : "Low",
      icp_fit_reasons: [`Apparent stage: ${ledger.apparent_stage.value}.`, `Lowest pillar: ${lowestPillar.pillar} at ${lowestPillar.score}/10.`],
      india_relevance: ledger.company_domain.endsWith(".in") ? "Evident" : "Unclear",
      apparent_stage: ledger.apparent_stage.value,
      suggested_call_angle: `Lead with ${primary}: ${quickWins[0]?.action ?? "no specific quick win was identified"}.`,
      opening_questions: [
        `What's driving the ${lowestPillar.pillar.toLowerCase()} gap on the homepage right now?`,
        "Has positioning been revisited since the product last changed meaningfully?",
        "Who currently owns go-to-market day to day?",
      ],
      red_flags: [],
    },
  };

  return report;
}
