import type { FitCheckAnswers } from "@/lib/fit-check/config";
import type { FitCheckResult } from "@/lib/fit-check/scoring";
import type { FitCheckContact, FitCheckUtm } from "@/lib/fit-check/responses";

const MAKE_WEBHOOK_URL = process.env.MAKE_FIT_CHECK_WEBHOOK_URL ?? "";

export interface FitCheckWebhookPayload {
  sessionId: string;
  submittedAt: string;
  answers: FitCheckAnswers;
  contact: FitCheckContact;
  route: FitCheckResult["route"];
  percent: number;
  dealBreakers: string[];
  flags: string[];
  utm: FitCheckUtm;
}

// Fires the full submission, including the computed route, to a Make
// scenario so it can be pushed on to Notion, Brevo and Apollo enrichment.
// Gated on MAKE_FIT_CHECK_WEBHOOK_URL: if it isn't set, this quietly no-ops
// (logs once) rather than throwing — Make is a downstream convenience, it
// should never be able to fail the visitor's submission.
export async function postFitCheckWebhook(payload: FitCheckWebhookPayload): Promise<boolean> {
  if (!MAKE_WEBHOOK_URL) {
    console.error(
      "MAKE_FIT_CHECK_WEBHOOK_URL is not configured — skipping Make webhook for session:",
      payload.sessionId
    );
    return false;
  }

  try {
    const response = await fetch(MAKE_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const body = await response.text().catch(() => "");
      console.error("Make webhook error:", response.status, body);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Failed to post Make webhook:", err);
    return false;
  }
}
