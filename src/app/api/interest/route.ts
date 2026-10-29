import { NextRequest, NextResponse } from "next/server";
import {
  buildInterestSchema,
  serverEnforceBusinessEmail,
  type InterestFormValues,
} from "@/lib/roundtable/schema";
import { sendThankYouEmail, sendInternalNotification } from "@/lib/roundtable/email";
import { backupToGoogleSheets } from "@/lib/roundtable/sheets";
import { isRateLimited, getClientIp } from "@/lib/roundtable/rateLimit";

// A real visitor can't submit faster than this; a bot filling and
// submitting the form programmatically usually can. Paired with the
// honeypot field below for bot protection with no CAPTCHA.
const MIN_TIME_ON_PAGE_MS = 3000;
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const ip = getClientIp(request);
  if (await isRateLimited(`interest:${ip}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later." },
      { status: 429 }
    );
  }

  const schema = buildInterestSchema({ enforceBusinessEmail: serverEnforceBusinessEmail() });
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Please check the highlighted fields.",
        fieldErrors: parsed.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 400 }
    );
  }

  const data: InterestFormValues = parsed.data;

  // Honeypot: a real visitor never sees or fills this field. A filled
  // honeypot or a too-fast submission is silently accepted (so the bot
  // gets a generic success and no signal that it was caught) but neither
  // email is sent.
  const isBot =
    data.websiteUrlConfirm.trim().length > 0 ||
    Date.now() - data.formRenderedAt < MIN_TIME_ON_PAGE_MS;
  if (isBot) {
    return NextResponse.json({ success: true }, { status: 201 });
  }

  const timestampIso = new Date().toISOString();
  const ipCountry = request.headers.get("x-vercel-ip-country") ?? undefined;
  const meta = {
    timestampIso,
    ref: data.ref,
    utmSource: data.utmSource,
    utmMedium: data.utmMedium,
    utmCampaign: data.utmCampaign,
    utmTerm: data.utmTerm,
    utmContent: data.utmContent,
    referrer: data.referrer,
    ipCountry,
  };

  // Internal notification first and loud: losing a lead is worse than
  // showing the visitor a (truthful) error, so a failure here is returned
  // to the client rather than swallowed.
  const internalSent = await sendInternalNotification(data, meta);
  if (!internalSent) {
    console.error("Roundtable interest: internal notification failed for", data.businessEmail);
    return NextResponse.json(
      {
        error: "We could not record your interest just now. Please try again, or email us directly.",
      },
      { status: 500 }
    );
  }

  // Thank you email is best effort: if it fails, the lead is already
  // safely recorded via the internal notification above, so still return
  // success to the visitor and just log it.
  const thankYouSent = await sendThankYouEmail(data);
  if (!thankYouSent) {
    console.error("Roundtable interest: thank you email failed for", data.businessEmail);
  }

  // Non-blocking, best effort, never affects the response either way.
  void backupToGoogleSheets(data, meta);

  return NextResponse.json({ success: true }, { status: 201 });
}
