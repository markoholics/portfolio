export type ServiceSlug =
  | "gtm-strategy"
  | "content-marketing"
  | "social-media-marketing"
  | "performance-marketing"
  | "demand-generation";

export interface Service {
  slug: ServiceSlug;
  index: string;
  name: string;
  short: string;
  description: string;
  included: string[];
}

export const services: Service[] = [
  {
    slug: "gtm-strategy",
    index: "01",
    name: "Marketing Strategy & GTM Strategy",
    short: "The architecture behind every launch, expansion, and category move.",
    description:
      "We build the strategic foundation tech companies scale on — positioning, market sequencing, channel architecture, and the operating plan that ties revenue targets to weekly execution.",
    included: [
      "Positioning & narrative architecture",
      "Market & segment prioritization",
      "Go-to-market launch planning",
      "Channel mix & budget architecture",
      "Quarterly growth operating plans",
    ],
  },
  {
    slug: "content-marketing",
    index: "02",
    name: "Content Marketing",
    short: "Editorial systems that compound authority instead of chasing impressions.",
    description:
      "Content built as infrastructure, not output — research-backed, founder-voiced, and engineered to move qualified buyers through a defined narrative arc.",
    included: [
      "Content strategy & editorial calendars",
      "Long-form & thought leadership",
      "SEO content architecture",
      "Case studies & proof assets",
      "Content distribution systems",
    ],
  },
  {
    slug: "social-media-marketing",
    index: "03",
    name: "Social Media Marketing",
    short: "Channel-native presence engineered for category authority, not vanity metrics.",
    description:
      "Platform-specific strategy and creative production that builds founder and brand presence where high-intent buyers and talent are already paying attention.",
    included: [
      "Channel strategy by platform",
      "Founder-led & brand social programs",
      "Creative production & content systems",
      "Community & engagement management",
      "Organic-to-paid social bridges",
    ],
  },
  {
    slug: "performance-marketing",
    index: "04",
    name: "Performance Marketing",
    short: "Paid acquisition engineered against CAC, payback, and pipeline — not clicks.",
    description:
      "Full-funnel paid media built on a foundation of testing discipline, creative velocity, and attribution that holds up under finance scrutiny.",
    included: [
      "Paid search, social & programmatic",
      "Creative testing frameworks",
      "Landing page & conversion architecture",
      "Attribution & measurement modeling",
      "Budget pacing & CAC management",
    ],
  },
  {
    slug: "demand-generation",
    index: "05",
    name: "Demand Generation & Growth Marketing",
    short: "Pipeline systems engineered to compound, not campaigns that reset to zero.",
    description:
      "End-to-end demand architecture — from intent signal to closed revenue — built with sales alignment, lifecycle automation, and growth experimentation baked in.",
    included: [
      "Demand gen funnel architecture",
      "Lifecycle & lead-stage automation",
      "ABM & target account programs",
      "Growth experimentation roadmaps",
      "Sales & RevOps alignment",
    ],
  },
];

