import { getSupabaseServerClient } from "@/lib/supabase";

export interface GtmAuditOrderRecord {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  amount: number;
  currency: string;
  status: string;
  method?: string | null;
  email?: string | null;
  contact?: string | null;
  notes?: Record<string, unknown> | null;
  raw_event?: Record<string, unknown> | null;
}

// Called from the client-side verify-payment step right after a signature
// check passes. Only inserts if this payment_id isn't already recorded
// (ignoreDuplicates), so it never clobbers the richer record the webhook
// below writes — whichever of the two arrives first "wins" the initial
// insert, and the webhook is always allowed to fill in the rest.
export async function recordOrderIfNew(record: GtmAuditOrderRecord) {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from("gtm_audit_orders")
    .upsert(record, { onConflict: "razorpay_payment_id", ignoreDuplicates: true });

  if (error) {
    console.error("Supabase gtm_audit_orders insert error:", error.message);
  }
}

// Called from the Razorpay webhook, which carries the authoritative payment
// details (email, contact, method) that the client-side flow doesn't have.
// Upserts so it overwrites whatever a same-payment_id row already holds.
export async function upsertOrderFromWebhook(record: GtmAuditOrderRecord) {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from("gtm_audit_orders")
    .upsert(record, { onConflict: "razorpay_payment_id" });

  if (error) {
    console.error("Supabase gtm_audit_orders upsert error:", error.message);
  }
}
