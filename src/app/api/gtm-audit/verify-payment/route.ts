import { createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getRazorpayKeySecret } from "@/lib/razorpay";

// Verifies a completed Razorpay Standard Checkout payment. Razorpay signs
// `${order_id}|${payment_id}` with the account's key secret (HMAC-SHA256);
// recomputing that signature server-side and comparing it is the only way
// to trust that a payment actually succeeded, since the checkout modal's
// client-side success callback can't be trusted on its own.
export async function POST(request: NextRequest) {
  let body: {
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json(
      { error: "Missing payment verification fields." },
      { status: 400 }
    );
  }

  let keySecret: string;
  try {
    keySecret = getRazorpayKeySecret();
  } catch (err) {
    console.error("Razorpay verify-payment config error:", err);
    return NextResponse.json(
      { error: "Server is not configured to verify payments yet." },
      { status: 500 }
    );
  }

  const expectedSignature = createHmac("sha256", keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  const expected = Buffer.from(expectedSignature, "hex");
  const received = Buffer.from(razorpay_signature, "hex");

  const isValid =
    expected.length === received.length && timingSafeEqual(expected, received);

  if (!isValid) {
    console.error("Razorpay signature mismatch for order", razorpay_order_id);
    return NextResponse.json({ error: "Payment verification failed." }, { status: 400 });
  }

  return NextResponse.json({ success: true, paymentId: razorpay_payment_id });
}
