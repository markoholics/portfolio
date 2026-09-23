"use client";

import { useState, type CSSProperties } from "react";
import { trackCtaClick, trackPurchase } from "@/components/gtm-audit/track";
import {
  SPRINT_CURRENCY,
  SPRINT_PRICE_USD,
  SPRINT_PRODUCT_NAME,
} from "@/components/gtm-audit/constants";

interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, handler: (response: unknown) => void) => void;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  handler: (response: RazorpayPaymentResponse) => void;
  modal?: { ondismiss?: () => void };
  theme?: { color?: string };
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

type Status = "idle" | "loading" | "success" | "error";

export default function RazorpayCheckoutButton({
  location,
  label,
  className,
  style,
}: {
  location: string;
  label: string;
  className?: string;
  style?: CSSProperties;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleClick() {
    trackCtaClick(location);

    if (typeof window === "undefined" || !window.Razorpay) {
      setStatus("error");
      setErrorMessage("Payment is still loading. Please try again in a moment.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const orderRes = await fetch("/api/gtm-audit/create-order", { method: "POST" });
      if (!orderRes.ok) {
        const body = await orderRes.json().catch(() => ({}));
        throw new Error(body.error || "Could not start checkout. Please try again.");
      }
      const order: { orderId: string; amount: number; currency: string } =
        await orderRes.json();

      const razorpay = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "",
        amount: order.amount,
        currency: order.currency,
        name: "Markoholics",
        description: SPRINT_PRODUCT_NAME,
        order_id: order.orderId,
        handler: async (response) => {
          try {
            const verifyRes = await fetch("/api/gtm-audit/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });
            if (!verifyRes.ok) {
              const body = await verifyRes.json().catch(() => ({}));
              throw new Error(body.error || "Payment verification failed.");
            }
            trackPurchase(SPRINT_PRICE_USD, SPRINT_CURRENCY);
            setStatus("success");
          } catch (err) {
            setStatus("error");
            setErrorMessage(
              err instanceof Error ? err.message : "Payment verification failed."
            );
          }
        },
        modal: {
          // User closed the modal without paying — not an error, just reset.
          ondismiss: () => setStatus("idle"),
        },
        theme: { color: "#D6FE4E" },
      });

      razorpay.on("payment.failed", (response) => {
        console.error("Razorpay payment.failed:", response);
        setStatus("error");
        setErrorMessage("Payment failed. Please try again or use a different method.");
      });

      razorpay.open();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <p className={className} style={style} role="status">
        Payment received — check your email for next steps.
      </p>
    );
  }

  return (
    <>
      <button type="button" onClick={handleClick} disabled={status === "loading"} className={className} style={style}>
        {status === "loading" ? "Starting checkout…" : label}
      </button>
      {status === "error" && (
        <p role="alert" className="mt-2 text-sm text-[#ff8080]">
          {errorMessage}
        </p>
      )}
    </>
  );
}
