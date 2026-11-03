// POST /api/gtm-index/deliver: validates the visitor's name, work email
// and consent, emails the full GTM Index report (Template C), posts an
// internal Slack alert with the hidden ICP-fit block, and marks the
// stored report delivered. The full_report and internal block never
// reach the browser from this route either, only a success/error flag.
import { NextResponse } from "next/server";
import { getClientIp, isRateLimited } from "@/lib/roundtable/rateLimit";
import { isBlockedEmailDomain, serverEnforceBusinessEmail } from "@/lib/roundtable/schema";
import { getReportById, markDelivered } from "@/lib/gtmIndex/store";
import { sendGtmIndexReportEmail } from "@/lib/gtmIndex/email";
import { sendSlackAlert } from "@/lib/slack";

export const maxDuration = 30;

const MAX_PER_HOUR = 5;
const WINDOW_MS = 60 * 60 * 1000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidWorkEmail(email: string): boolean {
  if (!EMAIL_PATTERN.test(email)) return false;
  if (serverEnforceBusinessEmail() && isBlockedEmailDomain(email)) return false;
  return true;
}

// Best-effort MX lookup: a strong signal when it resolves, never a reason
// to block a submission when it doesn't (DNS can be slow or unreachable
// from a serverless function, and that is not the visitor's fault).
async function hasMxRecord(email: string): Promise<boolean | null> {
  const domain = email.split("@")[1];
  if (!domain) return null;
  try {
    const dns = await import("node:dns/promises");
    const records = await dns.resolveMx(domain);
    return records.length > 0;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const reportId = typeof body.reportId === "string" ? body.reportId : "";
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const consent = body.consent === true;

  if (!reportId) {
    return NextResponse.json({ error: "Missing report." }, { status: 400 });
  }
  if (!name) {
    return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  }
  if (!isValidWorkEmail(email)) {
    return NextResponse.json(
      { error: "Please enter a valid work email address (not a free provider)." },
      { status: 400 }
    );
  }
  if (!consent) {
    return NextResponse.json({ error: "Please agree to receive the report by email." }, { status: 400 });
  }

  const ip = getClientIp(request);
  if (await isRateLimited(`gtm-index:deliver:${ip}`, MAX_PER_HOUR, WINDOW_MS)) {
    return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
  }

  try {
    const row = await getReportById(reportId);
    if (!row || row.status !== "ok") {
      return NextResponse.json({ error: "We couldn't find that report." }, { status: 404 });
    }

    const domainMatches = email.split("@")[1]?.toLowerCase() === row.company_domain.toLowerCase();
    const mxFound = await hasMxRecord(email);

    const sent = await sendGtmIndexReportEmail({
      recipientName: name,
      recipientEmail: email,
      report: row.scored,
    });

    if (!sent) {
      return NextResponse.json(
        { error: "We couldn't send the report email. Please try again shortly." },
        { status: 502 }
      );
    }

    await markDelivered({ id: row.id, recipientName: name, recipientEmail: email });

    const internal = row.scored.internal;
    const signalParts = [
      domainMatches ? "email domain matches audited company" : "email domain differs from audited company",
      mxFound === null ? "MX check inconclusive" : mxFound ? "MX record found" : "no MX record found",
    ];
    await sendSlackAlert(
      `New GTM Index lead: ${name} (${email}) for ${row.company_name} (${row.company_domain}). ` +
        `Score ${row.index_score}/100, ${row.index_band}. ICP fit: ${internal?.icp_fit ?? "unknown"}. ` +
        `${internal?.suggested_call_angle ?? ""} [${signalParts.join(", ")}]`
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("GTM Index deliver route failed:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
