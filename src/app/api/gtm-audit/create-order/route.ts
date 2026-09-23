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

  try {
    const razorpay = getRazorpayClient();
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
    const status =
      err && typeof err === "object" && "statusCode" in err && err.statusCode === 401
        ? 401
        : 500;
    console.error("Razorpay create-order error:", err);
    return NextResponse.json(
      { error: "Could not start checkout. Please try again." },
      { status }
    );
  }
}
