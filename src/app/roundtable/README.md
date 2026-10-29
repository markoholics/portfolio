# Markoholics Roundtable Series

The landing page at `/roundtable`, the homepage teaser section, and the
participant interest form (`POST /api/interest`) that emails every
submission. This is an ordinary route inside the main markoholics.com
Next.js app, not a separate deployment, so no rewrite config is needed:
pushing this repo to Vercel serves `https://www.markoholics.com/roundtable`
the same way it serves every other page.

## Where everything lives

| What | File |
| --- | --- |
| Every word shown on the page, in the homepage teaser, the metrics, the format cards, and all form dropdown/checkbox options | `src/content/roundtable.ts` |
| The Zod validation schema (shared by the form and the API route), the business-email blocklist, the WhatsApp country list | `src/lib/roundtable/schema.ts` |
| Resend email sending: the thank you email and the internal notification, HTML and plain text | `src/lib/roundtable/email.ts` |
| Rate limiting (Upstash if configured, else in-memory) | `src/lib/roundtable/rateLimit.ts` |
| Optional Google Sheets backup webhook | `src/lib/roundtable/sheets.ts` |
| The API route | `src/app/api/interest/route.ts` |
| The landing page itself (metadata, JSON-LD, section order) | `src/app/roundtable/page.tsx` |
| The Open Graph share image | `src/app/roundtable/opengraph-image.tsx` |
| Landing page sections | `src/components/roundtable/*.tsx` |
| Homepage teaser section | `src/components/home/RoundtableTeaser.tsx` |

The sticky header and footer are the site's existing global `Nav`/`Footer`
components (in `src/components/`), not rebuilt here. "Roundtable" was added
to the shared `navLinks` array in `src/lib/data.ts`, so it appears in the
header nav, the mobile menu and the footer's Navigate column automatically.

## Editing copy, metrics and form options

Everything a non-engineer would want to change lives in
**`src/content/roundtable.ts`**. Nothing under `src/components/roundtable`,
`src/components/home/RoundtableTeaser.tsx`, or the API route needs to
change for any of the following:

- **Change any heading, paragraph, button label or chip text** -> edit the
  relevant `*_COPY` object.
- **Change the four About Markoholics metrics** -> edit `ABOUT_COPY.metrics`.
  Each entry is `{ prefix?, value, suffix?, label }`; the number counts up
  to `value` exactly as written when it scrolls into view and never past
  it, so whatever you put here is exactly what visitors see.
- **Add, remove or rename an area of expertise, a "join as" option, a
  company stage, etc.** -> edit the relevant `*_OPTIONS` array. These
  arrays are also the Zod enum source, so a change here automatically
  updates both the form's choices and what the API route accepts; no
  separate list to keep in sync.
- **Add or remove a blocked free/disposable email domain** -> edit
  `FREE_EMAIL_DOMAINS` / `DISPOSABLE_EMAIL_DOMAINS` in the same file.
