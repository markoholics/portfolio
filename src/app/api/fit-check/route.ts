import { NextRequest, NextResponse } from "next/server";
import {
  BLOCKED_EMAIL_DOMAINS,
  AMBER_BOOKING_URL,
  GREEN_BOOKING_URL,
  QUESTION_SCORES,
  type FitCheckAnswers,
} from "@/lib/fit-check/config";
import { scoreFitCheck } from "@/lib/fit-check/scoring";
import {
  saveFitCheckProgress,
  saveFitCheckRedNote,
  saveFitCheckSubmission,
  type FitCheckUtm,
} from "@/lib/fit-check/responses";
import { sendFitCheckAutoReply, sendFitCheckGreenAlert } from "@/lib/fit-check/notify";
import { postFitCheckWebhook } from "@/lib/fit-check/webhook";
import { EMAIL_FORMAT } from "@/lib/email";

const ANSWER_KEYS = Object.keys(QUESTION_SCORES) as (keyof FitCheckAnswers)[];

// Best-effort, per-instance rate limiting. There is no Redis/KV store in
// this project, so this resets whenever the serverless function cold
// starts and does not coordinate across concurrent instances — it stops a
// single abusive client hammering one warm instance, nothing more. If you
// need real cross-instance limiting, put Upstash or Vercel KV in front of
// this and swap the two functions below for it; nothing else needs to
// change.
const rateLimitBuckets = new Map<string, { count: number; windowStart: number }>();

function isRateLimited(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = rateLimitBuckets.get(key);
  if (!bucket || now - bucket.windowStart > windowMs) {
    rateLimitBuckets.set(key, { count: 1, windowStart: now });
    return false;
  }
  bucket.count += 1;
  return bucket.count > max;
}

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

function isValidAnswerValue(question: keyof FitCheckAnswers, value: unknown): boolean {
  if (typeof value !== "string") return false;
  const options = QUESTION_SCORES[question] as Record<string, number>;
  return value in options;
}

function sanitiseAnswers(raw: unknown): Partial<FitCheckAnswers> {
  const out: Partial<FitCheckAnswers> = {};
  if (!raw || typeof raw !== "object") return out;
  const record = raw as Record<string, unknown>;
  for (const key of ANSWER_KEYS) {
    const value = record[key];
    if (isValidAnswerValue(key, value)) {
      (out as Record<string, unknown>)[key] = value;
    }
  }
  return out;
}

function sanitiseUtm(raw: unknown, referrer: string | null): FitCheckUtm {
  const record = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const pick = (key: string) => (typeof record[key] === "string" ? (record[key] as string).slice(0, 200) : null);
  return {
    utm_source: pick("utm_source"),
    utm_medium: pick("utm_medium"),
    utm_campaign: pick("utm_campaign"),
    utm_term: pick("utm_term"),
    utm_content: pick("utm_content"),
    referrer: referrer ? referrer.slice(0, 500) : null,
  };
}

function isDisposableEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  return !!domain && BLOCKED_EMAIL_DOMAINS.includes(domain);
}

