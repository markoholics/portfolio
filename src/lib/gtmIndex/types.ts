// Shared types for the Markoholics GTM Index pipeline: the Evidence
// Collector (Call 1, tools on) and the Index Analyst (Call 2, tools off).
// These mirror the JSON shapes in the GTM Audit Prompt Pack v2 exactly,
// so a parsed API response can be cast straight to these types once it
// has passed validateScoredReport().

export interface EvidencePageFetched {
  url: string;
  page_type: "homepage" | "pricing" | "product" | "customers" | "about" | "blog" | "other";
  result: "ok" | "partial" | "failed";
}

export interface EvidenceSocialAccess {
  channel: "linkedin" | "instagram" | "x";
  url: string | null;
  access: "full" | "partial" | "blocked" | "not_provided" | "not_assessable";
  note: string;
}

export interface EvidenceAboveTheFold {
  headline: string;
  subheadline: string | null;
  primary_cta: string | null;
  secondary_cta: string | null;
}

export interface EvidenceCategoryLanguage {
  term: string;
  where: string;
  evidence_id: string;
}

export interface EvidenceClaim {
  claim: string;
  where: string;
  evidence_id: string;
}

export interface EvidenceQuantifiedOutcome {
  outcome: string;
  evidence_id: string;
}

export interface EvidenceThirdPartyValidation {
  item: string;
  evidence_id: string;
}

export interface EvidenceProofAssets {
  customer_logos: number | null;
  case_studies: number | null;
  named_testimonials: number | null;
  quantified_outcomes: EvidenceQuantifiedOutcome[];
  third_party_validation: EvidenceThirdPartyValidation[];
}

export interface EvidenceBuyerLanguage {
  who_or_pain: string;
  where: string;
  evidence_id: string;
}

export interface EvidenceConversionPath {
  label: string;
  type: "demo" | "trial" | "self_serve" | "waitlist" | "contact" | "download" | "other";
  where: string;
}

export interface EvidenceSocialSignal {
  channel: string;
  observation: string;
  evidence_id: string;
}

export interface EvidenceThirdPartyDescription {
  source: string;
  framed_as: string;
  evidence_id: string;
}

export interface EvidenceSearchFindability {
  own_name_results: string;
  category_results: string;
  third_party_descriptions: EvidenceThirdPartyDescription[];
}

export interface EvidenceCompetitorSeen {
  name: string;
  frame_they_use: string;
  source_url: string;
  evidence_id: string;
}

export interface EvidenceApparentStage {
  value: "pre_launch" | "early" | "growth" | "scaled" | "unclear";
  basis: string;
}

export interface EvidenceItem {
  id: string;
  source_url: string;
  source_type: string;
  observed: string;
}

export interface EvidenceLedger {
  status: "ok" | "insufficient_data";
  message: string | null;
  company_name: string;
  company_domain: string;
  pages_fetched: EvidencePageFetched[];
  social_access: EvidenceSocialAccess[];
  above_the_fold: EvidenceAboveTheFold;
  category_language: EvidenceCategoryLanguage[];
  claims_made: EvidenceClaim[];
  proof_assets: EvidenceProofAssets;
  buyer_language: EvidenceBuyerLanguage[];
  pricing_visibility: "public" | "partial" | "contact_only" | "not_found" | "not_checked";
  conversion_paths: EvidenceConversionPath[];
  social_signals: EvidenceSocialSignal[];
  search_findability: EvidenceSearchFindability;
  competitors_seen: EvidenceCompetitorSeen[];
  apparent_stage: EvidenceApparentStage;
  evidence: EvidenceItem[];
  not_checked: string[];
}

export type PillarName = "Position" | "Proof" | "Buyer" | "Message" | "Path" | "Presence";
export type IndexBand = "Default Positioned" | "Partly Framed" | "Framed" | "Category Led";
export type FailurePattern =
  | "Origin Market Trap"
  | "Parity Trap"
  | "Everyone Pitch"
  | "Message Drift"
  | "Proof Gap"
  | "Dead End Path"
  | "Low Signal"
  | "Category Led";

