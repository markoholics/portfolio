# Fit Check

A seven screen qualification flow that replaces a generic enquiry form with
something that both feels good to fill in and quietly routes the wrong fit
away before a call ever happens. Lives at `/fit-check` and as an embeddable
component (`FitCheckEmbed`) for dropping into other pages.

## Where everything lives

| What | File |
| --- | --- |
| Questions, weights, deal breakers, soft caps, flags, thresholds, prices, booking links, blocked email domains | `src/lib/fit-check/config.ts` |
| Every word shown on screen or sent by email | `src/lib/fit-check/copy.ts` |
| The pure scoring/routing function | `src/lib/fit-check/scoring.ts` (+ `scoring.test.ts`) |
| Supabase reads/writes | `src/lib/fit-check/responses.ts` |
| Make webhook | `src/lib/fit-check/webhook.ts` |
| Auto reply emails + the Green and Red-note email/Slack alerts | `src/lib/fit-check/notify.ts` |
| The API route (progress, submit, red note) | `src/app/api/fit-check/route.ts` |
| Internal analytics / CSV export | `src/app/api/fit-check/export/route.ts` |
| The step-by-step UI | `src/components/fit-check/FitCheckFlow.tsx` |
| Standalone page | `src/app/fit-check/page.tsx` |
| Embeddable version for another page | `src/components/fit-check/FitCheckEmbed.tsx` |
| Supabase table | `supabase/fit_check_responses.sql` |

## Changing questions, weights, thresholds and prices without touching components

Everything a non-engineer would want to tweak lives in **`config.ts`** and
**`copy.ts`**. Nothing in `src/components/fit-check` or the API route needs
to change for any of the following:

- **Change wording, options, "why we ask" lines, or the three auto reply
  emails** → edit `copy.ts`. The question heading/options shown on screen
  and the option *values* used for scoring are separate (`copy.ts` has the
  label, `config.ts` has the value and its point score), so renaming a
  label never breaks scoring.
- **Change how many points an answer is worth, or a question's weight** →
  edit `QUESTION_SCORES` / `QUESTION_WEIGHTS` in `config.ts`.
- **Make a different answer a deal breaker (instant Red)** → add it to
  `DEAL_BREAKER_ANSWERS` in `config.ts`.
