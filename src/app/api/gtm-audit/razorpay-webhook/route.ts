import { createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getRazorpayWebhookSecret } from "@/lib/razorpay";
import { upsertOrderFromWebhook } from "@/lib/gtmAuditOrders";

interface RazorpayPaymentEntity {
  id: string;
  order_id: string;
  amount: number;
  currency: string;
  status: string;
  method?: string;
  email?: string;
  contact?: string;
  notes?: Record<string, unknown>;
}

interface RazorpayWebhookBody {
  event: string;
  payload?: {
    payment?: {
      entity?: RazorpayPaymentEntity;
    };
  };
}

// Razorpay webhook for the /gtm-audit Sprint checkout. Configure this URL
// (https://www.markoholics.com/api/gtm-audit/razorpay-webhook) in the
// Razorpay Dashboard under Settings > Webhooks, subscribed to
// "payment.captured", and set RAZORPAY_WEBHOOK_SECRET to the secret you
// choose there (a different value from RAZORPAY_KEY_SECRET).
//
// This exists because the client-side checkout handler (verify-payment)
// can miss a successful payment entirely — closed tab, dropped connection
// right after paying — so this is the backstop that records the sale on
// our side regardless of what the browser did.
export async function POST(request: NextRequest) {
  // Signature is computed over the exact raw bytes Razorpay sent, so this
  // must read the body as text before any JSON parsing.
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  let webhookSecret: string;
  try {
    webhookSecret = getRazorpayWebhookSecret();
  } catch (err) {
    console.error("Razorpay webhook config error:", err);
    return NextResponse.json(
      { error: "Server is not configured to accept webhooks yet." },
      { status: 500 }
    );
  }

  const expectedSignature = createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("hex");

  const expected = Buffer.from(expectedSignature, "hex");
  const received = Buffer.from(signature, "hex");
  const isValid =
    expected.length === received.length && timingSafeEqual(expected, received);

  if (!isValid) {
    console.error("Razorpay webhook signature mismatch.");
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  let body: RazorpayWebhookBody;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  // Acknowledge every other event type with 200 so Razorpay doesn't keep
  // retrying delivery; there's just nothing for this endpoint to do with them.
  if (body.event !== "payment.captured") {
    return NextResponse.json({ received: true, ignored: body.event });
  }

  const payment = body.payload?.payment?.entity;
  if (!payment) {
    return NextResponse.json({ error: "Malformed payment.captured payload." }, { status: 400 });
  }

  await upsertOrderFromWebhook({
    razorpay_order_id: payment.order_id,
    razorpay_payment_id: payment.id,
    amount: payment.amount,
    currency: payment.currency,
    status: payment.status,
    method: payment.method ?? null,
    email: payment.email ?? null,
    contact: payment.contact ?? null,
    notes: payment.notes ?? null,
    raw_event: body as unknown as Record<string, unknown>,
  });

  return NextResponse.json({ received: true });
}
