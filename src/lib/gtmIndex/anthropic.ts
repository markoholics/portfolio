// The two Claude API calls behind the Markoholics GTM Index: the Evidence
// Collector (web_search + web_fetch, Call 1) and the Index Analyst (no
// tools, Call 2). Both stream (per the GTM Index's long outputs) and both
// resolve through a shared JSON-extraction helper, since each is prompted
// to return exactly one JSON object and nothing else.
import Anthropic from "@anthropic-ai/sdk";
import {
  EVIDENCE_COLLECTOR_SYSTEM_PROMPT,
  INDEX_ANALYST_SYSTEM_PROMPT,
  buildAnalystUserMessage,
  buildCollectorUserMessage,
} from "@/lib/gtmIndex/prompts";
import type { EvidenceLedger, GtmIndexAnalyzeInput, ScoredReport } from "@/lib/gtmIndex/types";

const COLLECTOR_MODEL = process.env.GTM_INDEX_COLLECTOR_MODEL || "claude-sonnet-5-5";
const ANALYST_MODEL = process.env.GTM_INDEX_ANALYST_MODEL || "claude-opus-5-5";

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY is not configured.");
    }
    client = new Anthropic();
  }
  return client;
}

// Claude is instructed to return one JSON object and nothing else, but
// strips a stray code fence or a sentence of preamble/postamble defensively
// rather than trusting that instruction to hold on every response.
function extractJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : text;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) {
    throw new Error("No JSON object found in model response.");
  }
  return JSON.parse(candidate.slice(start, end + 1));
}

function textFromMessage(message: Anthropic.Message): string {
  return message.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("\n");
}

export async function runEvidenceCollector(input: GtmIndexAnalyzeInput): Promise<EvidenceLedger> {
  const anthropic = getClient();
  const messages: Anthropic.MessageParam[] = [
    { role: "user", content: buildCollectorUserMessage(input) },
  ];

  let finalMessage: Anthropic.Message | null = null;

  // Server tools (web_search / web_fetch) resolve inside the API; a long
  // tool-heavy turn can still come back as pause_turn, in which case we
  // just resend to let the server continue it, same as any other turn.
  for (let i = 0; i < 6; i++) {
    const stream = anthropic.messages.stream({
      model: COLLECTOR_MODEL,
      max_tokens: 8000,
      system: EVIDENCE_COLLECTOR_SYSTEM_PROMPT,
      thinking: { type: "adaptive" },
      output_config: { effort: "high" },
      tools: [
        { type: "web_search_20260209", name: "web_search", max_uses: 6 },
        { type: "web_fetch_20260209", name: "web_fetch", max_uses: 8 },
      ],
      messages,
    });
    const message = await stream.finalMessage();

    if (message.stop_reason === "pause_turn") {
      messages.push({ role: "assistant", content: message.content });
      continue;
    }

    finalMessage = message;
    break;
  }

  if (!finalMessage) {
    throw new Error("Evidence Collector did not complete within the tool-call budget.");
  }
  if (finalMessage.stop_reason === "refusal") {
    throw new Error("Evidence Collector declined to run for this input.");
  }

  const text = textFromMessage(finalMessage);
  return extractJson(text) as EvidenceLedger;
}

export interface AnalystTurn {
  report: ScoredReport;
  messages: Anthropic.MessageParam[];
  assistantContent: Anthropic.ContentBlock[];
}

export async function runIndexAnalyst(ledger: EvidenceLedger): Promise<AnalystTurn> {
  const anthropic = getClient();
  const ledgerJson = JSON.stringify(ledger);
  const messages: Anthropic.MessageParam[] = [
    { role: "user", content: buildAnalystUserMessage(ledgerJson) },
  ];

  const stream = anthropic.messages.stream({
    model: ANALYST_MODEL,
    max_tokens: 16000,
    system: INDEX_ANALYST_SYSTEM_PROMPT,
    thinking: { type: "adaptive" },
    output_config: { effort: "high" },
    messages,
  });
  const message = await stream.finalMessage();

  if (message.stop_reason === "refusal") {
    throw new Error("Index Analyst declined to score this ledger.");
  }

  const text = textFromMessage(message);
  return { report: extractJson(text) as ScoredReport, messages, assistantContent: message.content };
}

// A corrective retry: same system prompt and ledger, with the original
// assistant turn appended and a follow-up user message describing what
// failed, so Claude corrects in place instead of starting over blind.
export async function retryIndexAnalyst(
  previousMessages: Anthropic.MessageParam[],
  previousAssistantContent: Anthropic.ContentBlock[],
  retryUserMessage: string
): Promise<ScoredReport> {
  const anthropic = getClient();
  const messages: Anthropic.MessageParam[] = [
    ...previousMessages,
    { role: "assistant", content: previousAssistantContent },
    { role: "user", content: retryUserMessage },
  ];

  const stream = anthropic.messages.stream({
    model: ANALYST_MODEL,
    max_tokens: 16000,
    system: INDEX_ANALYST_SYSTEM_PROMPT,
    thinking: { type: "adaptive" },
    output_config: { effort: "high" },
    messages,
  });
  const message = await stream.finalMessage();

  if (message.stop_reason === "refusal") {
    throw new Error("Index Analyst declined to score this ledger on retry.");
  }

  const text = textFromMessage(message);
  return extractJson(text) as ScoredReport;
}