function looksLikeUrl(value: string): boolean {
  try {
    const withScheme = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    new URL(withScheme);
    return true;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Honeypot: a real visitor never sees or fills this field (hidden via
  // CSS in FitCheckFlow.tsx, not with type="hidden", which some bots skip).
  // A non-empty value means a bot filled every field it could find — the
  // request is accepted and quietly dropped rather than erroring, so the
  // bot gets no signal to adapt to.
  const honeypot = typeof body.company_size_hint === "string" ? body.company_size_hint : "";
  if (honeypot.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  const sessionId = typeof body.sessionId === "string" ? body.sessionId.slice(0, 100) : "";
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session." }, { status: 400 });
  }

  const event = body.event === "submit" ? "submit" : body.event === "red_note" ? "red_note" : "progress";
  const referrer = request.headers.get("referer");
  const utm = sanitiseUtm(body.utm, referrer);

  if (event === "red_note") {
    if (isRateLimited(`red_note:${ip}`, 8, 60 * 60 * 1000)) {
      return NextResponse.json({ error: "Too many requests." }, { status: 429 });
    }
    const oneOffNote = typeof body.oneOffNote === "string" ? body.oneOffNote.trim().slice(0, 500) : "";
    await saveFitCheckRedNote(sessionId, oneOffNote);
    return NextResponse.json({ ok: true });
  }

  if (event === "progress") {
    if (isRateLimited(`progress:${ip}`, 60, 10 * 60 * 1000)) {
      return NextResponse.json({ error: "Too many requests." }, { status: 429 });
    }

    const answers = sanitiseAnswers(body.answers);
    const currentStep = typeof body.currentStep === "number" ? Math.min(Math.max(body.currentStep, 0), 7) : 0;

    await saveFitCheckProgress({ sessionId, currentStep, answers, utm });
    return NextResponse.json({ ok: true });
  }

  // event === "submit"
  if (isRateLimited(`submit:${ip}`, 8, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const answersInput = sanitiseAnswers(body.answers);
  const missing = ANSWER_KEYS.filter((key) => !(key in answersInput));
  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Missing or invalid answers: ${missing.join(", ")}.` },
      { status: 400 }
    );
  }
  const answers = answersInput as FitCheckAnswers;

  const contactInput = (body.contact && typeof body.contact === "object" ? body.contact : {}) as Record<
    string,
    unknown
  >;
  const name = typeof contactInput.name === "string" ? contactInput.name.trim().slice(0, 200) : "";
  const email = typeof contactInput.email === "string" ? contactInput.email.trim().slice(0, 320) : "";
  const companyWebsite =
    typeof contactInput.companyWebsite === "string" ? contactInput.companyWebsite.trim().slice(0, 300) : "";
  const linkedinUrl =
    typeof contactInput.linkedinUrl === "string" ? contactInput.linkedinUrl.trim().slice(0, 300) : "";
  const notes = typeof contactInput.notes === "string" ? contactInput.notes.trim().slice(0, 1000) : "";
  const oneOffNote =
    typeof contactInput.oneOffNote === "string" ? contactInput.oneOffNote.trim().slice(0, 500) : "";

  if (!name || !email || !companyWebsite || !linkedinUrl) {
    return NextResponse.json(
      { error: "Name, work email, company website and LinkedIn URL are required." },
      { status: 400 }
    );
  }
  if (!EMAIL_FORMAT.test(email)) {
    return NextResponse.json({ error: "Enter a valid work email address." }, { status: 400 });
  }
  if (isDisposableEmail(email)) {
    return NextResponse.json(
      { error: "Please use your regular work email rather than a temporary one." },
      { status: 400 }
    );
  }
  if (!looksLikeUrl(companyWebsite) || !looksLikeUrl(linkedinUrl)) {
    return NextResponse.json({ error: "Enter valid URLs for website and LinkedIn." }, { status: 400 });
  }

  const result = scoreFitCheck(answers);
  const bookingLinkShown =
    result.route === "green" ? GREEN_BOOKING_URL : result.route === "amber" ? AMBER_BOOKING_URL : null;

  const contact = { name, email, companyWebsite, linkedinUrl, notes, oneOffNote };

  const saved = await saveFitCheckSubmission({
    sessionId,
    answers,
    contact,
    result,
    bookingLinkShown,
    utm,
  });

  // These three run independently of the Supabase write and of each
  // other. None of them can fail the visitor's submission — persistence
  // already succeeded or the dual-channel webhook below still fires.
  await Promise.all([
    sendFitCheckAutoReply(result.route, contact),
    result.route === "green" ? sendFitCheckGreenAlert(contact) : Promise.resolve(),
    postFitCheckWebhook({
      sessionId,
      submittedAt: new Date().toISOString(),
      answers,
      contact,
      route: result.route,
      percent: result.percent,
      dealBreakers: result.dealBreakers,
      flags: result.flags,
      utm,
    }),
  ]);

  if (!saved) {
    console.error("Fit Check submission not persisted to Supabase for session:", sessionId);
  }

  return NextResponse.json({ ok: true, route: result.route });
}
