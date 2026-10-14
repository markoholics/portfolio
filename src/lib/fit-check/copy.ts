// Fit Check: every word shown to a visitor, or sent to one by email, lives
// in this one file. Edit the text here, nothing in src/components/fit-check
// or the API route needs to change. See README.md in this folder.
//
// House rules this file follows throughout: British English, no em dashes,
// no hyphens used as a dash (compound words like "six week" are written as
// two words rather than hyphenated, matching how the brief itself phrases
// them), one brand only (Markoholics), India only, no outcome guarantees.

import { PRICING } from "@/lib/fit-check/config";

export const LANDING_COPY = {
  eyebrow: "Fit Check",
  heading: "Let us find out if we are right for each other.",
  subheading:
    "Seven short questions. About ninety seconds. No sales pitch, just a straight answer about whether Markoholics is the right growth partner for where you are today.",
  priceAnchorLabel: `Engagements start from ₹${PRICING.proofSprint.amount.toLocaleString("en-IN")} for a six month Proof Sprint, plus GST.`,
  priceAnchorSupport:
    "We say this upfront so your time is not wasted, and neither is ours.",
  startButton: "Start the Fit Check",
};

export const PROGRESS_COPY = {
  promise: "Seven questions, about ninety seconds.",
  stepLabel: (current: number, total: number) => `Question ${current} of ${total}`,
  backButton: "Back",
  nextButton: "Next",
  submitButton: "See where we stand",
  submitting: "Sending your answers",
};

export const CONSENT_COPY = {
  heading: "Before you start",
  body:
    "We collect only what you share on these screens: your answers, your contact details on the last screen, and basic technical details like your browser and the page that sent you here. We use this to judge fit and, where there is one, to start a conversation. We do not sell your information or pass it to anyone outside Markoholics.",
  withdraw:
    "You can ask us to delete your answers at any time by emailing contact@markoholics.com.",
  privacyLinkLabel: "Read our Privacy Policy",
  privacyHref: "/privacy",
  consentCheckboxLabel:
    "I agree to Markoholics collecting and using my answers as described above.",
};

export interface QuestionCopy {
  id: string;
  heading: string;
  whyWeAsk: string;
  options: { value: string; label: string }[];
}

export const QUESTIONS_COPY = {
  stage: {
    id: "stage",
    heading: "Where is your product right now?",
    whyWeAsk:
      "This tells us how ready your business is for a growth system, not just a growth idea.",
    options: [
      { value: "idea", label: "Idea or pre product" },
      { value: "built_no_users", label: "Built, but no users yet" },
      { value: "live_early_users", label: "Live, with early users" },
      { value: "live_paying", label: "Live, with paying customers" },
    ],
  } satisfies QuestionCopy,

  investment: {
    id: "investment",
    heading: "What is a comfortable monthly investment in growth, excluding GST?",
    whyWeAsk:
      "Good work needs a budget that will not keep you up at night. This helps us recommend the right starting point, or tell you honestly if we are not it.",
    options: [
      { value: "under_60k", label: "Under ₹60,000" },
      { value: "60k_to_100k", label: "₹60,000 to ₹1,00,000" },
      { value: "above_100k", label: "Above ₹1,00,000" },
    ],
  } satisfies QuestionCopy,

  audience: {
    id: "audience",
    heading: "Who do you mostly sell to?",
    whyWeAsk:
      "We work with Indian B2B tech founders only, for now. This helps us be upfront about whether our playbook fits your buyers.",
    options: [
      { value: "mostly_indian", label: "Mostly Indian businesses" },
      { value: "mixed", label: "A mix of Indian and international" },
      { value: "mostly_outside_india", label: "Mostly outside India" },
    ],
  } satisfies QuestionCopy,

  goal: {
    id: "goal",
    heading: "What is the biggest goal for the next 90 days?",
    whyWeAsk:
      "Different goals need different engines. This is the single biggest thing that shapes what we would actually build for you.",
    options: [
      {
        value: "repeatable_pipeline",
        label: "A repeatable way to get conversations with the right buyers",
      },
      { value: "launch_product", label: "Launch a product or offer" },
      { value: "brand_awareness", label: "Brand awareness" },
      { value: "guaranteed_revenue", label: "Guaranteed revenue" },
      { value: "not_sure", label: "Not sure yet" },
    ],
  } satisfies QuestionCopy,

  workStyle: {
    id: "workStyle",
    heading: "How would you like to work with us?",
    whyWeAsk:
      "This is about pace and commitment, not price. It tells us whether to propose a sprint, a season, or nothing at all right now.",
    options: [
      {
        value: "six_month_engagement",
        label: "A six month engagement with a shared scoreboard and a 90 day review",
      },
      { value: "six_week_sprint", label: "Start with a Proof Sprint first" },
      { value: "month_to_month", label: "Month to month only" },
    ],
  } satisfies QuestionCopy,
};

