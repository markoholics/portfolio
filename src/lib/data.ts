export type ServiceSlug =
  | "gtm-strategy"
  | "content-marketing"
  | "social-media-marketing"
  | "performance-marketing"
  | "demand-generation"
  | "ai-strategy";

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
      "We build the strategic foundation tech founders scale on: positioning, market sequencing, channel architecture, and the operating plan that ties revenue targets to weekly execution. This is the layer every other discipline plugs into.",
    included: [
      "Positioning and narrative architecture",
      "Market and segment prioritization",
      "Go-to-market launch planning",
      "Channel mix and budget architecture",
      "Quarterly growth operating plans",
    ],
  },
  {
    slug: "content-marketing",
    index: "02",
    name: "Content Marketing",
    short: "Editorial systems that compound authority instead of chasing impressions.",
    description:
      "Content built as infrastructure, not output. Research-backed, founder-voiced, and engineered to move qualified buyers through a defined narrative arc, from first search to signed contract.",
    included: [
      "Content strategy and editorial calendars",
      "Long-form and thought leadership",
      "SEO content architecture",
      "Case studies and proof assets",
      "Content distribution systems",
    ],
  },
  {
    slug: "social-media-marketing",
    index: "03",
    name: "Social Media Marketing",
    short: "Channel-native presence engineered for category authority, not vanity metrics.",
    description:
      "Platform-specific strategy and creative production that builds founder and brand presence where high-intent buyers, partners, and talent are already paying attention.",
    included: [
      "Channel strategy by platform",
      "Founder-led and brand social programs",
      "Creative production and content systems",
      "Community and engagement management",
      "Organic-to-paid social bridges",
    ],
  },
  {
    slug: "performance-marketing",
    index: "04",
    name: "Performance Marketing",
    short: "Paid acquisition engineered against CAC, payback, and pipeline, not clicks.",
    description:
      "Full-funnel paid media built on a foundation of testing discipline, creative velocity, and attribution that holds up under finance scrutiny and board-level review.",
    included: [
      "Paid search, social, and programmatic",
      "Creative testing frameworks",
      "Landing page and conversion architecture",
      "Attribution and measurement modeling",
      "Budget pacing and CAC management",
    ],
  },
  {
    slug: "demand-generation",
    index: "05",
    name: "Demand Generation & Growth Marketing",
    short: "Pipeline systems engineered to compound, not campaigns that reset to zero.",
    description:
      "End-to-end demand architecture, from first intent signal to closed revenue, built with sales alignment, lifecycle automation, and growth experimentation baked in from day one.",
    included: [
      "Demand gen funnel architecture",
      "Lifecycle and lead-stage automation",
      "ABM and target account programs",
      "Growth experimentation roadmaps",
      "Sales and RevOps alignment",
    ],
  },
  {
    slug: "ai-strategy",
    index: "06",
    name: "AI Strategy and Transformation",
    short: "Practical AI adoption roadmaps for marketing and go-to-market teams.",
    description:
      "We help tech founders and marketing leaders decide where AI actually moves the needle, then build the workflows, tooling, and governance to put it into production across content, demand gen, and customer operations.",
    included: [
      "AI readiness and opportunity audits",
      "Marketing and GTM workflow automation",
      "AI-assisted content and creative pipelines",
      "Tooling selection and vendor evaluation",
      "Team enablement and adoption playbooks",
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
  quote: { text: string; attribution: string };
  gallery: string[];
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "eqrgen",
    name: "EQRGen",
    domain: "eqrgen.com",
    sector: "Technology, Dynamic QR Infrastructure",
    oneLiner: "500 sales qualified leads and 50 new customers in a single quarter.",
    servicesUsed: ["gtm-strategy", "demand-generation", "performance-marketing"],
    challenge:
      "EQRGen, a dynamic QR code generator platform, was entering a market crowded with free, low-differentiation tools. The founders needed a GTM motion that could explain the value of dynamic, trackable QR infrastructure to SMBs and enterprise marketing teams, and a pipeline engine that could feed a small but fast-moving sales team.",
    strategy: [
      {
        service: "gtm-strategy",
        detail:
          "Built a category narrative around dynamic, editable, and trackable QR codes versus static alternatives, and sequenced launch across SMB self-serve and mid-market sales-assisted segments.",
      },
      {
        service: "demand-generation",
        detail:
          "Architected a full-funnel demand system connecting paid and organic intent signals to a structured SQL handoff process with weekly sales sync cadence.",
      },
      {
        service: "performance-marketing",
        detail:
          "Ran paid search and paid social campaigns with a CAC-led testing framework across more than 20 ad variants and three landing page templates.",
      },
    ],
    results: [
      { label: "Sales qualified leads in 90 days", value: "500" },
      { label: "New customers closed", value: "50" },
      { label: "SQL to customer conversion rate", value: "10%" },
    ],
    quote: {
      text: "We went from guessing at our positioning to having a pipeline number we could put in front of investors. Markoholics built the engine and stayed close enough to keep tuning it every week.",
      attribution: "Head of Growth, EQRGen",
    },
    gallery: [
      "Demand funnel architecture",
      "Paid search creative testing grid",
      "SQL handoff dashboard",
      "Landing page conversion variants",
    ],
  },
  {
    slug: "byosync",
    name: "Byosync",
    domain: "byosync.com",
    sector: "Technology, Trust and Consent Infrastructure",
    oneLiner: "10 signed proof-of-concept partnerships with tech startups in six months.",
    servicesUsed: ["content-marketing", "social-media-marketing", "demand-generation"],
    challenge:
      "Byosync had built a trust and consent configuration layer for handling sensitive user data, but needed validation in the market before pursuing larger enterprise contracts. The goal was proof-of-concept partnerships with other technology startups that could become reference customers and integration case studies.",
    strategy: [
      {
        service: "content-marketing",
        detail:
          "Built a technical content program, including integration guides and security-first explainers, aimed directly at the engineering and product leaders who evaluate trust infrastructure vendors.",
      },
      {
        service: "social-media-marketing",
        detail:
          "Established a founder-led presence on LinkedIn and X to build credibility inside the developer and startup security community ahead of outbound partnership conversations.",
      },
      {
        service: "demand-generation",
        detail:
          "Ran a targeted partnership outreach motion against a curated list of 120 startups, paired with lifecycle nurture for prospects not yet ready to commit.",
      },
    ],
    results: [
      { label: "POC partnerships signed", value: "10" },
      { label: "Timeline", value: "6 months" },
      { label: "Outbound to POC conversion rate", value: "8.3%" },
    ],
    quote: {
      text: "We needed proof in the market, not another deck. Markoholics got us in front of the right startups and turned conversations into signed pilots faster than we expected.",
      attribution: "Co-Founder, Byosync",
    },
    gallery: [
      "Partnership outreach pipeline",
      "Technical integration guide layout",
      "Founder LinkedIn content series",
      "POC tracking dashboard",
    ],
  },
  {
    slug: "aditi-consulting",
    name: "Aditi Consulting",
    domain: "aditiconsulting.com",
    sector: "Technology, Digital Engineering Services",
    oneLiner: "Repositioned from a tech staffing firm to a digital engineering partner across the India market.",
    servicesUsed: ["content-marketing", "gtm-strategy", "ai-strategy"],
    challenge:
      "Aditi Consulting, a multinational digital engineering services firm, was widely perceived in India as a technology recruitment firm rather than a full digital engineering and consulting partner. The brand needed a content-led repositioning to win consideration for larger, higher-value engineering and transformation engagements.",
    strategy: [
      {
        service: "gtm-strategy",
        detail:
          "Redefined India market positioning around digital engineering, cloud, and data capabilities, distancing the brand from its staffing-firm reputation while preserving existing client trust.",
      },
      {
        service: "content-marketing",
        detail:
          "Built a thought-leadership and case study program across engineering leadership audiences, publishing a steady cadence of point-of-view content on digital engineering delivery.",
      },
      {
        service: "ai-strategy",
        detail:
          "Positioned Aditi's AI and data engineering capabilities as a forward-looking differentiator, supporting the shift from staffing-led to capability-led brand perception.",
      },
    ],
    results: [
      { label: "Branded search growth, India market", value: "64%" },
      { label: "Engineering-led content published", value: "85 pieces" },
      { label: "Inbound RFPs tagged digital engineering", value: "+41%" },
    ],
    quote: {
      text: "Changing how a market perceives you after years of one reputation is hard. Markoholics gave us the narrative and the content discipline to make that shift credible, not just claimed.",
      attribution: "VP Marketing, Aditi Consulting",
    },
    gallery: [
      "Brand repositioning narrative map",
      "Engineering thought leadership series",
      "India market content calendar",
      "AI capability positioning deck",
    ],
  },
  {
    slug: "snapmint",
    name: "Snapmint",
    domain: "snapmint.com",
    sector: "Technology, NBFC E-commerce Financing",
    oneLiner: "100,000 new customers activated PAN-India within 12 months.",
    servicesUsed: ["gtm-strategy", "demand-generation", "performance-marketing"],
    challenge:
      "Snapmint, a non-banking financial e-commerce service, needed to scale customer activation across India while keeping acquisition cost and credit risk in line with NBFC underwriting standards. The market required a GTM strategy that could work across metro and tier-2/tier-3 cities with very different buying behavior.",
    strategy: [
      {
        service: "gtm-strategy",
        detail:
          "Built a PAN-India go-to-market plan that sequenced metro, tier-2, and tier-3 city rollout against merchant partner availability and regional credit appetite.",
      },
      {
        service: "performance-marketing",
        detail:
          "Ran a multi-channel acquisition program across paid search, social, and app install campaigns with city-tier specific creative and offers.",
      },
      {
        service: "demand-generation",
        detail:
          "Built activation and onboarding lifecycle flows to move new sign-ups through KYC and first purchase, reducing drop-off at the highest-friction step in the funnel.",
      },
    ],
    results: [
      { label: "Customers activated", value: "100,000" },
      { label: "Timeline", value: "12 months" },
      { label: "Cities covered", value: "180+" },
    ],
    quote: {
      text: "Scaling a regulated financial product across India means every city behaves differently. Markoholics understood that nuance and built a GTM plan that actually held up at volume.",
      attribution: "Director of Growth, Snapmint",
    },
    gallery: [
      "PAN-India city-tier rollout map",
      "Activation and KYC funnel flow",
      "City-specific paid creative set",
      "Merchant partner acquisition dashboard",
    ],
  },
];

export const clients = caseStudies.map((c) => ({
  name: c.name,
  domain: c.domain,
  slug: c.slug,
}));

export const proofMetrics = [
  { label: "Pipeline generated for clients", value: 42, prefix: "$", suffix: "M+" },
  { label: "Average CAC reduction", value: 28, suffix: "%" },
  { label: "Tech founders and companies scaled", value: 10, suffix: "+" },
  { label: "Disciplines under one roof", value: 6, suffix: "" },
];

export const approachSteps = [
  {
    index: "01",
    name: "Diagnose",
    detail:
      "We audit the funnel as it actually performs, not as the dashboard claims. Channel by channel, stage by stage, against the numbers that matter to your board and your runway.",
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
      "We run the engine. Content, social, paid, demand gen, and AI-assisted workflows working as one motion, not five disconnected vendors.",
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
