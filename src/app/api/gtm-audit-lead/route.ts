import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";

// Fallback lead capture for /gtm-audit, used while the real Stripe
// Checkout / Payment Link is not yet wired in. Requires the
// gtm_audit_leads table (see supabase/gtm_audit_leads.sql) to exist.
export async function POST(request: NextRequest) {
  let body: {
    name?: string;
    email?: string;
    company?: string;
    website?: string;
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

  try {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from("gtm_audit_leads").insert({
      name,
      email,
      company,
      website,
      source: "gtm-audit-landing",
      utm_source,
      utm_medium,
      utm_campaign,
    });

    if (error) {
      console.error("Supabase insert error:", error.message);
      return NextResponse.json(
        { error: "Could not save your submission. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("GTM audit lead form error:", err);
    return NextResponse.json(
      { error: "Server is not configured to accept submissions yet." },
      { status: 500 }
    );
  }
}