// Question 5: two taps on one screen, so it keeps its own shape rather
// than fitting the single-select QuestionCopy type above.
export const DECISION_SCREEN_COPY = {
  id: "decision",
  heading: "Who signs off on marketing, and how much time can you give it each week?",
  whyWeAsk:
    "Speed of decisions and your own time are the two things that make or break momentum in the first month. We would rather know now than find out later.",
  signOff: {
    label: "Who signs off",
    options: [
      { value: "same_day", label: "I decide the same day" },
      { value: "two_within_48h", label: "Two of us, within 48 hours" },
      { value: "committee", label: "A committee, a week or more" },
    ],
  },
  founderTime: {
    label: "Your time each week",
    options: [
      { value: "under_1_hour", label: "Under 1 hour" },
      { value: "one_to_two_hours", label: "1 to 2 hours" },
      { value: "three_plus_hours", label: "3 hours or more" },
    ],
  },
};

export const CONTACT_SCREEN_COPY = {
  id: "contact",
  heading: "Nearly there. How do we reach you?",
  whyWeAsk: "Just enough to start a real conversation, nothing you will regret sharing.",
  fields: {
    name: { label: "Name", placeholder: "Your full name" },
    email: { label: "Work email", placeholder: "you@company.com" },
    website: { label: "Company website", placeholder: "https://" },
    linkedin: { label: "LinkedIn URL", placeholder: "https://linkedin.com/in/" },
    notes: {
      label: "Anything we should know?",
      placeholder: "Optional",
    },
  },
  errors: {
    email: "Enter a work email address.",
    disposableEmail: "Please use your regular work email rather than a temporary one.",
    required: "This field is required.",
  },
};

// ---------------------------------------------------------------------
// Route screens shown after submission. The literal words Green, Amber
// and Red must never appear in anything a visitor can see.
// ---------------------------------------------------------------------
export const GREEN_SCREEN_COPY = {
  heading: "This looks like a strong fit.",
  body:
    "Based on what you have told us, there is a real conversation to be had. Pick a time that works for you and we will come prepared.",
  footnote: "We read every answer personally before the call, so you will not repeat yourself.",
  bookingButton: "Book your call",
};

export const AMBER_SCREEN_COPY = {
  heading: "There is something here. Let us start smaller.",
  body: `Based on what you have told us, we think the right first step is the Proof Sprint rather than diving straight into a full engagement. It is a focused six month piece of work, fixed at ₹${PRICING.proofSprint.amount.toLocaleString("en-IN")} plus GST, with no long commitment attached.`,
  sprintCredit: PRICING.proofSprint.note,
  callPrompt: "If you would like to talk it through first, grab a short call below.",
  bookingButton: "Book a short call",
};

export const RED_SCREEN_COPY = {
  heading: "Not the right fit, right now.",
  body:
    "Thank you for being straight with us. Based on what you have told us, now is not the right time for us to work together.",
  reassurance:
    "That is not a judgement on your business. Timing matters more than almost anything else in growth work, and we would rather say so now than waste your time later.",
  resourceIntro: "In the meantime, here is something that might actually help.",
  resourceLabel: "GTM Strategy Not Converting? What to Audit First",
  resourceHref: "/blog/gtm-strategy-not-converting-what-to-audit-first",
  oneOffLabel: "If you have a defined one off project with a fixed budget, tell us in one line.",
  oneOffPlaceholder: "Optional",
  returnLine: "Come back when your situation changes. We will still be here.",
};

// ---------------------------------------------------------------------
// Auto reply emails, one per route. {{firstName}}, {{bookingUrl}} and
// {{resourceUrl}} are substituted server side in src/lib/fit-check/notify.ts.
// ---------------------------------------------------------------------
export const EMAIL_COPY = {
  green: {
    subject: "Let us get you on the calendar",
    html: `
      <h2>Hey {{firstName}},</h2>
      <p>Thank you for taking the Fit Check. Based on what you shared, we think there is a genuine conversation to be had.</p>
      <p>Please pick a time that works for you: <a href="{{bookingUrl}}">{{bookingUrl}}</a></p>
      <p>We read every answer personally before the call, so you will not need to repeat yourself.</p>
      <p>If anything changes before then, just send an email to contact@markoholics.com.</p>
      <p>Kind regards,<br />The Markoholics team</p>
    `,
  },
  amber: {
    subject: "Our recommendation: start with the Proof Sprint",
    html: `
      <h2>Hey {{firstName}},</h2>
      <p>Thank you for taking the Fit Check. Based on what you shared, we think the right first step is the Proof Sprint rather than a full engagement straight away.</p>
      <p>The Proof Sprint is a fixed six month piece of work, starting from ₹${PRICING.proofSprint.amount.toLocaleString("en-IN")} plus GST, paid in advance. ${PRICING.proofSprint.note}</p>
      <p>If you would like to talk it through first, book a short call here: <a href="{{bookingUrl}}">{{bookingUrl}}</a></p>
      <p>Kind regards,<br />The Markoholics team</p>
    `,
  },
  red: {
    subject: "Not the right time, but here is something useful",
    html: `
      <h2>Hey {{firstName}},</h2>
      <p>Thank you for being straight with us in the Fit Check. Based on what you shared, now is not the right time for us to work together.</p>
      <p>That is not a verdict on your business. Timing matters more than almost anything else in growth work.</p>
      <p>In the meantime, here is something that might actually help: <a href="{{resourceUrl}}">{{resourceUrl}}</a></p>
      <p>If your situation changes, or you have a defined one off project with a fixed budget, reply to this email and tell us in one line. We read every one by hand.</p>
      <p>Kind regards,<br />The Markoholics team</p>
    `,
  },
};
