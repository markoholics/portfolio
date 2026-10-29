// Markoholics Roundtable Series: every word shown on /roundtable and in the
// homepage teaser lives in this one file. Edit the text, metrics and form
// options here; no component under src/components/roundtable or
// src/components/home/RoundtableTeaser.tsx should need to change for a
// copy edit. House rule: British English, no em dashes, no hyphens used as
// a dash anywhere in this file.

export const ROUNDTABLE_PATH = "/roundtable";
export const ROUNDTABLE_HOME_HREF = "/roundtable?ref=home";
export const ROUNDTABLE_HOME_FORMATS_HREF = "/roundtable?ref=home#formats";

export const ROUNDTABLE_META = {
  title: "Markoholics Roundtable Series | GTM and marketing conversations for tech, AI and SaaS founders",
  description:
    "Three to four practitioners, one table, no pitch. Monthly GTM and marketing conversations for tech, AI and SaaS founders, in person in Bangalore and live on LinkedIn. Express your interest to join.",
};

export const HOMEPAGE_TEASER_COPY = {
  eyebrow: "ROUNDTABLE SERIES",
  heading: "Join us for a Roundtable and share your expertise.",
  sub: "Three to four practitioners, one table, no pitch. Monthly conversations on GTM and marketing for tech, AI and SaaS founders, in person in Bangalore and live on LinkedIn.",
  chips: ["90 minutes, in person in Bangalore", "60 minutes, live on LinkedIn"],
  primaryButton: "Express interest",
  secondaryLink: "See the two formats",
};

export const HERO_COPY = {
  eyebrow: "GTM AND MARKETING FOR TECH, AI AND SAAS STARTUPS",
  headingPlain: "Markoholics Roundtable ",
  headingAccent: "Series.",
  lead: "Three to four practitioners, one table, no pitch. Every episode is built around ready to use tips, hacks and frameworks that tech, AI and SaaS founders and marketers can apply the same week, alongside a clear read on the GTM and marketing trends shaping the market.",
  primaryButton: "Express interest",
  secondaryLink: "See the two formats",
  statStrip: [
    { value: "3 to 4", label: "Guests in every episode" },
    { value: "Monthly", label: "Target cadence, guided by guest availability" },
    { value: "2 formats", label: "In person and live online" },
  ],
};

export interface RoundtableFormat {
  tag: string;
  heading: string;
  rightLabel: string;
  bigNumber: string;
  points: string[];
}

export const FORMATS_COPY = {
  note: "There is no fixed calendar. We aim for one episode a month, guided by guest availability.",
  formats: [
    {
      tag: "FORMAT 01",
      heading: "In person roundtable",
      rightLabel: "Podcast studio, Bangalore",
      bigNumber: "90 minutes",
      points: [
        "Three to four local guests around one table",
        "Deep dive and insight led, with room to challenge each other",
        "Actionable tips, hacks and GTM and marketing trends",
        "Unscripted debate and real examples a short format cannot hold",
        "Full length episode, with clips cut for every channel",
      ],
    },
    {
      tag: "FORMAT 02",
      heading: "LinkedIn Live",
      rightLabel: "LinkedIn and YouTube",
      bigNumber: "60 minutes",
      points: [
        "Three to four guests, joining live from anywhere",
        "Real time discussion with live audience questions",
        "The same tips, hacks and GTM trends, tuned for a live room",
        "Opens the series to guests beyond Bangalore",
        "Recording repurposed as on demand content and clips",
      ],
    },
  ] satisfies RoundtableFormat[],
};

export const MODERATOR_COPY = {
  eyebrow: "YOUR MODERATOR",
  nameLine1: "Mohammad H. Rahman",
  nameLine2: "(Remmy)",
  role: "Founder of Markoholics, one of India’s leading GTM agencies for tech startups.",
  bio: "A techie turned marketer with over six years of product marketing experience, Remmy understands tech, SaaS and AI products from the inside. He started in software engineering at TCS, moved into B2B marketing across fintech and consulting, and holds a UK MBA from the University of Sheffield. He has also taught digital marketing at UpGrad and LearnTube.",
  audienceReachLabel: "AUDIENCE REACH",
  // NOTE: confirm these three URLs before launch (flagged to the user).
  reach: [
    { platform: "LinkedIn", value: "3.4k", suffix: "followers", href: "https://linkedin.com/in/theotherrahman" },
    { platform: "X", value: "3.5k", suffix: "followers", href: "https://x.com/theotherrahman" },
    { platform: "Facebook", value: "2.4k", suffix: "followers", href: null },
    { platform: "Instagram", value: "950+", suffix: "followers", href: "https://instagram.com/theotherrahman" },
  ],
  reachFootnoteBold: "10k+ combined followers.",
  reachFootnoteRest: " His newsletter, Previously in GTM, has 200+ subscribers.",
};

