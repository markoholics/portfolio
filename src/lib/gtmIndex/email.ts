// Renders a scored GTM Index report into Template C (the full-report
// delivery email) and sends it via the Resend SDK. Mirrors the HTML
// email patterns already used in src/lib/roundtable/email.ts: inline CSS,
// a single dark column, both an HTML and a plain text body.
import { Resend } from "resend";
import type { FullReport, IndexScore, ScoredReport } from "@/lib/gtmIndex/types";

const ACCENT = "#00D4FF";
const BLACK = "#000000";
const WHITE = "#ffffff";
const MUTED = "#d9d9d9";

const RESEND_API_KEY = process.env.RESEND_API_KEY ?? "";
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || "contact@markoholics.com";
const FROM_EMAIL = process.env.FROM_EMAIL || `Markoholics <${CONTACT_EMAIL}>`;
const CALENDLY_URL = process.env.GTM_INDEX_CALENDLY_URL || "https://calendly.com/markoholics/30min";

function getResendClient(): Resend | null {
  if (!RESEND_API_KEY) {
    console.error("GTM Index email: RESEND_API_KEY is not set.");
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

function section(title: string, bodyHtml: string): string {
  return `<tr><td style="padding-top:28px;"><p style="margin:0 0 10px;color:${WHITE};font-size:15px;font-weight:700;">${escapeHtml(title)}</p>${bodyHtml}</td></tr>`;
}

function list(items: string[]): string {
  if (items.length === 0) return `<p style="margin:0;color:${MUTED};font-size:14px;">None recorded.</p>`;
  return `<ul style="margin:0;padding-left:18px;color:${MUTED};font-size:14px;line-height:1.6;">${items
    .map((item) => `<li style="margin-bottom:6px;">${escapeHtml(item)}</li>`)
    .join("")}</ul>`;
}

function renderPillars(fullReport: FullReport): string {
  const rows = fullReport.pillar_deep_dives
    .map(
      (p) =>
        `<tr><td style="padding:10px 0;border-bottom:1px solid rgba(217,217,217,0.16);"><p style="margin:0 0 4px;color:${WHITE};font-size:14px;font-weight:700;">${escapeHtml(p.pillar)} ${p.score ?? "n/a"}/10</p><p style="margin:0 0 6px;color:${MUTED};font-size:13px;">${escapeHtml(p.diagnosis)}</p><p style="margin:0;color:${ACCENT};font-size:12px;">To raise it: ${escapeHtml(p.what_would_raise_the_score)}</p></td></tr>`
    )
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>`;
}

function renderFiveStep(fullReport: FullReport): string {
  const rows = fullReport.five_step_read
    .map(
      (s) =>
        `<p style="margin:0 0 10px;color:${MUTED};font-size:14px;"><strong style="color:${WHITE};">Step ${s.step}, ${escapeHtml(s.step_name)}:</strong> ${escapeHtml(s.inference)} ${s.needs_founder_input ? `<span style="color:${ACCENT};">(needs your input)</span>` : ""}</p>`
    )
    .join("");
  return rows;
}

function renderQuickWins(fullReport: FullReport): string {
  return list(fullReport.quick_wins.map((q) => `${q.action} (${q.pillar}, ${q.effort} effort). ${q.why_this_first}`));
}

function renderPlan(fullReport: FullReport): string {
  const block = (label: string, items: string[]) =>
    `<p style="margin:0 0 4px;color:${WHITE};font-size:13px;font-weight:700;">${label}</p>${list(items)}`;
  return `${block("Days 0 to 30", fullReport.plan_30_60_90.days_0_30)}<div style="height:12px;"></div>${block(
    "Days 31 to 60",
    fullReport.plan_30_60_90.days_31_60
  )}<div style="height:12px;"></div>${block("Days 61 to 90", fullReport.plan_30_60_90.days_61_90)}`;
}

function emailWrapper(bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background-color:${BLACK};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BLACK};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="100%" style="max-width:600px;" cellpadding="0" cellspacing="0">
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
            <td style="padding-top:24px;font-family:Arial,Helvetica,sans-serif;color:#8f969e;font-size:12px;line-height:1.6;">
              Based on publicly available information at the time of the audit. You are receiving this because you requested a GTM Index at markoholics.com/gtm-index. Reply to this email with any question, or to stop further emails.<br />
              Creative Engineering Enterprises Private Limited, Banaswadi, Bangalore 560043
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendGtmIndexReportEmail(params: {
  recipientName: string;
  recipientEmail: string;
  report: ScoredReport;
}): Promise<boolean> {
  const client = getResendClient();
  if (!client) return false;

  const { report } = params;
  const name = firstName(params.recipientName);
  const index: IndexScore = report.index;
  const fullReport = report.full_report;

  const bodyHtml = `
    <p style="margin:0 0 4px;color:${WHITE};font-size:17px;">Hi ${escapeHtml(name)},</p>
    <p style="margin:0 0 20px;">${escapeHtml(fullReport.email_opening_line)}</p>
    <p style="margin:0 0 20px;">${escapeHtml(report.company_name)} scores <strong style="color:${WHITE};">${index.score} out of 100</strong> on the Markoholics GTM Index, which puts it in the "${escapeHtml(index.band)}" band. The pattern holding it back most is <strong style="color:${WHITE};">${escapeHtml(index.primary_failure_pattern)}</strong>.</p>
    <p style="margin:0 0 20px;">Below is the full audit: a breakdown of all six pillars with the evidence behind each score, how your positioning reads against the five step framework, any contradictions between your channels, alternative market frames worth testing, a 30, 60 and 90 day plan, and the questions I would ask you on a call.</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${section("Pillar scores", renderPillars(fullReport))}
      ${section("The five step read", renderFiveStep(fullReport))}
      ${section("Quick wins", renderQuickWins(fullReport))}
      ${section("30, 60, 90 day plan", renderPlan(fullReport))}
      ${section("What we cannot see from public data", list(fullReport.what_we_cannot_see))}
      ${section("Questions for you", list(fullReport.questions_for_the_founder))}
      ${fullReport.caveats.length > 0 ? section("Caveats", list(fullReport.caveats)) : ""}
    </table>
    <p style="margin:24px 0 0;color:${MUTED};font-size:13px;">How to read this: every score rests on what is publicly visible. Where visibility was limited, I have marked the score as provisional. Steps two, three and four of the framework depend on things only you know, so treat those sections as informed hypotheses.</p>
    <p style="margin:24px 0 8px;color:${WHITE};font-size:16px;">Want to understand the report properly?</p>
    <p style="margin:0 0 20px;">I will walk you through it, test the positioning with you against what I cannot see from outside, and tell you honestly what I would fix first.</p>
    <p style="margin:0;">
      <a href="${CALENDLY_URL}" style="display:inline-block;background-color:${ACCENT};color:${BLACK};font-weight:700;text-decoration:none;padding:14px 24px;font-size:14px;">Book a 1:1 discovery call with me</a>
    </p>
    <p style="margin:28px 0 0;color:${MUTED};">Mohammad H. Rahman<br />Founder, Markoholics</p>
  `;

  try {
    const result = await client.emails.send({
      from: FROM_EMAIL,
      to: [params.recipientEmail],
      replyTo: CONTACT_EMAIL,
      subject: `${name}, your GTM Index for ${report.company_name}`,
      html: emailWrapper(bodyHtml),
      text: [
        `Hi ${name},`,
        "",
        fullReport.email_opening_line,
        "",
        `${report.company_name} scores ${index.score} out of 100 on the Markoholics GTM Index (${index.band}). The pattern holding it back most is ${index.primary_failure_pattern}.`,
        "",
        "Pillar scores:",
        ...fullReport.pillar_deep_dives.map((p) => `- ${p.pillar} ${p.score ?? "n/a"}/10: ${p.diagnosis}`),
        "",
        "Quick wins:",
        ...fullReport.quick_wins.map((q) => `- ${q.action} (${q.pillar}, ${q.effort} effort)`),
        "",
        `Book a 1:1 discovery call: ${CALENDLY_URL}`,
        "",
        "Mohammad H. Rahman, Founder, Markoholics",
      ].join("\n"),
    });
    if (result.error) {
      console.error("GTM Index report email failed:", result.error);
      return false;
    }
    return true;
  } catch (error) {
    console.error("GTM Index report email threw:", error);
    return false;
  }
}
