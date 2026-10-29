// Roundtable interest form emails, sent via the Resend SDK. Two emails per
// valid submission: a thank you to the person who submitted, and an
// internal notification with the full response to the team. Every string
// interpolated into HTML is escaped first; both an HTML and a plain text
// body are generated for each email.

import { Resend } from "resend";
import type { InterestFormValues } from "@/lib/roundtable/schema";

const ACCENT = "#00D4FF";
const BLACK = "#000000";
const WHITE = "#ffffff";
const MUTED = "#d9d9d9";

const RESEND_API_KEY = process.env.RESEND_API_KEY ?? "";
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || "contact@markoholics.com";
const FROM_EMAIL = process.env.FROM_EMAIL || `Markoholics <${CONTACT_EMAIL}>`;
const SITE_URL = "https://www.markoholics.com";

function getResendClient(): Resend | null {
  if (!RESEND_API_KEY) {
    console.error("Roundtable email: RESEND_API_KEY is not set.");
    return null;
  }
  return new Resend(RESEND_API_KEY);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] || fullName.trim();
}

function emailWrapper(bodyHtml: string): string {
  // Inline CSS only, single column, generous tap targets, works in Gmail
  // and Outlook's stripped-down renderers alike.
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background-color:${BLACK};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BLACK};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="100%" style="max-width:560px;" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding-bottom:24px;">
              <span style="display:inline-block;width:10px;height:10px;background-color:${ACCENT};vertical-align:middle;margin-right:10px;"></span>
              <span style="font-family:Arial,Helvetica,sans-serif;font-weight:700;font-size:14px;letter-spacing:2px;color:${WHITE};text-transform:uppercase;vertical-align:middle;">MARKOHOLICS</span>
            </td>
          </tr>
          <tr>
            <td style="background-color:${BLACK};border:1px solid rgba(217,217,217,0.16);padding:32px 24px;font-family:Arial,Helvetica,sans-serif;color:${MUTED};font-size:15px;line-height:1.6;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding-top:20px;font-family:Arial,Helvetica,sans-serif;color:${MUTED};font-size:12px;">
              Markoholics &middot; <a href="${SITE_URL}" style="color:${ACCENT};text-decoration:none;">markoholics.com</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function summaryRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:4px 0;color:${MUTED};font-size:13px;width:160px;vertical-align:top;">${escapeHtml(label)}</td>
    <td style="padding:4px 0;color:${WHITE};font-size:13px;vertical-align:top;">${value}</td>
  </tr>`;
}

export async function sendThankYouEmail(data: InterestFormValues): Promise<boolean> {
  const client = getResendClient();
  if (!client) return false;

  const name = escapeHtml(firstName(data.fullName));
  const expertiseList = data.expertise.map(escapeHtml).join(", ");

  const html = emailWrapper(`
    <p style="margin:0 0 16px;color:${WHITE};font-size:17px;">Hi ${name},</p>
    <p style="margin:0 0 16px;">Thank you for your interest in the Markoholics Roundtable Series. We have received your details and we will be in touch within 2 to 3 business days.</p>
    <p style="margin:0 0 20px;">In the meantime, you can read more at <a href="${SITE_URL}/roundtable" style="color:${ACCENT};text-decoration:none;">www.markoholics.com/roundtable</a>, or write to us at <a href="mailto:${CONTACT_EMAIL}" style="color:${ACCENT};text-decoration:none;">${CONTACT_EMAIL}</a>.</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid rgba(217,217,217,0.16);margin-top:8px;padding-top:16px;">
      ${summaryRow("Joining as", escapeHtml(data.joinAs))}
      ${summaryRow("Preferred format", escapeHtml(data.preferredFormat))}
      ${summaryRow("Areas of expertise", expertiseList)}
    </table>
    <p style="margin:20px 0 0;">Warm regards,<br />The Markoholics team</p>
  `);

  const text = [
    `Hi ${firstName(data.fullName)},`,
    "",
    "Thank you for your interest in the Markoholics Roundtable Series. We have received your details and we will be in touch within 2 to 3 business days.",
    "",
    `In the meantime, you can read more at https://www.markoholics.com/roundtable, or write to us at ${CONTACT_EMAIL}.`,
    "",
    `Joining as: ${data.joinAs}`,
    `Preferred format: ${data.preferredFormat}`,
    `Areas of expertise: ${data.expertise.join(", ")}`,
    "",
    "Warm regards,",
    "The Markoholics team",
  ].join("\n");

  try {
    const result = await client.emails.send({
      from: FROM_EMAIL,
      to: [data.businessEmail],
      replyTo: CONTACT_EMAIL,
      subject: "Thanks for your interest in the Markoholics Roundtable Series",
      html,
      text,
    });
    if (result.error) {
      console.error("Roundtable thank you email failed:", result.error);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Roundtable thank you email threw:", error);
    return false;
  }
}

export interface InternalNotificationMeta {
  timestampIso: string;
  ref?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  referrer?: string;
  ipCountry?: string;
}

const FIELD_LABELS: { key: keyof InterestFormValues; label: string }[] = [
  { key: "fullName", label: "Full name" },
  { key: "businessEmail", label: "Business email" },
  { key: "designation", label: "Designation" },
  { key: "companyName", label: "Company name" },
  { key: "cityCountry", label: "City and country" },
  { key: "yearsExperience", label: "Years of experience" },
  { key: "joinAs", label: "Joining as" },
  { key: "preferredFormat", label: "Preferred format" },
  { key: "companyStage", label: "Company stage" },
  { key: "heardAbout", label: "How they heard about us" },
];

