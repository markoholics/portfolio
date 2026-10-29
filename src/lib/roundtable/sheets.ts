// Optional backup: POST the full submission JSON to a Google Apps Script
// webhook if GOOGLE_SHEETS_WEBHOOK_URL is set. Entirely best effort: a
// failure here is logged and never changes the API response, since email
// is the real source of truth (see src/app/roundtable/README.md for the
// Apps Script snippet this expects to receive).

import type { InterestFormValues } from "@/lib/roundtable/schema";
import type { InternalNotificationMeta } from "@/lib/roundtable/email";

export async function backupToGoogleSheets(
  data: InterestFormValues,
  meta: InternalNotificationMeta
): Promise<void> {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!webhookUrl) return;

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, ...meta }),
    });
    if (!response.ok) {
      console.error("Roundtable Google Sheets backup responded with", response.status);
    }
  } catch (error) {
    console.error("Roundtable Google Sheets backup failed:", error);
  }
}