- **Add a WhatsApp dialling code to the country selector** -> edit
  `WHATSAPP_COUNTRY_OPTIONS` in `src/lib/roundtable/schema.ts` (uses
  `libphonenumber-js`'s own two-letter country codes).

House rule for this feature specifically: British English, no em dashes,
and no hyphen used as a stand-in dash, anywhere in `roundtable.ts`. A test
(`src/content/roundtable.test.ts`) scans every string in that file for
both and fails the build if it finds one.

## Local setup

1. `npm install` (already includes `zod`, `react-hook-form`,
   `@hookform/resolvers`, `libphonenumber-js`, `resend` and
   `@upstash/redis`, added for this feature).
2. Copy `.env.local.example` to `.env.local` and fill in at least
   `RESEND_API_KEY` to actually send email locally. Everything else has a
   working default (see the comments in that file).
3. `npm run dev`, then visit `http://localhost:3000/roundtable`.

## Verifying the markoholics.com domain in Resend (SPF, DKIM, DMARC)

Both emails this feature sends use `contact@markoholics.com` as the actual
sending address (the thank you email's display name is set by `FROM_EMAIL`,
the internal notification's is hardcoded to "Markoholics Roundtable", but
the address itself comes from `CONTACT_EMAIL` in both cases). For that
address to deliver reliably (not land in spam, not get rejected outright),
the domain needs to be verified in Resend:

1. In the [Resend dashboard](https://resend.com/domains), add
   `markoholics.com` as a domain.
2. Resend gives you three DNS records to add at whichever registrar or DNS
   provider hosts markoholics.com:
   - An **SPF** record (a `TXT` record, usually on the root or a `send`
     subdomain, authorising Resend's servers to send on the domain's
     behalf).
   - A **DKIM** record (a `TXT` record on a Resend-generated selector
     subdomain, used to cryptographically sign outgoing mail).
   - Optionally, if the domain doesn't already have one, a **DMARC**
     record (a `TXT` record at `_dmarc.markoholics.com`) telling receiving
     mail servers what to do with mail that fails SPF/DKIM. If
     markoholics.com already sends mail some other way (e.g. Google
     Workspace), check the existing DMARC policy before adding a second
     one; don't overwrite it, merge the `v=DMARC1` record.
3. Add all the records Resend lists, then click Verify in the dashboard.
   Propagation is usually minutes, occasionally longer depending on the
   DNS provider.
4. Until verification completes, Resend will either reject sends from
   `contact@markoholics.com` or (on the free/sandbox tier) only deliver to
   the Resend account's own email address. `RESEND_FROM_EMAIL` (the
   existing site-wide var, unrelated to this feature's `FROM_EMAIL`)
   already documents this same caveat for the contact form.

## Deploying to Vercel

This feature needs no deployment steps beyond what's already in place for
the rest of the site, since it's the same Next.js app on the same domain.
In the Vercel project's Settings -> Environment Variables, add:

- `RESEND_API_KEY` (shared with the rest of the site already, if already set)
- `FROM_EMAIL` (defaults to `Markoholics <contact@markoholics.com>` if unset)
- `CONTACT_EMAIL` (defaults to `contact@markoholics.com` if unset)
- `NOTIFY_EXTRA_EMAILS` (optional, comma separated)
- `ENFORCE_BUSINESS_EMAIL` (optional, defaults to `true`; set to `false` to
  allow free email providers through)
- `GOOGLE_SHEETS_WEBHOOK_URL` (optional, see below)
- `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` (optional, see below)
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` (optional, site-wide, not specific to this feature)

Redeploy after adding or changing any of these; Next.js reads `process.env`
at build and request time, not live.

## Rate limiting across serverless instances (optional, Upstash)

Without `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` set, the
5-per-hour-per-IP limit on `POST /api/interest` is tracked in memory and
resets whenever the serverless function cold starts, and doesn't coordinate
across concurrently running instances. That's fine for local development
and a low-traffic launch. For real cross-instance limiting:

1. Create a free Redis database at [upstash.com](https://upstash.com).
2. Copy its REST URL and REST token from the Upstash console.
3. Set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` in
   `.env.local` (and in Vercel for production). No code change needed;
   `src/lib/roundtable/rateLimit.ts` picks it up automatically and falls
   back to the in-memory limiter if a request to Upstash ever fails.

## Optional Google Sheets backup

Email is the source of truth; this is purely a belt-and-braces backup. If
`GOOGLE_SHEETS_WEBHOOK_URL` is set, every valid, non-bot submission is also
POSTed as JSON to that URL. A failure here is logged and never affects the
response the visitor sees.

1. Create a new Google Sheet.
2. Extensions -> Apps Script, and replace the default code with:

   ```javascript
   function doPost(e) {
     var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
     var data = JSON.parse(e.postData.contents);

     if (sheet.getLastRow() === 0) {
       sheet.appendRow(Object.keys(data));
     }

     var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
     var row = headers.map(function (key) {
       var value = data[key];
       if (Array.isArray(value)) return value.join(", ");
       return value === undefined || value === null ? "" : value;
     });
     sheet.appendRow(row);

     return ContentService.createTextOutput(JSON.stringify({ ok: true }))
       .setMimeType(ContentService.MimeType.JSON);
   }
   ```

3. Deploy -> New deployment -> type "Web app". Set "Execute as" to
   yourself and "Who has access" to "Anyone" (the Apps Script web app URL
   itself is the only credential; there's no further auth on this
   endpoint, so treat the URL as a secret and don't publish it).
4. Copy the deployment's web app URL into `GOOGLE_SHEETS_WEBHOOK_URL`.
5. Submit a test entry through the form and confirm a new row appears.

## Testing the form end to end

1. `npm run test` runs the automated suite:
   `src/lib/roundtable/schema.test.ts` (validation rules: valid payload,
   missing fields, free email rejection, bad WhatsApp number, the "Other"
   expertise requirement), `src/app/api/interest/route.test.ts` (the full
   route with Resend mocked: success, invalid body, rate limited,
   honeypot, too-fast submission, internal email failure, thank you email
   failure), and `src/content/roundtable.test.ts` (the homepage teaser
   hrefs, and the em dash / hyphen-as-dash scan).
2. Manually, with `RESEND_API_KEY` set to a real key and
   `CONTACT_EMAIL`/`FROM_EMAIL` pointed at a verified domain (or Resend's
   test mode): fill in the form at `/roundtable` with a real inbox you can
   check, submit, and confirm both the thank you email and the internal
   notification arrive and render correctly (check on mobile Gmail too,
   since the templates are inline-CSS HTML with a plain text fallback).
3. To check validation without sending real email, submit with an
   obviously invalid field (e.g. a `gmail.com` business email) and confirm
   the inline error appears and focus moves to that field.
4. To check the honeypot/timing bot protection, submit via `curl` or the
   browser console with `website_url_confirm` filled in, or faster than 3
   seconds after page load; confirm you get a 201 response but no email
   sends (check server logs, nothing should print beyond the request
   completing).
5. To check the homepage teaser's tracking, click its "Express interest"
   button from the homepage, confirm the URL becomes `/roundtable?ref=home`,
   submit the form, and confirm the internal notification's "Source" line
   shows `ref: home`.
