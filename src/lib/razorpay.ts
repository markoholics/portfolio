import Razorpay from "razorpay";

const keyId = process.env.RAZORPAY_KEY_ID ?? "";
const keySecret = process.env.RAZORPAY_KEY_SECRET ?? "";
const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET ?? "";

export function getRazorpayClient() {
  if (!keyId || !keySecret) {
    throw new Error("Razorpay environment variables are not configured.");
  }
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

export function getRazorpayKeySecret() {
  if (!keySecret) {
    throw new Error("Razorpay environment variables are not configured.");
  }
  return keySecret;
}

// Distinct from the API key secret: this is the secret you set when
// creating the webhook in the Razorpay Dashboard (Settings > Webhooks),
// used to verify the X-Razorpay-Signature header on incoming events.
export function getRazorpayWebhookSecret() {
  if (!webhookSecret) {
    throw new Error("Razorpay webhook secret is not configured.");
  }
  return webhookSecret;
}
