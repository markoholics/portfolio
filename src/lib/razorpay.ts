import Razorpay from "razorpay";

const keyId = process.env.RAZORPAY_KEY_ID ?? "";
const keySecret = process.env.RAZORPAY_KEY_SECRET ?? "";

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