export interface RoundtableMetric {
  prefix?: string;
  value: number;
  suffix?: string;
  label: string;
}

export const ABOUT_COPY = {
  eyebrow: "ABOUT MARKOHOLICS",
  statement: "An AI-native GTM partner for tech founders.",
  // These are Markoholics' own reported figures. Keep as exact literals,
  // never round or restyle, and AnimatedCounter never animates past the
  // stated value, so these numbers are always what's shown here, verbatim.
  metrics: [
    { prefix: "$", value: 10, suffix: "M+", label: "PIPELINE GENERATED FOR CLIENTS" },
    { value: 28, suffix: "%", label: "AVERAGE CAC REDUCTION" },
    { value: 10, suffix: "+", label: "TECH FOUNDERS AND COMPANIES SCALED" },
    { value: 30, label: "DAYS TO FIRST RESULTS" },
  ] satisfies RoundtableMetric[],
  disclosure: "Aggregate figures across active and completed client engagements.",
  partnersLabel: "Strategic partners and affiliations",
  partners: ["Google", "Claude", "Apollo", "Make", "Apify"],
};

export const WHY_JOIN_COPY = {
  eyebrow: "WHY JOIN AS A GUEST",
  items: [
    "Share your expertise with tech, AI and SaaS founders and marketers",
    "Gain visibility through the broadcast, full episode and clips",
    "A curated, practitioner led conversation",
    "Network with fellow GTM leaders",
  ],
};

export const CTA_BAND_COPY = {
  heading: "Want a seat at the table?",
  sub: "Get in touch to confirm your format, topic and availability.",
  getInTouchLabel: "GET IN TOUCH",
  socialLine: "@theotherrahman on LinkedIn, X and Instagram",
  scrollButton: "Express interest",
};

export const FORM_INTRO_COPY = {
  heading: "Want a seat at the table?",
  sub: "Tell us a little about you. We will be in touch within 2 to 3 business days.",
  emailPreferLine: "Prefer email? Write to ",
};

export const FORM_SUCCESS_COPY = {
  heading: (firstName: string) => `Thanks, ${firstName}. We will be in touch within 2 to 3 business days.`,
  sub: "A confirmation email is on its way. If you don't see it shortly, please check spam.",
};

export const FORM_ERROR_COPY = {
  heading: "Something went wrong.",
  sub: "Please try again, or email us directly at",
};

export const EXPERTISE_OPTIONS = [
  "SEO / AEO / GEO",
  "Digital marketing",
  "GTM strategy",
  "Product marketing",
  "D2C marketing",
  "B2B SaaS marketing",
  "ABM",
  "Email and lifecycle marketing",
  "Content marketing",
  "Demand generation",
  "Paid media and performance",
  "Marketing automation and AI",
  "Brand and PR",
  "Sales and RevOps",
  "Founder led growth",
  "Other",
] as const;

export const YEARS_EXPERIENCE_OPTIONS = ["0 to 2", "3 to 5", "6 to 10", "10+"] as const;

export const JOIN_AS_OPTIONS = [
  "Guest speaker",
  "Attend in person (Bangalore)",
  "Join the LinkedIn Live audience",
  "Sponsor or partner",
  "More than one of these",
] as const;

export const PREFERRED_FORMAT_OPTIONS = ["In person (Bangalore)", "LinkedIn Live", "Either works"] as const;

export const AVAILABILITY_OPTIONS = ["Weekday daytime", "Weekday evening", "Weekend"] as const;

export const COMPANY_STAGE_OPTIONS = [
  "Pre seed or bootstrapped",
  "Seed",
  "Series A and beyond",
  "Agency or consultancy",
  "Enterprise",
  "Other",
] as const;

export const HEARD_ABOUT_OPTIONS = [
  "LinkedIn",
  "X",
  "Instagram",
  "Facebook",
  "Newsletter (Previously in GTM)",
  "Referral",
  "Event",
  "Other",
] as const;

export const FREE_EMAIL_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "icloud.com",
  "proton.me",
  "protonmail.com",
  "aol.com",
  "live.com",
  "msn.com",
  "mail.com",
  "gmx.com",
  "yandex.com",
  "zoho.com",
  "rediffmail.com",
] as const;

export const DISPOSABLE_EMAIL_DOMAINS = [
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
] as const;
