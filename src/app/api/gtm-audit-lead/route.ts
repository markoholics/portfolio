import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";
import { sendGtmAuditLeadEmail } from "@/lib/email";

const KNOWN_SOURCES = ["gtm-audit-landing", "free-gtm-audit-landing"];

// Fallback lead capture for /gtm-audit and /free-gtm-audit. Writes to the
// gtm_audit_leads Supabase table (see supabase/gtm_audit_leads.sql) AND
// emails the team via Resend (see src/lib/email.ts) — independently of
// each other, so a Supabase outage doesn't silently swallow a lead the
// team never sees, and a missing/misconfigured email provider doesn't
// block the database record. The submission only fails if BOTH channels
// fail.
export async function POST(request: NextRequest) {
  let body: {
    name?: string;
    email?: string;
    company?: string;
    website?: string;
    source?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = body.name?.trim();
  const email = body.email?.trim();
  const company = body.company?.trim() ?? null;
  const website = body.website?.trim() ?? null;
  const source = KNOWN_SOURCES.includes(body.source ?? "")
    ? (body.source as string)
    : "gtm-audit-landing";
  const utm_source = body.utm_source?.trim() ?? null;
  const utm_medium = body.utm_medium?.trim() ?? null;
  const utm_campaign = body.utm_campaign?.trim() ?? null;

  if (!name || !email) {
    return NextResponse.json(
      { error: "Name and email are required." },
      { status: 400 }
    );
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  let savedToDatabase = false;
  try {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from("gtm_audit_leads").insert({
      name,
      email,
      company,
      website,
      source,
      utm_source,
      utm_medium,
      utm_campaign,
    });

    if (error) {
      console.error("Supabase insert error:", error.message);
    } else {
      savedToDatabase = true;
    }
  } catch (err) {
    console.error("GTM audit lead form (Supabase) error:", err);
  }

  const emailSent = await sendGtmAuditLeadEmail({ name, email, company, website, source });

  if (!savedToDatabase && !emailSent) {
    return NextResponse.json(
      { error: "Could not save your submission. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
