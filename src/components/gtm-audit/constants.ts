// Fixed-price Razorpay Standard Checkout for the 14-Day Signal Sprint.
// The amount is determined server-side (src/app/api/gtm-audit/create-order)
// from this constant, never taken from the client, so a tampered request
// can't create an order for a different amount.
export const SPRINT_PRICE_USD = 99;
export const SPRINT_PRICE_CENTS = SPRINT_PRICE_USD * 100;
export const SPRINT_CURRENCY = "USD";
export const SPRINT_PRODUCT_NAME = "14-Day Signal Sprint";
