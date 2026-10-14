import { sendEmail, escapeHtml, NOTIFY_EMAIL } from "@/lib/email";
import { sendSlackAlert } from "@/lib/slack";
import { EMAIL_COPY, RED_SCREEN_COPY } from "@/lib/fit-check/copy";
import { AMBER_BOOKING_URL, GREEN_BOOKING_URL, type FitCheckRoute } from "@/lib/fit-check/config";
import { SITE_URL } from "@/lib/seo";
import type { FitCheckContact } from "@/lib/fit-check/responses";

function fillTemplate(template: string, values: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key: string) => values[key] ?? match);
}

// Sends the route-specific auto reply to the visitor's own address.
// Best-effort: a failed send never fails the submission, matching the
// pattern in src/lib/email.ts for the other forms on this site.
export async function sendFitCheckAutoReply(
  route: FitCheckRoute,
  contact: FitCheckContact
): Promise<boolean> {
  const firstName = contact.name.split(" ")[0] || contact.name;
  const template = EMAIL_COPY[route];
  const html = fillTemplate(template.html, {
    firstName,
    bookingUrl: route === "green" ? GREEN_BOOKING_URL : AMBER_BOOKING_URL,
    resourceUrl: `${SITE_URL}${RED_SCREEN_COPY.resourceHref}`,
  });

  return sendEmail({
    to: contact.email,
    subject: template.subject,
    html,
    replyTo: NOTIFY_EMAIL,
  });
}

// Green only: an internal alert by email and Slack, fired in parallel so
// neither waits on the other. Both are best-effort notifications, not the
// thing that determines whether the submission itself succeeded.
export async function sendFitCheckGreenAlert(contact: FitCheckContact): Promise<void> {
  const text = `New Fit Check: ${contact.name} (${contact.email}) looks like a strong fit. ${
    contact.companyWebsite ? `Website: ${contact.companyWebsite}. ` : ""
  }${contact.linkedinUrl ? `LinkedIn: ${contact.linkedinUrl}.` : ""}`;

  await Promise.all([
    sendEmail({
      to: NOTIFY_EMAIL,
      subject: `Fit Check: strong fit — ${contact.name}`,
      html: `
        <h2>New strong-fit Fit Check submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(contact.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(contact.email)}</p>
        <p><strong>Company website:</strong> ${escapeHtml(contact.companyWebsite || "—")}</p>
        <p><strong>LinkedIn:</strong> ${escapeHtml(contact.linkedinUrl || "—")}</p>
        <p><strong>Notes:</strong> ${escapeHtml(contact.notes || "—")}</p>
      `,
      replyTo: contact.email,
    }),
    sendSlackAlert(text),
  ]);
}

// Red path only, fired when a visitor fills in the optional "I have a
// defined one off project with a fixed budget" line. This is the one
// signal on the Red path worth an immediate alert — per the brief, these
// are reviewed by hand, which only works if you know one arrived.
export async function sendFitCheckRedNoteAlert(
  contact: Pick<FitCheckContact, "name" | "email">,
  oneOffNote: string
): Promise<void> {
  const text = `Fit Check: ${contact.name} (${contact.email}) wasn't a fit for a retainer, but left a one off project note: "${oneOffNote}"`;

  await Promise.all([
    sendEmail({
      to: NOTIFY_EMAIL,
      subject: `Fit Check: one off project note — ${contact.name}`,
      html: `
        <h2>One off project note from a non-fit Fit Check submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(contact.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(contact.email)}</p>
        <p><strong>Note:</strong> ${escapeHtml(oneOffNote)}</p>
      `,
      replyTo: contact.email,
    }),
    sendSlackAlert(text),
  ]);
}
