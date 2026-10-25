// Fit Check: all tunable numbers in one place. Change a weight, a
// threshold, a price, or which answer is a deal breaker here — nothing in
// src/components/fit-check or src/app/fit-check needs to change to match.
// See README.md in this folder for a walkthrough of editing each section.

export type FitCheckRoute = "green" | "amber" | "red";

export type StageAnswer = "idea" | "built_no_users" | "live_early_users" | "live_paying";
export type InvestmentAnswer = "under_60k" | "60k_to_100k" | "above_100k";
export type AudienceAnswer = "mostly_indian" | "mixed" | "mostly_outside_india";
export type GoalAnswer =
  | "repeatable_pipeline"
  | "launch_product"
  | "brand_awareness"
  | "guaranteed_revenue"
  | "not_sure";
export type DecisionSpeedAnswer = "same_day" | "two_within_48h" | "committee";
export type FounderTimeAnswer = "under_1_hour" | "one_to_two_hours" | "three_plus_hours";
export type WorkStyleAnswer = "six_month_engagement" | "six_week_sprint" | "month_to_month";

export interface FitCheckAnswers {
  stage: StageAnswer;
  investment: InvestmentAnswer;
  audience: AudienceAnswer;
  goal: GoalAnswer;
  decisionSpeed: DecisionSpeedAnswer;
  founderTime: FounderTimeAnswer;
  workStyle: WorkStyleAnswer;
}

// Every question's raw point value per option, before its weight is
// applied. A question not listed in QUESTION_WEIGHTS below defaults to
// weight 1 (see scoring.ts).
export const QUESTION_SCORES = {
  stage: {
    idea: 0,
    built_no_users: 1,
    live_early_users: 3,
    live_paying: 4,
  } satisfies Record<StageAnswer, number>,
  investment: {
    under_60k: 0,
    "60k_to_100k": 3,
    above_100k: 4,
  } satisfies Record<InvestmentAnswer, number>,
  audience: {
    mostly_indian: 3,
    mixed: 1,
    mostly_outside_india: 0,
  } satisfies Record<AudienceAnswer, number>,
  goal: {
    repeatable_pipeline: 4,
    launch_product: 3,
    brand_awareness: 1,
    guaranteed_revenue: 0,
    not_sure: 1,
  } satisfies Record<GoalAnswer, number>,
  decisionSpeed: {
    same_day: 3,
    two_within_48h: 2,
    committee: 0,
  } satisfies Record<DecisionSpeedAnswer, number>,
  founderTime: {
    under_1_hour: 0,
    one_to_two_hours: 2,
    three_plus_hours: 3,
  } satisfies Record<FounderTimeAnswer, number>,
  workStyle: {
    six_month_engagement: 3,
    six_week_sprint: 2,
    month_to_month: 0,
  } satisfies Record<WorkStyleAnswer, number>,
} as const;

// Weight multiplier applied to a question's raw score before it's added to
// the total. Questions 2 (investment), 4 (goal) and 6 (workStyle) count
// double per the brief; decisionSpeed and founderTime share question 5's
// single weight (they're two taps on one screen, not two questions).
export const QUESTION_WEIGHTS: Record<keyof FitCheckAnswers, number> = {
  stage: 1,
  investment: 2,
  audience: 1,
  goal: 2,
  decisionSpeed: 1,
  founderTime: 1,
  workStyle: 2,
};

// Any answer listed here forces route "red" outright, no matter what the
// percentage score comes out to.
export const DEAL_BREAKER_ANSWERS: Partial<{ [K in keyof FitCheckAnswers]: FitCheckAnswers[K][] }> = {
  investment: ["under_60k"],
  workStyle: ["month_to_month"],
};

// Any answer listed here caps the best possible route — it can only pull a
// result down, never up. "mostly_outside_india" means "India only for now"
// still gets a call, just never the full Green booking path.
export const SOFT_CAP_ANSWERS: Partial<{
  [K in keyof FitCheckAnswers]: Partial<Record<string, FitCheckRoute>>;
}> = {
  audience: { mostly_outside_india: "amber" },
};