export interface IndexScore {
  score: number;
  band: IndexBand;
  provisional: boolean;
  primary_failure_pattern: string;
  secondary_failure_pattern: string | null;
}

export interface TwoSentenceTest {
  what_a_stranger_would_say: string;
  verdict: "Pass" | "Partial" | "Fail";
  reason: string;
}

export interface PillarSummary {
  pillar: string;
  weight: number;
  score: number | null;
  provisional: boolean;
  one_line: string;
}

export interface TopFinding {
  finding: string;
  evidence_ids: string[];
  confidence: "High" | "Medium" | "Low";
}

export interface ReportSummary {
  headline_diagnosis: string;
  two_sentence_test: TwoSentenceTest;
  pillars: PillarSummary[];
  top_findings: TopFinding[];
  locked_preview: string[];
}

export interface PillarDeepDive {
  pillar: string;
  score: number | null;
  anchor_reached: "Low" | "Mid" | "High";
  diagnosis: string;
  evidence_ids: string[];
  what_would_raise_the_score: string;
}

export interface FiveStepReadItem {
  step: number;
  step_name: string;
  inference: string;
  confidence: "High" | "Medium" | "Low";
  needs_founder_input: boolean;
  evidence_ids: string[];
}

export interface ContradictionScanItem {
  side_a: { text: string; evidence_id: string };
  side_b: { text: string; evidence_id: string };
  why_it_matters: string;
}

export interface CompetitorFrameCheck {
  competitors: { name: string; frame_they_use: string; evidence_ids: string[] }[];
  where_frames_collide: string;
}

export interface FrameOption {
  frame: string;
  why_it_could_win: string;
  trade_off: string;
  who_it_attracts: string;
  evidence_ids: string[];
}

export interface MessagingHypothesis {
  where: string;
  current: string;
  hypothesis_to_test: string;
  reasoning: string;
  evidence_ids: string[];
}

export interface QuickWin {
  action: string;
  pillar: string;
  effort: "Low" | "Medium";
  why_this_first: string;
  evidence_ids: string[];
}

export interface Plan306090 {
  days_0_30: string[];
  days_31_60: string[];
  days_61_90: string[];
}

export interface FullReport {
  email_opening_line: string;
  pillar_deep_dives: PillarDeepDive[];
  five_step_read: FiveStepReadItem[];
  contradiction_scan: ContradictionScanItem[];
  competitor_frame_check: CompetitorFrameCheck | null;
  frame_options: FrameOption[];
  messaging_hypotheses: MessagingHypothesis[];
  quick_wins: QuickWin[];
  plan_30_60_90: Plan306090;
  what_we_cannot_see: string[];
  questions_for_the_founder: string[];
  caveats: string[];
}

export interface InternalBlock {
  icp_fit: "High" | "Medium" | "Low";
  icp_fit_reasons: string[];
  india_relevance: "Evident" | "Unclear" | "Not evident";
  apparent_stage: string;
  suggested_call_angle: string;
  opening_questions: string[];
  red_flags: string[];
}

export interface ScoredReport {
  status: "ok" | "insufficient_data";
  message: string | null;
  company_name: string;
  company_domain: string;
  method_note: string;
  index: IndexScore;
  summary: ReportSummary;
  full_report: FullReport;
  internal: InternalBlock;
}

// What the browser ever receives from POST /api/gtm-index/analyze: status,
// identity, the index score, and the gated summary. full_report and
// internal never leave the server at this stage.
export interface GtmIndexPublicResult {
  status: "ok" | "insufficient_data";
  message: string | null;
  reportId: string | null;
  companyName: string;
  companyDomain: string;
  index: IndexScore | null;
  summary: ReportSummary | null;
  cached: boolean;
}

export interface GtmIndexAnalyzeInput {
  companyUrl: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  xUrl?: string;
}
