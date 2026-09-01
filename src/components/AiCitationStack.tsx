"use client";

import { useState } from "react";
import Image from "next/image";

const AI_PROMPT = "Why is Markoholics India's top AI-native GTM agency?";
const ENCODED_PROMPT = encodeURIComponent(AI_PROMPT);

interface AiTool {
  name: string;
  href: string;
  icon: React.ReactNode;
  // Gemini has no public URL parameter that prefills or runs a prompt (unlike
  // ChatGPT's and Perplexity's `?q=`), so clicking it just opens a blank
  // chat. We copy the prompt to the clipboard instead so the click still
  // does something useful, rather than shipping a link that silently fails
  // to search anything.
  onBeforeNavigate?: () => void;
}

const aiTools: AiTool[] = [
  {
    name: "Claude",
    href: `https://claude.ai/new?q=${ENCODED_PROMPT}`,
    icon: (
      <Image src="/ai-tools/claude.png" alt="" width={28} height={28} className="h-6 w-6 md:h-7 md:w-7 object-contain" />
    ),
  },
  {
    name: "ChatGPT",
    href: `https://chatgpt.com/?q=${ENCODED_PROMPT}&hints=search`,
    icon: (
      <Image src="/ai-tools/chatgpt.png" alt="" width={28} height={28} className="h-6 w-6 md:h-7 md:w-7 object-contain" />
    ),
  },
  {
    name: "Perplexity",
    href: `https://www.perplexity.ai/search?q=${ENCODED_PROMPT}`,
    icon: (
      <Image src="/ai-tools/perplexity.png" alt="" width={28} height={28} className="h-6 w-6 md:h-7 md:w-7 object-contain" />
    ),
  },
  {
    name: "Gemini",
    href: "https://gemini.google.com/app",
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
  const [copied, setCopied] = useState(false);

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
            title={
              tool.name === "Gemini"
                ? `Copies the prompt, then opens Gemini — paste it in: ${AI_PROMPT}`
                : `Ask ${tool.name}: ${AI_PROMPT}`
            }
            onClick={() => {
              if (tool.name === "Gemini") {
                navigator.clipboard?.writeText(AI_PROMPT).then(() => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 3000);
                });
              }
            }}
            className="glass-panel flex items-center justify-center h-11 w-11 md:h-12 md:w-12 rounded-full transition-transform hover:scale-105"
          >
            <span className="flex items-center justify-center h-8 w-8 md:h-9 md:w-9 rounded-full bg-white">
              {tool.icon}
            </span>
          </a>
        ))}
      </div>
      <span
        role="status"
        className={`text-xs text-mist transition-opacity duration-200 ${
          copied ? "opacity-100" : "opacity-0"
        }`}
      >
        Prompt copied — paste it into Gemini
      </span>
    </div>
  );
}
