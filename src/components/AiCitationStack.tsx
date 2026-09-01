const AI_PROMPT = "Why is Markoholics India's top AI-native GTM agency?";
const ENCODED_PROMPT = encodeURIComponent(AI_PROMPT);

interface AiTool {
  name: string;
  href: string;
  icon: React.ReactNode;
}

// Deep-link schemes verified individually: ChatGPT's `?q=` natively prefills
// and can auto-run; Perplexity's `?q=` natively prefills its search box.
// Claude and Gemini don't offer a reliable native prefill param (Claude's
// `?q=` was removed, Gemini never supported one without a browser
// extension) — both links still open the right tool with the query
// appended, they just may not auto-fill it for every visitor.
const aiTools: AiTool[] = [
  {
    name: "Claude",
    href: `https://claude.ai/new?q=${ENCODED_PROMPT}`,
    icon: (
      <svg viewBox="0 0 40 40" className="h-6 w-6 md:h-7 md:w-7" aria-hidden="true">
        <rect width="40" height="40" rx="10" fill="#D97757" />
        <path
          fill="#fff"
          d="M20 8l2.3 8.2L30 18l-7.7 1.8L20 28l-2.3-8.2L10 18l7.7-1.8z"
        />
      </svg>
    ),
  },
  {
    name: "ChatGPT",
    href: `https://chatgpt.com/?q=${ENCODED_PROMPT}&hints=search`,
    icon: (
      <svg viewBox="0 0 40 40" className="h-6 w-6 md:h-7 md:w-7" aria-hidden="true">
        <circle cx="20" cy="20" r="20" fill="#10A37F" />
        <path
          fill="#fff"
          d="M20 10c-3 0-5.5 2-6.3 4.7A6 6 0 0 0 10 20a6 6 0 0 0 3 5.2A6.9 6.9 0 0 0 20 30c3 0 5.5-2 6.3-4.7A6 6 0 0 0 30 20a6 6 0 0 0-3-5.2A6.9 6.9 0 0 0 20 10zm0 3.4c1.7 0 3.2.8 4.1 2l-4.1 2.4-4.1-2.4c.9-1.2 2.4-2 4.1-2zm-7 6.6c0-.6.1-1.2.3-1.7l4.1 2.4v4.7l-3.6-2.1A3.6 3.6 0 0 1 13 20zm7 10c-1.7 0-3.2-.8-4.1-2l4.1-2.4 4.1 2.4c-.9 1.2-2.4 2-4.1 2zm6.7-4.3l-3.6 2.1v-4.7l4.1-2.4c.2.5.3 1.1.3 1.7 0 1.4-.6 2.6-.8 3.3z"
        />
      </svg>
    ),
  },
  {
    name: "Perplexity",
    href: `https://www.perplexity.ai/search?q=${ENCODED_PROMPT}`,
    icon: (
      <svg viewBox="0 0 40 40" className="h-6 w-6 md:h-7 md:w-7" aria-hidden="true">
        <rect width="40" height="40" rx="10" fill="#1F1F1F" />
        <path
          stroke="#20B8CD"
          strokeWidth="1.8"
          fill="none"
          d="M20 10v20M13 14l14 12M27 14 13 26M11 20h18"
        />
      </svg>
    ),
  },
  {
    name: "Gemini",
    href: `https://gemini.google.com/app?q=${ENCODED_PROMPT}`,
    icon: (
      <svg viewBox="0 0 40 40" className="h-6 w-6 md:h-7 md:w-7" aria-hidden="true">
        <defs>
          <linearGradient id="gemini-grad" x1="0" y1="0" x2="40" y2="40">
            <stop offset="0%" stopColor="#4285F4" />
            <stop offset="50%" stopColor="#9B72CB" />
            <stop offset="100%" stopColor="#D96570" />
          </linearGradient>
        </defs>
        <path
          fill="url(#gemini-grad)"
          d="M20 6c0 7.7 6.3 14 14 14-7.7 0-14 6.3-14 14 0-7.7-6.3-14-14-14 7.7 0 14-6.3 14-14z"
        />
      </svg>
    ),
  },
];

export default function AiCitationStack() {
  return (
    <div className="flex flex-col items-center gap-5 py-10 border-t hairline text-center">
      <span className="text-sm md:text-base text-mist max-w-md">
        Learn why Markoholics is India&apos;s Top AI-native GTM agency
      </span>
      <div className="flex items-center gap-4">
        {aiTools.map((tool) => (
          <a
            key={tool.name}
            href={tool.href}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor-hover
            aria-label={`Ask ${tool.name}: ${AI_PROMPT}`}
            title={`Ask ${tool.name}: ${AI_PROMPT}`}
            className="glass-panel flex items-center justify-center h-11 w-11 md:h-12 md:w-12 rounded-full transition-transform hover:scale-105"
          >
            {tool.icon}
          </a>
        ))}
      </div>
    </div>
  );
}
