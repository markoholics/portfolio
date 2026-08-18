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

export interface PricingTier {
  index: string;
  name: string;
  price: string;
  period: string;
  description: string;
  deliverables: string[];
  cta: string;
  href: string;
  highlight: boolean;
}

export const pricingTiers: PricingTier[] = [
  {
    index: "01",
    name: "GTM Audit",
    price: "$500",
    period: "one-time",
    description:
      "A 2-week diagnostic that reveals exactly where your GTM motion is leaking revenue — before you spend another dollar scaling it.",
    deliverables: [
      "Full funnel audit, channel by channel",
      "AI readiness score",
      "Competitive positioning gap analysis",
      "15-page strategic report",
      "60-minute strategy call with findings",
    ],
    cta: "Book an Audit",
    href: "https://calendly.com/markoholics/30min",
    highlight: false,
  },
  {
    index: "02",
    name: "Growth Engine",
    price: "$3,500",
    period: "/month",
    description:
      "Full GTM execution: strategy, content, paid, social, and demand gen — run as one AI-augmented motion, not five disconnected vendors.",
    deliverables: [
      "GTM strategy and operating plan",
      "AI-assisted content and social programs",
      "Performance and demand gen execution",
      "Weekly sprint calls, monthly strategy reviews",
      "Minimum 3-month engagement",
    ],
    cta: "Book a GTM Strategy Call",
    href: "https://calendly.com/markoholics/30min",
    highlight: true,
  },
  {
    index: "03",
    name: "AI-First Scale",
    price: "$6,500",
    period: "/month",
    description:
      "Everything in Growth Engine plus custom AI tool deployment, prompt libraries, and a dedicated AI ops lead for companies ready to scale autonomously.",
    deliverables: [
      "Everything in Growth Engine",
      "Custom AI workflow and prompt library builds",
      "Internal automation and GPT deployment",
      "Dedicated AI ops lead",
      "Quarterly board-ready reporting",
    ],
    cta: "Apply for Scale",
    href: "/contact",
    highlight: false,
  },
];

