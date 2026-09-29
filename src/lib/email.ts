// Sends the site's own transactional notification emails via Resend's HTTP
// API (https://resend.com) — no SDK dependency, just a fetch call. Gated on
// RESEND_API_KEY: if it isn't set, this quietly no-ops (logs once) rather
// than throwing, so a missing email provider never breaks lead capture or
// the contact form.
const RESEND_API_KEY = process.env.RESEND_API_KEY ?? "";
// Must be an address on a domain verified in Resend, or their shared
// testing sender (onboarding@resend.dev) which works with zero setup but
// is rate-limited and looks less official in the inbox.
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL ?? "contact@markoholics.com";

interface SendEmailOptions {
  subject: string;
  html: string;
  replyTo?: string;
}

async function sendNotificationEmail({ subject, html, replyTo }: SendEmailOptions): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.error(
      "RESEND_API_KEY is not configured — skipping notification email:",
      subject
    );
    return false;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: RESEND_FROM_EMAIL,
        to: [NOTIFY_EMAIL],
        subject,
        html,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      // Resend's shared onboarding@resend.dev sender can only deliver to
      // the email address the Resend account itself was signed up with —
      // this 403 is Resend refusing to send to any other "to" address
      // until you verify your own domain (resend.com/domains) and send
      // from an address on it instead. See RESEND_FROM_EMAIL in
      // .env.local.example.
      if (response.status === 403 && RESEND_FROM_EMAIL.endsWith("@resend.dev")) {
        console.error(
          "Resend 403: the resend.dev sandbox sender can only email your own Resend account address. " +
            `Verify a domain in Resend and set RESEND_FROM_EMAIL to an address on it to send to ${NOTIFY_EMAIL}. Raw response:`,
          body
        );
      } else {
        console.error("Resend API error:", response.status, body);
      }
      return false;
    }
    return true;
  } catch (err) {
    console.error("Failed to send notification email:", err);
    return false;
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendGtmAuditLeadEmail(lead: {
  name: string;
  email: string;
  company?: string | null;
  website?: string | null;
  source: string;
}): Promise<boolean> {
  const isFree = lead.source === "free-gtm-audit-landing";
  const subject = isFree
    ? `Free GTM Audit claim: ${lead.name}`
    : `GTM Audit lead: ${lead.name}`;

  const html = `
    <h2>${isFree ? "New free GTM Audit claim" : "New GTM Audit lead"}</h2>
    <p><strong>Name:</strong> ${escapeHtml(lead.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(lead.email)}</p>
    <p><strong>Company:</strong> ${escapeHtml(lead.company || "—")}</p>
    <p><strong>Website:</strong> ${escapeHtml(lead.website || "—")}</p>
    <p><strong>Source:</strong> ${escapeHtml(lead.source)}</p>
  `;

  return sendNotificationEmail({ subject, html, replyTo: lead.email });
}

export async function sendContactFormEmail(submission: {
  name: string;
  email: string;
  company?: string | null;
  message?: string | null;
}): Promise<boolean> {
  const subject = `Contact form: ${submission.name}`;
  const html = `
    <h2>New contact form submission</h2>
    <p><strong>Name:</strong> ${escapeHtml(submission.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(submission.email)}</p>
    <p><strong>Company:</strong> ${escapeHtml(submission.company || "—")}</p>
    <p><strong>Message:</strong><br />${escapeHtml(submission.message || "—").replace(/\n/g, "<br />")}</p>
  `;

  return sendNotificationEmail({ subject, html, replyTo: submission.email });
}
