# Markoholics GTM Index

A free, zero-cost audit tool at `/gtm-index`: a visitor submits a company
URL (plus optional LinkedIn/Instagram/X links), the server fetches the
homepage and a few linked pages directly over plain HTTP, scores six
weighted pillars with fixed, deterministic rules, shows a gated summary
on the page, and emails the full report once the visitor gives a name
and work email. The six-pillar rubric and the five step positioning
framework it sits on both live in
[`/blog/product-positioning-exercise`](/blog/product-positioning-exercise).

**This is the deterministic, rule-based version of the tool, not an AI
one.** An earlier version of this feature ran two Claude API calls (an
"Evidence Collector" with web search/fetch tools, then an "Index
Analyst" that scored and wrote the report). That version produced a
genuinely richer, AI-written diagnosis, but cost real money per run and
needed `ANTHROPIC_API_KEY` set with funded credits. This version trades
that depth for being free forever: no API key, no per-run cost, no
dependency on any third-party model provider. See **Limitations** below
for exactly what that trade costs.

This is an ordinary route inside the main markoholics.com Next.js app,
not a separate deployment: pushing this repo to Vercel serves
`https://www.markoholics.com/gtm-index` the same way it serves every
other page.

## The flow

1. Visitor submits a company URL (required) and optional social links on
   `/gtm-index`.
2. `POST /api/gtm-index/analyze` checks a 7 day cache by domain, then:
   - **`collectEvidence()`** (`src/lib/gtmIndex/collector.ts`): fetches
     the homepage with `fetchPage()` (plain `fetch`, a real User-Agent,
     a `robots.txt` check, a 10s timeout per request), parses it with
     `cheerio`, follows up to 5 linked pages by priority (pricing,
     product, customers, about, blog), and attempts each submitted
     social URL. Every fact recorded (a headline, a CTA label, a
     testimonial count, a keyword hit) is tied to a real fetched page
     and gets a cited `evidence_id`, the same ledger shape the original
     AI version produced.
   - **`buildScoredReport()`** (`src/lib/gtmIndex/scorer.ts`): scores
     each of the six pillars (Position, Proof, Buyer, Message, Path,
     Presence) with fixed rules against the ledger's counts and keyword
     hits, picks a primary failure pattern, and assembles the summary
     and full report from templates filled in with the actual detected
     facts, not free-form AI prose.
3. `validateScoredReport()` (`src/lib/gtmIndex/validate.ts`) self-checks
   the result: every cited evidence id must exist, and the index score
   must reproduce the pillar arithmetic. Since scoring is now
   deterministic code, a failure here means a bug in the scorer, not a
   model error, so there is nothing to retry; it logs loudly and
   declines rather than show an inconsistent score.
4. The full ledger and scored report (internal, founder-only block
   included) are stored in Supabase. Only the gated `summary` and
   `index` fields are returned to the browser.
5. The visitor submits name and work email, which `POST
   /api/gtm-index/deliver` validates (rejects free email providers; see
   `isBlockedEmailDomain` in `src/lib/roundtable/schema.ts`, reused here),
   then emails the full report and posts an internal Slack alert with the
   hidden ICP-fit block, never shown to the visitor.

## Limitations (be upfront about these)

Rule-based scoring from a handful of fetched pages cannot do everything
the AI version could:

- **No competitor discovery or search visibility check.** There is no
  search API involved, so `competitors_seen` is always empty and
  `search_findability` is always "not checked". The Presence pillar is
  always capped and flagged provisional for this reason.
- **No judgment calls.** The scorer can count testimonials, CTAs and
  jargon words; it cannot judge whether a differentiator is actually
  what the category gets judged on, or write a bespoke diagnosis. Steps
  2 through 5 of the five-step read are always marked
  `needs_founder_input: true`.
- **JavaScript-rendered sites return `insufficient_data`.** This is a
  plain HTTP fetch, not a browser; a site that renders its real content
  client-side (an empty `<div id="root">` in the raw HTML) cannot be
  read. `collector.ts`'s `looksLikeJsShell()` detects the common case
  and fails gracefully rather than scoring an empty page.
- **Social reads are best-effort.** LinkedIn, Instagram and X block most
  unauthenticated fetches; `social_access` will usually come back
  `"blocked"` with only public Open Graph metadata readable when it
  isn't.
- **No alternative market frame suggestions.** Generating a genuinely
  useful alternative positioning frame is exactly the kind of judgment
  call this version can't make without inventing generic advice, so
  `frame_options` is intentionally left empty rather than filled with
  something that would fit any company.

## Where everything lives

| What | File |
| --- | --- |
| Page copy (hero, form labels, result labels) | `src/content/gtmIndex.ts` |
| Shared TypeScript types for the ledger and scored report | `src/lib/gtmIndex/types.ts` |
| The polite HTTP fetch helper (timeout, User-Agent, `robots.txt`) | `src/lib/gtmIndex/fetchPage.ts` |
| Pure text/markup signal detectors (jargon, CTAs, testimonials, buyer keywords) | `src/lib/gtmIndex/textSignals.ts` |
| The deterministic evidence collector | `src/lib/gtmIndex/collector.ts` |
| The deterministic scorer (pillar rules, report assembly) | `src/lib/gtmIndex/scorer.ts` |
| Evidence-id / arithmetic self-check | `src/lib/gtmIndex/validate.ts` |
| Supabase persistence and the 7 day domain cache | `src/lib/gtmIndex/store.ts` |
| The Template C report-delivery email (Resend) | `src/lib/gtmIndex/email.ts` |
| The two API routes | `src/app/api/gtm-index/analyze/route.ts`, `src/app/api/gtm-index/deliver/route.ts` |
| The landing page | `src/app/gtm-index/page.tsx` |
| The form, result, and client orchestrator components | `src/components/gtm-index/*.tsx` |

Rate limiting reuses `src/lib/roundtable/rateLimit.ts` (Upstash if
configured, else in-memory); the work-email blocklist reuses
`isBlockedEmailDomain`/`serverEnforceBusinessEmail` from
`src/lib/roundtable/schema.ts`; Slack alerting reuses `src/lib/slack.ts`.
Nothing in the roundtable feature was changed to support this reuse.

## Required environment variables

No new required variable. See `.env.local.example`: this feature reuses
`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`,
`FROM_EMAIL`, `CONTACT_EMAIL` and `SLACK_WEBHOOK_URL`, all already used
by other features on this site. `GTM_INDEX_CALENDLY_URL` is optional and
defaults to the same link already used on `/fit-check`.

## Supabase table

Run this once in the Supabase SQL editor (same project the rest of the
site already uses):

```sql
create table if not exists gtm_index_reports (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  company_url text not null,
  company_domain text not null,
  company_name text not null,
  linkedin_url text,
  instagram_url text,
  x_url text,
  visitor_ip text,
  status text not null,
  ledger jsonb not null,
  scored jsonb not null,
  index_score integer,
  index_band text,
  primary_failure_pattern text,
  recipient_name text,
  recipient_email text,
  delivered_at timestamptz
);

create index if not exists gtm_index_reports_domain_created_idx
  on gtm_index_reports (company_domain, created_at desc);
```

`ledger` and `scored` hold the full collector and scorer output,
internal block included. There is no login system on this site (matching
the `fit_check_responses` table's own convention), so treat the Supabase
service role key as the only thing gating access to that data.

## Cost and latency

Zero per-run cost: no model call, no API key. A fresh (non-cached) run
is a handful of sequential HTTP fetches (homepage, up to 5 linked pages,
up to 3 social URLs), each with its own 10s timeout, so it typically
finishes in a few seconds and rarely more than 20 to 30 for a slow site.
`maxDuration` on `/api/gtm-index/analyze` is set to 60s as a ceiling.
The 7 day cache-by-domain in `store.ts` and the per-IP rate limit on
`/api/gtm-index/analyze` exist to stop a scripted competitor audit from
hammering the same or many domains back to back; since there's no
per-run cost to protect, the limit here (20/hour/IP) is generous.

## Testing checklist

- `npm run test` covers the pure-function pieces: evidence-id extraction,
  pillar-arithmetic self-check, and the fix-language heuristic
  (`src/lib/gtmIndex/validate.test.ts`), plus the text-signal detectors
  and pillar scoring rules (`src/lib/gtmIndex/textSignals.test.ts`,
  `src/lib/gtmIndex/scorer.test.ts`).
- Manually: run `/gtm-index` against a real company URL locally and
  confirm the summary renders, the pillar weights sum to the displayed
  index score, and the "what this scan could not check" section in the
  emailed report actually lists search/competitor discovery as a gap.
- Confirm a second run against the same domain within 7 days returns
  `cached: true` immediately.
- Confirm a known JavaScript-only site (an SPA with an empty server
  response) returns `insufficient_data` rather than a misleadingly low
  score.
- Confirm a free-provider email (gmail.com, etc.) is rejected at the
  delivery step when `ENFORCE_BUSINESS_EMAIL` is unset or `true`.