export interface CaseStudy {
  slug: string;
  name: string;
  domain: string;
  sector: string;
  oneLiner: string;
  metaDescription?: string;
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
    oneLiner: "500 sales-qualified leads and 50 new customers in a single quarter, from one GTM system.",
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
    oneLiner: "$500K+ in POC pipeline across 3 markets in 6 months, from a standing start with no sales team.",
    servicesUsed: ["content-marketing", "social-media-marketing", "demand-generation"],
    challenge:
      "Byosync had built a trust and consent configuration layer for handling sensitive user data, but needed market validation before pursuing larger enterprise contracts globally. The goal was to generate proof-of-concept partnerships across Southeast Asia and the US with technology startups who could become reference customers and integration case studies.",
    strategy: [
      {
        service: "content-marketing",
        detail:
          "Built a technical content program, including integration guides and security-first explainers, aimed directly at the engineering and product leaders who evaluate trust infrastructure vendors across global markets.",
      },
      {
        service: "social-media-marketing",
        detail:
          "Established a founder-led presence on LinkedIn and X to build credibility inside the developer and startup security community ahead of outbound partnership conversations.",
      },
      {
        service: "demand-generation",
        detail:
          "Ran a targeted partnership outreach motion against a curated list of 120 startups across three markets, paired with lifecycle nurture for prospects not yet ready to commit.",
      },
    ],
    results: [
      { label: "POC pipeline value", value: "$500K+" },
      { label: "Markets entered", value: "3" },
      { label: "Outbound to POC conversion rate", value: "8.3%" },
    ],
    quote: {
      text: "We needed proof in the market, not another deck. Markoholics got us in front of the right startups and turned conversations into signed pilots faster than we expected.",
      attribution: "Co-Founder, Byosync",
    },
    gallery: [
      "Partnership outreach pipeline",
      "Technical integration guide layout",
      "Founder-led content series",
      "POC tracking dashboard",
    ],
  },
  {
    slug: "aditi-consulting",
    name: "Aditi Consulting",
    domain: "aditiconsulting.com",
    sector: "Technology, Digital Engineering Services",
    oneLiner: "64% branded search growth from a content-led repositioning that shifted perception from staffing firm to digital engineering partner.",
    metaDescription:
      "How Markoholics repositioned Aditi Consulting from staffing firm to digital engineering partner, driving 64% branded search growth.",
    servicesUsed: ["content-marketing", "gtm-strategy", "ai-strategy"],
    challenge:
      "Aditi Consulting, a multinational digital engineering services firm, was widely perceived as a technology recruitment firm rather than a full digital engineering and consulting partner. The brand needed a content-led repositioning to win consideration for larger, higher-value engineering and transformation engagements.",
    strategy: [
      {
        service: "gtm-strategy",
        detail:
          "Redefined positioning around digital engineering, cloud, and data capabilities, distancing the brand from its staffing-firm reputation while preserving existing client trust.",
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
      { label: "Branded search growth", value: "64%" },
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
      "Content calendar and distribution system",
      "AI capability positioning deck",
    ],
  },
  {
    slug: "snapmint",
    name: "Snapmint",
    domain: "snapmint.com",
    sector: "Technology, NBFC E-commerce Financing",
    oneLiner: "100,000 customers activated across 180+ cities in 12 months with a city-tier GTM engine.",
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
      text: "Scaling a regulated financial product across multiple geographies means every market behaves differently. Markoholics understood that nuance and built a GTM plan that actually held up at volume.",
      attribution: "Director of Growth, Snapmint",
    },
    gallery: [
      "City-tier rollout map",
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
  { label: "Pipeline generated for clients", value: 10, prefix: "$", suffix: "M+" },
  { label: "Average CAC reduction", value: 28, suffix: "%" },
  { label: "Tech founders and companies scaled", value: 10, suffix: "+" },
  { label: "Days to first results", value: 30, suffix: "" },
];

export const approachSteps = [
  {
    index: "01",
    name: "Diagnose",
    detail:
      "AI-assisted funnel audit. We map the gaps between your current GTM motion and the growth targets on your board deck, channel by channel, stage by stage.",
  },
  {
    index: "02",
    name: "Architect",
    detail:
      "GTM system design. Positioning, channel mix, content architecture, and the AI workflow stack that lets three people do the work of ten.",
  },
  {
    index: "03",
    name: "Execute",
    detail:
      "We run the engine. Content, social, paid, and demand gen operating as one autonomous motion, not five disconnected vendors fighting over budget.",
  },
  {
    index: "04",
    name: "Compound",
    detail:
      "Continuous optimization. We instrument everything we ship, kill what underperforms, and reinvest in what compounds, quarter over quarter without guesswork.",
  },
];

export interface FAQItem {
  q: string;
  a: string;
}

export const faqItems: FAQItem[] = [
  {
    q: "Do you work with non-tech companies?",
    a: "We specialize in tech, SaaS, and AI-native companies. This focus is why we deliver results generalist agencies cannot. If you are building a technology product, you are in the right place.",
  },
  {
    q: "What if we are not based in the US?",
    a: "We work with founders globally across the US, UK, Singapore, Dubai, and beyond. Our team operates across time zones and our entire workflow is async-first.",
  },
  {
    q: "How is this different from hiring in-house?",
    a: "You get a full GTM team covering strategy, content, paid, social, demand gen, and AI ops for less than one senior marketing hire. No recruiting, no ramp time, no benefits overhead.",
  },
  {
    q: "What is the minimum commitment?",
    a: "Three months for Growth Engine and AI-First Scale engagements. GTM is a system that compounds over time, not a campaign that resets every 30 days.",
  },
  {
    q: "What does AI-native actually mean for our marketing?",
    a: "It means we use AI to collapse the time and cost of content production, campaign analysis, and reporting, so the same budget delivers significantly more output. You get speed without sacrificing quality or strategic judgment.",
  },
  {
    q: "How quickly can we see results?",
    a: "Most clients see early pipeline indicators within 30 days. Compounding returns on content and demand gen typically emerge in months two and three. We instrument everything so you can see exactly what is working.",
  },
  {
    q: "What does the engagement process look like?",
    a: "We start with a 30-minute strategy call. If there is a fit, we send the agreement and first invoice. Work begins upon payment. Most clients are live within 7 days of signing.",
  },
];

export const servicesFaqItems: FAQItem[] = faqItems.filter((item) =>
  [
    "What is the minimum commitment?",
    "How is this different from hiring in-house?",
    "What does the engagement process look like?",
  ].includes(item.q)
);

export const aboutFaqItems: FAQItem[] = faqItems.filter((item) =>
  ["Do you work with non-tech companies?", "What if we are not based in the US?"].includes(
    item.q
  )
);

export const workFaqItems: FAQItem[] = [
  {
    q: "How are these case studies selected?",
    a: "We only publish engagements where we ran the full GTM motion, not a single campaign, and where the client agreed to share real numbers. Every result on this page is what we actually delivered.",
  },
  {
    q: "Can I speak with these clients as references?",
    a: "Yes. We connect qualified prospects with reference clients during the sales process, subject to each client's availability and NDA terms.",
  },
];

export const contactFaqItems: FAQItem[] = [
  {
    q: "What happens after I submit this form?",
    a: "We review your details and respond within one business day, usually with a few qualifying questions or a link to book a 30-minute strategy call directly.",
  },
  {
    q: "How quickly will you respond?",
    a: "Within one business day. If your inquiry is time-sensitive, mention it in your message or book a call directly via Calendly instead of waiting on email.",
  },
  {
    q: "Do you work with founders outside the US?",
    a: "Yes. We work with tech founders globally, including the UK, Singapore, and Dubai, and our workflow is async-first to accommodate time zone differences.",
  },
];

export interface Partner {
  name: string;
  description: string;
  href?: string;
}

export const strategicPartners: Partner[] = [
  {
    name: "Varmis Arc",
    description: "Strategic technology partner",
    href: undefined,
  },
  {
    name: "Human to the Power of AI",
    description: "Strategic AI partner",
    href: undefined,
  },
];

export const navLinks = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const CONTACT_EMAIL = "markoholics@outlook.com";
