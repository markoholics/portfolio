import { NextResponse } from "next/server";
import { getRazorpayClient } from "@/lib/razorpay";
import {
  SPRINT_CURRENCY,
  SPRINT_PRICE_CENTS,
  SPRINT_PRODUCT_NAME,
} from "@/components/gtm-audit/constants";

// Creates a Razorpay order for the 14-Day Signal Sprint. The amount is
// fixed server-side (never accepted from the client) so a tampered
// request can't create an order for a different amount.
export async function POST() {
  if (SPRINT_PRICE_CENTS < 100) {
    return NextResponse.json(
      { error: "Configured amount is below Razorpay's minimum." },
      { status: 500 }
    );
  }

  let razorpay: ReturnType<typeof getRazorpayClient>;
  try {
    razorpay = getRazorpayClient();
  } catch (err) {
    console.error("Razorpay create-order config error:", err);
    return NextResponse.json(
      { error: "Server is not configured to accept payments yet." },
      { status: 500 }
    );
  }

  try {
    const order = await razorpay.orders.create({
      amount: SPRINT_PRICE_CENTS,
      currency: SPRINT_CURRENCY,
      receipt: `gtm-audit-${Date.now()}`,
      notes: { product: SPRINT_PRODUCT_NAME },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    // Razorpay's SDK throws { statusCode, error: { description, ... } } for API
    // errors (see node_modules/razorpay/dist/api.js normalizeError). Surfacing
    // that description to the client avoids needing Vercel log access to see
    // why checkout failed (e.g. a currency or account-configuration issue).
    const razorpayDescription =
      err &&
      typeof err === "object" &&
      "error" in err &&
      err.error &&
      typeof err.error === "object" &&
      "description" in err.error
        ? String((err.error as { description?: unknown }).description)
        : undefined;
    const status =
      err && typeof err === "object" && "statusCode" in err && err.statusCode === 401
        ? 401
        : 500;
    console.error("Razorpay create-order error:", err);
    return NextResponse.json(
      { error: razorpayDescription || "Could not start checkout. Please try again." },
      { status }
    );
  }
}