export interface CaseStudy {
  slug: string;
  name: string;
  domain: string;
  sector: string;
  oneLiner: string;
  servicesUsed: ServiceSlug[];
  challenge: string;
  strategy: { service: ServiceSlug; detail: string }[];
  results: { label: string; value: string }[];
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "eqrgen",
    name: "EQRGen",
    domain: "eqrgen.com",
    sector: "Technology",
    oneLiner: "[Result metric] — built the GTM engine behind a category launch.",
    servicesUsed: ["gtm-strategy", "demand-generation", "performance-marketing"],
    challenge:
      "EQRGen needed to enter a crowded technology category with no established narrative and a sales team waiting on qualified pipeline. [Additional context to be supplied.]",
    strategy: [
      {
        service: "gtm-strategy",
        detail:
          "Defined category positioning and a phased market-entry sequence aligned to product readiness.",
      },
      {
        service: "demand-generation",
        detail:
          "Architected a full-funnel demand system connecting intent signals to a structured sales handoff.",
      },
      {
        service: "performance-marketing",
        detail:
          "Stood up paid acquisition across search and social with a CAC-led testing framework.",
      },
    ],
    results: [
      { label: "Pipeline generated", value: "[Result metric]" },
      { label: "CAC reduction", value: "[Result metric]" },
      { label: "Time to first qualified pipeline", value: "[Result metric]" },
    ],
  },
  {
    slug: "byosync",
    name: "Byosync",
    domain: "byosync.com",
    sector: "Technology",
    oneLiner: "[Result metric] — rebuilt the content engine into a pipeline asset.",
    servicesUsed: ["content-marketing", "social-media-marketing", "demand-generation"],
    challenge:
      "Byosync's content output was high-volume but disconnected from pipeline, with no system linking editorial work to qualified demand. [Additional context to be supplied.]",
    strategy: [
      {
        service: "content-marketing",
        detail:
          "Rebuilt the editorial calendar around buyer-stage narrative arcs and proof-driven long-form assets.",
      },
      {
        service: "social-media-marketing",
        detail:
          "Established a founder-led channel presence to extend content reach into high-intent audiences.",
      },
      {
        service: "demand-generation",
        detail:
          "Connected content engagement to lifecycle scoring and a structured nurture sequence.",
      },
    ],
    results: [
      { label: "Organic pipeline contribution", value: "[Result metric]" },
      { label: "Content-to-lead conversion", value: "[Result metric]" },
      { label: "Owned audience growth", value: "[Result metric]" },
    ],
  },
  {
    slug: "aditi-consulting",
    name: "Aditi Consulting",
    domain: "aditiconsulting.com",
    sector: "Technology / Consulting",
    oneLiner: "[Result metric] — modernized a category-leading consulting brand.",
    servicesUsed: ["gtm-strategy", "content-marketing", "performance-marketing"],
    challenge:
      "Aditi Consulting needed a modern growth motion layered onto an established enterprise reputation, without diluting existing brand equity. [Additional context to be supplied.]",
    strategy: [
      {
        service: "gtm-strategy",
        detail:
          "Re-architected positioning to bridge legacy enterprise trust with a modern, technical buyer audience.",
      },
      {
        service: "content-marketing",
        detail:
          "Built a thought-leadership program establishing point-of-view authority in target verticals.",
      },
      {
        service: "performance-marketing",
        detail:
          "Layered paid acquisition on top of brand campaigns to accelerate qualified inbound volume.",
      },
    ],
    results: [
      { label: "Qualified inbound growth", value: "[Result metric]" },
      { label: "Brand search lift", value: "[Result metric]" },
      { label: "Sales cycle reduction", value: "[Result metric]" },
    ],
  },
  {
    slug: "snapmint",
    name: "Snapmint",
    domain: "snapmint.com",
    sector: "Technology / Fintech",
    oneLiner: "[Result metric] — scaled full-funnel acquisition across paid channels.",
    servicesUsed: ["performance-marketing", "demand-generation", "social-media-marketing"],
    challenge:
      "Snapmint needed to scale user acquisition efficiently across a competitive fintech landscape while protecting unit economics. [Additional context to be supplied.]",
    strategy: [
      {
        service: "performance-marketing",
        detail:
          "Built a multi-channel paid acquisition system with rigorous creative testing and CAC controls.",
      },
      {
        service: "demand-generation",
        detail:
          "Designed lifecycle flows to move acquired users toward activation and retention milestones.",
      },
      {
        service: "social-media-marketing",
        detail:
          "Developed always-on social creative to feed paid channels with continuously refreshed assets.",
      },
    ],
    results: [
      { label: "User acquisition growth", value: "[Result metric]" },
      { label: "Payback period improvement", value: "[Result metric]" },
      { label: "Creative testing velocity", value: "[Result metric]" },
    ],
  },
];

export const clients = caseStudies.map((c) => ({
  name: c.name,
  domain: c.domain,
  slug: c.slug,
}));

export const proofMetrics = [
  { label: "Pipeline generated for clients", value: 180, prefix: "$", suffix: "M+" },
  { label: "Average CAC reduction", value: 34, suffix: "%" },
  { label: "Technology companies scaled", value: 40, suffix: "+" },
  { label: "Disciplines under one roof", value: 5, suffix: "" },
];

export const approachSteps = [
  {
    index: "01",
    name: "Diagnose",
    detail:
      "We audit the funnel as it actually performs, not as the dashboard claims — channel by channel, stage by stage, against the numbers that matter to the board.",
  },
  {
    index: "02",
    name: "Architect",
    detail:
      "We design the GTM system: positioning, channel mix, content architecture, and the operating cadence that connects strategy to weekly execution.",
  },
  {
    index: "03",
    name: "Execute",
    detail:
      "We run the engine — content, social, paid, and demand gen working as one motion, not five disconnected vendors.",
  },
  {
    index: "04",
    name: "Compound",
    detail:
      "We instrument everything we ship, kill what underperforms, and reinvest in what compounds, quarter over quarter.",
  },
];

export const navLinks = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const CONTACT_EMAIL = "markoholics@outlook.com";