// Recorded on the submission and sent in the Make webhook payload for your
// own review — these never change the computed route, they just flag
// something a human should know before the call.
export const FLAG_ANSWERS: Partial<{
  [K in keyof FitCheckAnswers]: Partial<Record<string, string>>;
}> = {
  goal: { guaranteed_revenue: "unrealistic_expectations" },
};

// Percentage thresholds. Green requires both the score AND no deal
// breaker; Amber is the band below Green and at or above this floor.
export const GREEN_THRESHOLD_PERCENT = 80;
export const AMBER_THRESHOLD_PERCENT = 55;

// ---------------------------------------------------------------------
// Pricing. India only, rupees, excluding 18% GST. Starting proposals, not
// outcome guarantees — never state a guarantee anywhere this feeds into.
// ---------------------------------------------------------------------
export const PRICING = {
  currency: "INR" as const,
  gstPercent: 18,
  proofSprint: {
    name: "Proof Sprint",
    amount: 75_000,
    unit: "a month, six month minimum, billed in advance",
  },
  engine: {
    name: "Engine",
    amount: 85_000,
    unit: "a month, nine month minimum, billed in advance",
  },
  partner: {
    name: "Partner",
    amount: 125_000,
    unit: "a month plus revenue share, nine month minimum",
  },
};

// Shown as three cards above the Fit Check questions. Starting proposals,
// not outcome guarantees — same rule as PRICING above.
export interface PricingPlanCard {
  name: string;
  amount: number;
  period: string;
  features: string[];
  commitment: string;
  highlight?: boolean;
}

export const PRICING_PLANS: PricingPlanCard[] = [
  {
    name: "Proof Sprint",
    amount: PRICING.proofSprint.amount,
    period: "per month, six month minimum, billed in advance",
    features: [
      "ICP and positioning on one page",
      "Outbound system live: verified list, two sequences, tracking",
      "One founder led content format designed",
      "A scoreboard with LIVE tracking",
    ],
    commitment:
      "Everything live by week four, a weekly scoreboard, and a go or no go recommendation at the end of month three.",
  },
  {
    name: "Engine",
    amount: PRICING.engine.amount,
    period: "per month, nine month minimum, billed in advance",
    features: [
      "Outbound, founder content and reporting run end to end",
      "Monthly volume of verified ICP prospects reached, agreed in writing",
      "Weekly scoreboard and a monthly review",
    ],
    commitment:
      "A minimum baseline of six qualified conversations per month after the initial Sprint. If this baseline for three consecutive months isn't met, we will provide extra work at no cost during the fourth month. This is not eligible for a refund, and the 90 day mark serves as a progress review rather than a contract exit window.",
    highlight: true,
  },
  {
    name: "Partner",
    amount: PRICING.partner.amount,
    period: "per month plus revenue share, nine month minimum",
    features: [
      "Everything in Engine",
      "Events, podcasts and pipeline reporting",
      "Revenue share of 10-20% on deals the engine sources, for 9 to 12 months",
    ],
    commitment:
      "Attribution rules written into the contract before kickoff. Best for founders ready to hand over pipeline ownership.",
  },
];

// Landing-page price anchor above the form. Flip to false to A/B test the
// page without it.
export const SHOW_PRICE_ANCHOR = true;

// ---------------------------------------------------------------------
// Booking links. Reusing the single 30-minute Calendly event for both
// Green and Amber for now (see CalendlyPopup.tsx for the same URL used
// elsewhere on the site) — swap AMBER_BOOKING_URL for a dedicated
// 20-minute event whenever one exists.
// ---------------------------------------------------------------------
export const GREEN_BOOKING_URL = "https://calendly.com/markoholics/30min";
export const AMBER_BOOKING_URL = "https://calendly.com/markoholics/30min";

// Free domains are fine; these are disposable/throwaway inbox providers
// that get blocked outright on the contact screen.
export const BLOCKED_EMAIL_DOMAINS = [
  "mailinator.com",
  "guerrillamail.com",
  "10minutemail.com",
  "tempmail.com",
  "yopmail.com",
  "trashmail.com",
  "throwawaymail.com",
  "getnada.com",
  "dispostable.com",
  "fakeinbox.com",
];