function formatTimestampIst(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export async function sendInternalNotification(
  data: InterestFormValues,
  meta: InternalNotificationMeta
): Promise<boolean> {
  const client = getResendClient();
  if (!client) return false;

  const extra = (process.env.NOTIFY_EXTRA_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
  const recipients = [CONTACT_EMAIL, ...extra];

  const rows = FIELD_LABELS.map(({ key, label }) => {
    const raw = data[key];
    if (raw === undefined || raw === null || raw === "") return "";
    return summaryRow(label, escapeHtml(String(raw)));
  }).join("");

  const linkedinCell = `<a href="${escapeHtml(data.linkedinUrl)}" style="color:${ACCENT};text-decoration:none;">${escapeHtml(data.linkedinUrl)}</a>`;
  const websiteCell = data.companyWebsite
    ? `<a href="${escapeHtml(data.companyWebsite)}" style="color:${ACCENT};text-decoration:none;">${escapeHtml(data.companyWebsite)}</a>`
    : "";
  const emailCell = `<a href="mailto:${escapeHtml(data.businessEmail)}" style="color:${ACCENT};text-decoration:none;">${escapeHtml(data.businessEmail)}</a>`;
  const whatsappValue = data.whatsappNumber
    ? `${escapeHtml(data.whatsappCountry || "")} ${escapeHtml(data.whatsappNumber)}`.trim()
    : "Not provided";

  const sourceParts: string[] = [];
  if (meta.ref) sourceParts.push(`ref: ${meta.ref}`);
  if (meta.utmSource) sourceParts.push(`utm_source: ${meta.utmSource}`);
  if (meta.utmMedium) sourceParts.push(`utm_medium: ${meta.utmMedium}`);
  if (meta.utmCampaign) sourceParts.push(`utm_campaign: ${meta.utmCampaign}`);
  if (meta.utmTerm) sourceParts.push(`utm_term: ${meta.utmTerm}`);
  if (meta.utmContent) sourceParts.push(`utm_content: ${meta.utmContent}`);
  if (meta.referrer) sourceParts.push(`referrer: ${meta.referrer}`);
  const sourceText = sourceParts.length > 0 ? sourceParts.join(", ") : "direct, no source parameters";

  const html = emailWrapper(`
    <p style="margin:0 0 4px;color:${WHITE};font-size:17px;">New roundtable interest</p>
    <p style="margin:0 0 20px;color:${MUTED};font-size:13px;">${formatTimestampIst(meta.timestampIso)} IST</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${rows}
      ${summaryRow("Business email", emailCell)}
      ${summaryRow("WhatsApp", whatsappValue)}
      ${summaryRow("LinkedIn profile", linkedinCell)}
      ${websiteCell ? summaryRow("Company website", websiteCell) : ""}
      ${summaryRow("Areas of expertise", data.expertise.map(escapeHtml).join(", "))}
      ${data.expertiseOther ? summaryRow("Other expertise", escapeHtml(data.expertiseOther)) : ""}
      ${data.pastLinks ? summaryRow("Past talks, podcasts or writing", escapeHtml(data.pastLinks)) : ""}
      ${data.availability && data.availability.length > 0 ? summaryRow("Availability", data.availability.map(escapeHtml).join(", ")) : ""}
      ${data.anythingElse ? summaryRow("Anything else", escapeHtml(data.anythingElse)) : ""}
      ${summaryRow("Source", escapeHtml(sourceText))}
      ${meta.ipCountry ? summaryRow("IP country", escapeHtml(meta.ipCountry)) : ""}
    </table>
  `);

  const textRows = FIELD_LABELS.map(({ key, label }) => {
    const raw = data[key];
    if (raw === undefined || raw === null || raw === "") return null;
    return `${label}: ${raw}`;
  }).filter(Boolean);

  const text = [
    "New roundtable interest",
    `${formatTimestampIst(meta.timestampIso)} IST`,
    "",
    ...textRows,
    `Business email: ${data.businessEmail}`,
    `WhatsApp: ${whatsappValue}`,
    `LinkedIn profile: ${data.linkedinUrl}`,
    data.companyWebsite ? `Company website: ${data.companyWebsite}` : "",
    `Areas of expertise: ${data.expertise.join(", ")}`,
    data.expertiseOther ? `Other expertise: ${data.expertiseOther}` : "",
    data.pastLinks ? `Past talks, podcasts or writing: ${data.pastLinks}` : "",
    data.availability && data.availability.length > 0 ? `Availability: ${data.availability.join(", ")}` : "",
    data.anythingElse ? `Anything else: ${data.anythingElse}` : "",
    `Source: ${sourceText}`,
    meta.ipCountry ? `IP country: ${meta.ipCountry}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const result = await client.emails.send({
      from: `Markoholics Roundtable <${CONTACT_EMAIL}>`,
      to: recipients,
      replyTo: data.businessEmail,
      subject: `New roundtable interest: ${data.fullName}, ${data.companyName} (${data.joinAs})`,
      html,
      text,
    });
    if (result.error) {
      console.error("Roundtable internal notification failed:", result.error);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Roundtable internal notification threw:", error);
    return false;
  }
}
