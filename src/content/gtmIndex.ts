// All copy and constants for /gtm-index, the Markoholics GTM Index tool.
// Single source of truth, matching the pattern in src/content/roundtable.ts.

export const GTM_INDEX_PATH = "/gtm-index";

export const GTM_INDEX_META = {
  title: "Markoholics GTM Index: a free, evidence backed positioning score",
  description:
    "Run your go-to-market through the Markoholics GTM Index: a free, instant score across six pillars, built directly from your own pages and the five step positioning framework.",
};

// Homepage teaser section (src/components/home/GtmIndexTeaser.tsx).
export const HOMEPAGE_TEASER_COPY = {
  eyebrow: "Free, instant, no AI reading your data",
  heading: "Is your positioning obvious, or just true?",
  sub: "Run your own site through the Markoholics GTM Index: a free, instant score across six pillars, with the exact pattern holding your go-to-market back.",
  chips: ["Six pillars scored", "Every finding cited", "No login, no credit card"],
  primaryButton: "Run my GTM Index",
};

export const HERO_COPY = {
  eyebrow: "Free, instant, no AI reading your data",
  heading: "Is your positioning obvious, or just true?",
  sub: "Drop in your company URL. We read your homepage and a few linked pages directly, score them across six pillars, and tell you plainly which failure pattern is holding your go-to-market back.",
  bullets: [
    "Built on the five step positioning framework",
    "Every finding cites the exact page it came from",
    "No login, no credit card, your inbox gets the full report",
  ],
};

export const FORM_COPY = {
  companyUrlLabel: "Company website",
  companyUrlPlaceholder: "yourcompany.com",
  socialsLabel: "Social links (optional, helps the score)",
  linkedinPlaceholder: "LinkedIn company page",
  instagramPlaceholder: "Instagram",
  xPlaceholder: "X (Twitter)",
  submitLabel: "Run my GTM Index",
  loadingLabel: "Reading your site",
  loadingSub: "This usually takes just a few seconds: we fetch your homepage and a few linked pages directly, then score what's actually there.",
  errorFallback: "Something went wrong. Please try again.",
};

export const PILLAR_WEIGHTS: Record<string, number> = {
  Position: 25,
  Proof: 20,
  Buyer: 15,
  Message: 15,
  Path: 15,
  Presence: 10,
};

export const BAND_DESCRIPTIONS: Record<string, string> = {
  "Default Positioned": "Still described in the market it started in.",
  "Partly Framed": "A category and a differentiator exist, but the strength sits at the side of the story.",
  Framed: "A deliberate frame where the core strength is what the category gets judged on.",
  "Category Led": "The category itself is built around this company's strength.",
};

export const RESULT_COPY = {
  scoreLabel: "Markoholics GTM Index",
  bandLabel: "Band",
  patternLabel: "Primary pattern",
  twoSentenceHeading: "The two sentence test",
  pillarsHeading: "The six pillars",
  findingsHeading: "Top findings",
  lockedHeading: "In your full report",
  unlockHeading: "Get the full report",
  unlockSub: "Every pillar, the five step positioning read, a contradiction scan across your channels, alternative market frames, and a 30/60/90 day plan, sent to your inbox.",
  nameLabel: "Your name",
  emailLabel: "Work email",
  emailPlaceholder: "you@yourcompany.com",
  consentLabel: "Send me the full report and occasional GTM insights from Markoholics.",
  submitLabel: "Email me the full report",
  sendingLabel: "Sending",
  successHeading: "On its way.",
  successSub: "Check your inbox (and spam folder, just in case) for the full report.",
  runAnotherLabel: "Run another company",
  provisionalNote: "Provisional: parts of this score rest on limited public visibility.",
};

export const INSUFFICIENT_DATA_COPY = {
  heading: "We couldn't complete this one.",
  tryAgainLabel: "Try a different URL",
};
