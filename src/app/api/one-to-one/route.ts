// POST /api/one-to-one: the short "prefer a 1:1 instead" form on the
// roundtable page. Just a name and email, so this stays a small,
// standalone route rather than overloading /api/interest's much larger
// roundtable-specific schema.
import { NextRequest, NextResponse } from "next/server";
import { sendOneToOneInternalNotification, sendOneToOneConfirmation } from "@/lib/roundtable/email";
import { isRateLimited, getClientIp } from "@/lib/roundtable/rateLimit";

const EMAIL_FORMAT = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_TIME_ON_PAGE_MS = 3000;
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

export async function POST(request: NextRequest) {
  let body: {
    fullName?: string;
    email?: string;
    websiteUrlConfirm?: string;
    formRenderedAt?: number;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const fullName = body.fullName?.trim();
  const email = body.email?.trim();

  if (!fullName || !email) {
    return NextResponse.json({ error: "Please enter your name and email." }, { status: 400 });
  }
  if (!EMAIL_FORMAT.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const ip = getClientIp(request);
  if (await isRateLimited(`one-to-one:${ip}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later." },
      { status: 429 }
    );
  }

  // Honeypot: a real visitor never sees or fills this field. A filled
  // honeypot or a too-fast submission is silently accepted so the bot
  // gets a generic success and no signal that it was caught, but neither
  // email is sent. Same pattern as /api/interest.
  const isBot =
    (body.websiteUrlConfirm ?? "").trim().length > 0 ||
    (typeof body.formRenderedAt === "number" && Date.now() - body.formRenderedAt < MIN_TIME_ON_PAGE_MS);
  if (isBot) {
    return NextResponse.json({ success: true }, { status: 201 });
  }

  const lead = { fullName, email };

  // Internal notification first and loud: losing a lead is worse than
  // showing the visitor a (truthful) error.
  const internalSent = await sendOneToOneInternalNotification(lead);
  if (!internalSent) {
    console.error("1:1 request: internal notification failed for", email);
    return NextResponse.json(
      { error: "We could not record your request just now. Please try again, or email us directly." },
      { status: 500 }
    );
  }

  // Best effort: if this fails, the lead is already safely recorded via
  // the internal notification above.
  const confirmationSent = await sendOneToOneConfirmation(lead);
  if (!confirmationSent) {
    console.error("1:1 request: confirmation email failed for", email);
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
