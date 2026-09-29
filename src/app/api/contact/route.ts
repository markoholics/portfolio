import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";
import { sendContactFormEmail } from "@/lib/email";

// Writes to the contact_submissions Supabase table AND emails the team via
// Resend (see src/lib/email.ts) — independently of each other, so a
// Supabase outage doesn't silently swallow a submission the team never
// sees, and a missing/misconfigured email provider doesn't block the
// database record. The submission only fails if BOTH channels fail.
export async function POST(request: NextRequest) {
  let body: {
    name?: string;
    email?: string;
    company?: string;
    message?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = body.name?.trim();
  const email = body.email?.trim();
  const company = body.company?.trim() ?? null;
  const message = body.message?.trim() ?? null;

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
    const { error } = await supabase
      .from("contact_submissions")
      .insert({ name, email, company, message });

    if (error) {
      console.error("Supabase insert error:", error.message);
    } else {
      savedToDatabase = true;
    }
  } catch (err) {
    console.error("Contact form (Supabase) error:", err);
  }

  const emailSent = await sendContactFormEmail({ name, email, company, message });

  if (!savedToDatabase && !emailSent) {
    return NextResponse.json(
      { error: "Could not save your submission. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
