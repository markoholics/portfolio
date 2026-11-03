# Markoholics GTM Index

A free, two-call AI audit tool at `/gtm-index`: a visitor submits a
company URL (plus optional LinkedIn/Instagram/X links), Claude gathers
public evidence about that company's go-to-market, a second Claude call
scores it against the Markoholics GTM Index (six weighted pillars, a
score out of 100, a named failure pattern), a gated summary renders on
the page, and the full report is emailed once the visitor gives a name
and work email. Built from the GTM Audit Prompt Pack v2; the scoring
rubric and the five step positioning framework it sits on both live in
[`/blog/product-positioning-exercise`](/blog/product-positioning-exercise).

This is an ordinary route inside the main markoholics.com Next.js app,
not a separate deployment: pushing this repo to Vercel serves
`https://www.markoholics.com/gtm-index` the same way it serves every
other page.

## The flow

1. Visitor submits a company URL (required) and optional social links on
   `/gtm-index`.
2. `POST /api/gtm-index/analyze` checks a 7 day cache by domain, then runs
   two sequential Claude API calls:
   - **Call 1, Evidence Collector** (`web_search` + `web_fetch` tools on):
     gathers an evidence ledger as JSON. Observation only, no scoring.
   - **Call 2, Index Analyst** (no tools): scores the ledger against the
     six pillar rubric and writes the report, citing an evidence id on
     every finding.
3. The route validates Call 2's output against the ledger (every cited
   evidence id must exist, the index score must match the pillar
   arithmetic, the summary must contain no fix/recommendation language)
   and retries once if it fails. A second failure returns
   `status: "insufficient_data"` rather than show an unverified score.
4. The full ledger and scored report (including the internal, founder-only
   block) are stored in Supabase. Only the gated `summary` and `index`
   fields are returned to the browser.
5. The visitor submits name and work email, which `POST
   /api/gtm-index/deliver` validates (rejects free email providers; see
   `isBlockedEmailDomain` in `src/lib/roundtable/schema.ts`, reused here),
   then emails the full report and posts an internal Slack alert with the
   hidden ICP-fit block, never shown to the visitor.

## Where everything lives

| What | File |
| --- | --- |
| Page copy (hero, form labels, result labels) | `src/content/gtmIndex.ts` |
| Shared TypeScript types for the ledger and scored report | `src/lib/gtmIndex/types.ts` |
| Both system prompts and the user-message builders | `src/lib/gtmIndex/prompts.ts` |
| The two Claude API calls (streaming, pause_turn handling, JSON extraction) | `src/lib/gtmIndex/anthropic.ts` |
| Evidence-id / arithmetic / fix-language validation | `src/lib/gtmIndex/validate.ts` |
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

See `.env.local.example` for the full list and comments. The one new
requirement is `ANTHROPIC_API_KEY` (a Claude API key with web_search and
web_fetch access); everything else (`SUPABASE_URL`,
`SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `FROM_EMAIL`,
`CONTACT_EMAIL`, `SLACK_WEBHOOK_URL`) is already used by other features on
this site and is reused here rather than duplicated.

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

`ledger` and `scored` hold the full Call 1 and Call 2 output, internal
block included. There is no login system on this site (matching the
`fit_check_responses` table's own convention), so treat the Supabase
service role key as the only thing gating access to that data.

## Cost and latency

Each fresh (non-cached) run costs two model calls, one of them running up
to roughly a dozen web_search/web_fetch tool calls, and routinely takes
30 to 90 seconds end to end. Both API routes set `maxDuration` (300s for
analyze, 30s for deliver); confirm the Vercel plan in use actually
supports a serverless function duration that long before relying on it in
production. The 7 day cache-by-domain in `store.ts` and the 3-per-hour
per-IP rate limit on `/api/gtm-index/analyze` both exist specifically to
keep a single visitor, or a scripted competitor audit, from running this
repeatedly.

## Testing checklist

- `npm run test` covers the pure-function pieces: evidence-id extraction,
  pillar-arithmetic validation, and the fix-language heuristic
  (`src/lib/gtmIndex/validate.test.ts`).
- Manually: run `/gtm-index` against a real company URL locally with
  `ANTHROPIC_API_KEY` set, confirm the summary renders and the score's
  pillar weights sum to the displayed index score, then submit the email
  gate with a real inbox and confirm Template C arrives and renders
  correctly.
- Confirm a second run against the same domain within 7 days returns
  `cached: true` immediately instead of spending new model/tool calls.
- Confirm a free-provider email (gmail.com, etc.) is rejected at the
  delivery step when `ENFORCE_BUSINESS_EMAIL` is unset or `true`.
