// POST /api/gtm-index/analyze: runs the two-call Markoholics GTM Index
// pipeline (Evidence Collector, then Index Analyst) for a company URL,
// validates the scored result against the evidence ledger, persists it,
// and returns only the gated public summary. See src/app/gtm-index/README.md.
import { NextResponse } from "next/server";
import { getClientIp, isRateLimited } from "@/lib/roundtable/rateLimit";
import { runEvidenceCollector, runIndexAnalyst, retryIndexAnalyst } from "@/lib/gtmIndex/anthropic";
import { validateScoredReport } from "@/lib/gtmIndex/validate";
import { createReport, findRecentReportByDomain } from "@/lib/gtmIndex/store";
import { buildAnalystRetryMessage } from "@/lib/gtmIndex/prompts";
import type { GtmIndexPublicResult, ScoredReport } from "@/lib/gtmIndex/types";

// The pipeline runs two sequential model calls, one with up to 12 tool
// calls against the open web; this routinely takes well past a minute.
export const maxDuration = 300;

const MAX_PER_HOUR = 3;
const WINDOW_MS = 60 * 60 * 1000;

const FRIENDLY_ERROR =
  "Something went wrong running the audit. Please try again in a minute, or reach out if it keeps failing.";

function normalizeUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(withScheme);
    if (!url.hostname.includes(".")) return null;
    return url.toString();
  } catch {
    return null;
  }
}

function hostnameFor(url: string): string {
  return new URL(url).hostname.replace(/^www\./, "");
}

function toPublicResult(
  reportId: string | null,
  scored: ScoredReport,
  cached: boolean
): GtmIndexPublicResult {
  return {
    status: scored.status,
    message: scored.message,
    reportId,
    companyName: scored.company_name,
    companyDomain: scored.company_domain,
    index: scored.status === "ok" ? scored.index : null,
    summary: scored.status === "ok" ? scored.summary : null,
    cached,
  };
}

function insufficientDataResult(message: string, companyName: string, companyDomain: string): GtmIndexPublicResult {
  return {
    status: "insufficient_data",
    message,
    reportId: null,
    companyName,
    companyDomain,
    index: null,
    summary: null,
    cached: false,
  };
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const companyUrlRaw = typeof body.companyUrl === "string" ? body.companyUrl : "";
  const companyUrl = normalizeUrl(companyUrlRaw);
  if (!companyUrl) {
    return NextResponse.json({ error: "Please enter a valid company website URL." }, { status: 400 });
  }

  const linkedinUrl = typeof body.linkedinUrl === "string" && body.linkedinUrl.trim() ? body.linkedinUrl.trim() : null;
  const instagramUrl =
    typeof body.instagramUrl === "string" && body.instagramUrl.trim() ? body.instagramUrl.trim() : null;
  const xUrl = typeof body.xUrl === "string" && body.xUrl.trim() ? body.xUrl.trim() : null;

  const ip = getClientIp(request);
  if (await isRateLimited(`gtm-index:analyze:${ip}`, MAX_PER_HOUR, WINDOW_MS)) {
    return NextResponse.json(
      { error: "You've hit the limit for running audits. Please try again in an hour." },
      { status: 429 }
    );
  }

  const domainKey = hostnameFor(companyUrl);

  try {
    const cached = await findRecentReportByDomain(domainKey);
    if (cached) {
      return NextResponse.json(toPublicResult(cached.id, cached.scored, true));
    }
  } catch (error) {
    // A cache-lookup failure should never block a fresh run.
    console.error("GTM Index cache lookup threw:", error);
  }

  try {
    const ledger = await runEvidenceCollector({
      companyUrl,
      linkedinUrl: linkedinUrl ?? undefined,
      instagramUrl: instagramUrl ?? undefined,
      xUrl: xUrl ?? undefined,
    });

    if (ledger.status === "insufficient_data") {
      return NextResponse.json(
        insufficientDataResult(
          ledger.message ?? "We couldn't gather enough public information to run this audit.",
          ledger.company_name || domainKey,
          ledger.company_domain || domainKey
        )
      );
    }

    let turn = await runIndexAnalyst(ledger);
    const { valid: firstValid, issues } = validateScoredReport(ledger, turn.report);
    let valid = firstValid;

    if (!valid) {
      console.error("GTM Index Call 2 failed validation, retrying once:", issues);
      const retried = await retryIndexAnalyst(turn.messages, turn.assistantContent, buildAnalystRetryMessage(issues));
      const revalidated = validateScoredReport(ledger, retried);
      if (revalidated.valid) {
        turn = { ...turn, report: retried };
        valid = true;
      } else {
        console.error("GTM Index Call 2 retry also failed validation:", revalidated.issues);
      }
    }

    if (!valid || turn.report.status === "insufficient_data") {
      return NextResponse.json(
        insufficientDataResult(
          "We couldn't produce a reliable, evidence-backed score for this company. Please try again later.",
          ledger.company_name || domainKey,
          ledger.company_domain || domainKey
        )
      );
    }

    const reportId = await createReport({
      companyUrl,
      linkedinUrl,
      instagramUrl,
      xUrl,
      visitorIp: ip,
      ledger,
      scored: turn.report,
    });

    return NextResponse.json(toPublicResult(reportId, turn.report, false));
  } catch (error) {
    console.error("GTM Index analyze pipeline failed:", error);
    return NextResponse.json({ error: FRIENDLY_ERROR }, { status: 500 });
  }
}