- **Cap the best possible route for an answer** (like "mostly outside
  India" never reaching Green) → add it to `SOFT_CAP_ANSWERS`.
- **Flag an answer for internal review without changing the route** → add
  it to `FLAG_ANSWERS`.
- **Move the Green/Amber cutoffs** → `GREEN_THRESHOLD_PERCENT` /
  `AMBER_THRESHOLD_PERCENT` in `config.ts`.
- **Change prices** → `PRICING` in `config.ts`. `copy.ts` reads prices from
  here rather than hardcoding numbers in the landing page, the Amber
  screen, or the emails, so a price change is one edit.
- **A/B test the price anchor** → flip `SHOW_PRICE_ANCHOR` in `config.ts`.
- **Swap the Amber Calendly link once a dedicated 20 minute event exists**
  → `AMBER_BOOKING_URL` in `config.ts` (currently reuses the same 30
  minute link as Green, by design, until a shorter event is created).
- **Add/remove a question entirely** is the one change that *does* touch
  more than config: add the field to `FitCheckAnswers` in `config.ts`, its
  scores/weight, its copy block in `copy.ts`, and a screen for it in
  `FitCheckFlow.tsx`, then update `TOTAL_STEPS` and the step numbers each
  screen advances to. `scoring.ts` itself needs no changes — it is
  table driven off whatever keys exist on `FitCheckAnswers`.

Whenever you change `config.ts`, run `npm run test` — the whole point of
`scoring.test.ts` is to catch an accidental change to a deal breaker or a
threshold before it ships.

## Scoring, at a glance

Each question's raw score (0 to its max) is multiplied by its weight and
summed. Investment, goal, and work style count double, matching the brief.
The total is expressed as a percentage of the maximum possible score:

- **80% or more, no deal breaker** → Green.
- **55% to 79%, or that score but soft capped down** → Amber.
- **Below 55%, or any deal breaker present** → Red. A deal breaker always
  wins outright, regardless of score.

The literal words "Green", "Amber" and "Red" are never sent to the browser
in anything rendered — the API response field is read by the client purely
to decide which result screen component to show.

## Environment variables

All optional in the sense that a missing one degrades gracefully (logs and
no-ops) rather than breaking the form — see `.env.local.example` for the
full annotated list shared with the rest of the site. Fit Check specific
ones:

| Variable | Used for |
| --- | --- |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Persisting responses (partial and complete) to `fit_check_responses`. Shared with the rest of the site — see the root `.env.local.example`. |
| `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `NOTIFY_EMAIL` | The three auto reply emails, and the internal alert emails for Green and for a Red one off project note. Shared with the rest of the site. |
| `SLACK_WEBHOOK_URL` | The internal Slack alert — fires for a Green result, and separately whenever a Red result's optional "I have a defined one off project" note is filled in. Nothing else triggers it (an Amber result, or a Red result with that field left blank, stays silent). An [incoming webhook URL](https://api.slack.com/messaging/webhooks) from your Slack workspace. |
| `MAKE_FIT_CHECK_WEBHOOK_URL` | Every submission's full payload plus computed route, posted to a Make scenario for you to route on to Notion, Brevo, Apollo enrichment, or anything else. |
| `FIT_CHECK_EXPORT_KEY` | Shared secret for `/api/fit-check/export`. Generate a long random string (e.g. `openssl rand -hex 32`) and keep it private — anyone with this value can read every submission. |

None of these need to be set for the flow to work end to end locally: with
Supabase unset the submission still succeeds via the Make webhook and
email channels (see "Resilience" below); with Resend/Slack/Make unset,
those sends are skipped and logged, never block the visitor.

## Resilience

Matches the pattern already used by `/contact` and `/gtm-audit` on this
site: the API route never makes Supabase the single point of failure.
A submission tries to persist to Supabase, fires the Make webhook, and
sends the auto reply email independently of each other — if Supabase is
unconfigured or down, the Make webhook and email are still your record of
what happened. Partial progress (every answered screen) is saved the same
way, which is what gives you real step by step drop off data even for
visitors who never finish.

Rate limiting is in memory, per serverless instance — there is no
Redis/KV store in this project. It stops a single client hammering one
warm instance; it does not coordinate across instances and resets on a
cold start. If you need real cross instance limiting, put Upstash or
Vercel KV in front of the two functions in `src/app/api/fit-check/route.ts`
(`isRateLimited` / `rateLimitBuckets`) — nothing else needs to change.

## Internal analytics and CSV export

`GET /api/fit-check/export?key=YOUR_FIT_CHECK_EXPORT_KEY` returns a JSON
summary: starts, completions, completion rate, step reached and drop off
per step, route distribution, and average time to complete.

`GET /api/fit-check/export?key=YOUR_FIT_CHECK_EXPORT_KEY&format=csv`
downloads the raw rows (one per response, partial or complete) as a CSV.

Two things this cannot see, by design:

- **Landing page views** — read these from GA4 like any other page; the
  page fires a normal pageview, nothing custom needed.
- **Confirmed bookings** — the Green/Amber screens fire a
  `fit_check_booking_click` GA4 event when the Calendly link is clicked,
  which is the closest proxy available without a Calendly webhook
  integration. Ask if you want that wired up properly.

## Embedding on another page

```tsx
import FitCheckEmbed from "@/components/fit-check/FitCheckEmbed";

// inside any page or section
<FitCheckEmbed />
```

Pass `showHeading={false}` if the surrounding page already has its own
heading and you only want the flow itself.

## Design decisions worth knowing about

- **`/fit-check` keeps the normal site nav and footer**, unlike the paid
  campaign pages (`/gtm-audit`, `/free-gtm-audit`), which deliberately
  have none. This is a core site funnel, not a paid landing page — say
  the word if you'd rather it behave like the campaign pages.
- **India only, INR only, no outcome guarantees** — scoped entirely to
  this feature's own copy and pricing. The rest of the site's existing
  positioning and USD pricing were left untouched.
- **No light theme** — the whole site is a single dark theme by design;
  Fit Check follows that rather than introducing a light variant nothing
  else on the site has.

## Running the tests

```
npm run test
```

Covers every route (Green, Amber, Red by score) and every deal breaker
(investment under ₹60,000, month to month only work style, both at once,
and a deal breaker beating an otherwise Amber score), plus the soft cap
and flag behaviour.

## Test checklist

Manual checks worth running before and after any change here, beyond the
automated `scoring.test.ts` suite:

**Mobile (360px wide)**
- [ ] All seven screens render with no horizontal scroll at 360px.
- [ ] Option cards are comfortably tappable one handed (no accidental
      double-taps between adjacent cards).
- [ ] The progress bar and "Question X of 7" label stay visible without
      obscuring content.
- [ ] The contact screen's five fields and submit button are all reachable
      without the keyboard covering the active field.

**Partial saves**
- [ ] Open the Network tab, answer question 1, confirm a `POST
      /api/fit-check` with `"event":"progress"` fires.
- [ ] Abandon the flow partway through (e.g. after question 3) and confirm
      a row exists in `fit_check_responses` with `status = 'in_progress'`
      and `current_step = 3`.
- [ ] Confirm `GET /api/fit-check/export?key=...` reflects that drop off
      in `dropOffByStep`.

**Spam handling**
- [ ] Submit with the honeypot field (`company_size_hint`) filled via
      devtools — confirm the API returns `{ ok: true }` but nothing is
      persisted or sent.
- [ ] Submit the same session's contact step more than 8 times in an hour
      — confirm the 9th attempt gets a 429.
- [ ] Submit with an email on `BLOCKED_EMAIL_DOMAINS` (e.g.
      `test@mailinator.com`) — confirm it is rejected with a clear error.

**Consent**
- [ ] The first screen's option cards are inert until the consent checkbox
      is ticked (clicking does nothing, a "tick the box above" hint shows).
- [ ] The Privacy Policy link on screen one opens `/privacy`.
- [ ] Nothing is sent to the server before question 1 is actually
      answered (no progress call fires purely from viewing the page).

**Accessibility / quality bar**
- [ ] Tab through an entire flow using only the keyboard; every
      interactive element shows a visible focus ring.
- [ ] Enable "reduce motion" at the OS level and confirm transitions
      become effectively instant.
- [ ] Run the page with a screen reader and confirm the progress bar
      announces "Question X of 7".
- [ ] Confirm the literal words "Green", "Amber" and "Red" never appear
      anywhere in rendered text, for any outcome.
