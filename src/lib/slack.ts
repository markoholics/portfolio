// Posts to a Slack incoming webhook (https://api.slack.com/messaging/webhooks).
// Gated on SLACK_WEBHOOK_URL: if it isn't set, this quietly no-ops (logs
// once) rather than throwing, matching how src/lib/email.ts handles a
// missing RESEND_API_KEY — a missing integration should never break a
// form submission.
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL ?? "";

export async function sendSlackAlert(text: string): Promise<boolean> {
  if (!SLACK_WEBHOOK_URL) {
    console.error("SLACK_WEBHOOK_URL is not configured — skipping Slack alert:", text);
    return false;
  }

  try {
    const response = await fetch(SLACK_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!response.ok) {
      const body = await response.text().catch(() => "");
      console.error("Slack webhook error:", response.status, body);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Failed to send Slack alert:", err);
    return false;
  }
}
