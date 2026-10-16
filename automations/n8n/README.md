# Apollo → LinkedIn Verify & Enrich → Draft Emails → Brevo

n8n workflow that takes an exported list of Apollo leads, verifies and enriches
each one against LinkedIn (profile + company), pulls recent company news, logs
everything to a Google Sheet, drafts a customized outreach email per lead with
Claude, and stages the contact + draft in Brevo (as a **draft**, ready for you
to review and send — nothing is auto-dispatched).

## Import

In n8n: **Workflows → Import from File** → `apollo-linkedin-lead-enrichment.json`.

## What it does (per lead, looped one at a time)

1. **Read Apollo Leads (Sheet)** — reads your Apollo export from a Google Sheet.
2. **Loop Over Leads** — processes one lead per iteration (keeps you under
   Bright Data/API rate limits for the 50-100 lead batch).
3. **Bright Data: Trigger LinkedIn Profile Scrape** — kicks off a Bright Data
   Web Scraper API ("Dataset API") job for the lead's `LinkedIn_URL` against
   your LinkedIn people-profile dataset/collector. Returns a `snapshot_id`.
4. **Wait: Profile Scrape Poll → Bright Data: Check Profile Progress →
   Evaluate Profile Poll → IF: Profile Poll Done?** — Bright Data's Dataset
   API is asynchronous, so this is a bounded poll loop (default: every 8s, up
   to `BRIGHTDATA_MAX_POLL_ATTEMPTS` times) that waits for the job to reach
   `status: "ready"` (or `"failed"`, or the attempt cap) before continuing.
5. **Bright Data: Fetch Profile Result** — pulls the finished snapshot: name,
   current title/company, about section, recent activity.
6. **Bright Data: Trigger/Poll/Fetch LinkedIn Company Scrape** — same
   trigger → poll → fetch pattern, run against the company's LinkedIn page
   (URL taken from the profile scrape, falling back to `Company_LinkedIn_URL`
   from the input sheet) for industry, size, description.
7. **Fetch Recent Company News** — pulls recent news via SerpAPI (Google News)
   keyed on company name, for milestone/challenge context.
8. **Merge, Verify & Normalize Lead** — cross-checks the Apollo record against
   the LinkedIn scrape (name + company match) and flags mismatches instead of
   silently trusting Apollo data.
9. **Append to Master Leads Sheet** — writes the full enriched record.
10. **Build Email Prompt / Draft Personalized Email (Claude)** — generates a
    short, specific, non-templated email referencing the real news/highlight
    found for that lead.
11. **Update Master Sheet With Draft** — writes the subject/body back into the
    same row so you can review before anything goes out.
12. **Push Contact + Draft to Brevo** — upserts the contact into a Brevo list
    with the draft stored as custom attributes (`DRAFT_SUBJECT`,
    `DRAFT_BODY`, `OUTREACH_STATUS = "Draft - Pending Review"`). You set up the
    actual campaign/template in Brevo to merge those attributes and send —
    this workflow never sends email itself.

## Required credentials / environment variables

| Name | Where used | Notes |
|---|---|---|
| `Google Sheets account` (OAuth2) | Read + write nodes | Needs edit access to both sheets |
| `APOLLO_LEADS_SHEET_URL` | env var | Sheet with your raw Apollo export |
| `MASTER_LEADS_SHEET_URL` | env var | Destination sheet (see schema below) |
| `Bright Data API Token (Bearer)` (HTTP Header Auth credential) | All Bright Data nodes | Header `Authorization: Bearer <your Bright Data API token>` |
| `BRIGHTDATA_LINKEDIN_PROFILE_DATASET_ID` | env var | Dataset/collector ID for Bright Data's LinkedIn **people profile** scraper (find it in your Bright Data dashboard under Web Scrapers) |
| `BRIGHTDATA_LINKEDIN_COMPANY_DATASET_ID` | env var | Dataset/collector ID for Bright Data's LinkedIn **company page** scraper |
| `BRIGHTDATA_MAX_POLL_ATTEMPTS` | env var, optional | Caps the poll loop per scrape (default 20 × 8s ≈ 160s max wait before giving up on that lead) |
| `SERPAPI_API_KEY` | env var | Or swap the news node for any news/search API you prefer |
| `Anthropic API Key (x-api-key)` (HTTP Header Auth credential) | Draft email node | Header `x-api-key: <key>` |
| `Brevo API Key (api-key header)` (HTTP Header Auth credential) | Brevo node | Header `api-key: <key>` |
| `BREVO_OUTREACH_LIST_ID` | env var | Brevo list ID the contacts get added to |

Set env vars in n8n under **Settings → Environments** (or your n8n instance's
`.env`), and create the three HTTP Header Auth credentials under **Credentials**.

### Bright Data setup

1. In the Bright Data dashboard, create (or use an existing) **Web Scraper
   API** collector for "LinkedIn people profiles" and one for "LinkedIn
   company pages" — Bright Data ships pre-built collectors for both. Copy
   each collector's **dataset ID** into the env vars above.
2. Generate an API token under **Account Settings → API Tokens** and put it
   in the `Bright Data API Token (Bearer)` credential as `Bearer <token>`.
3. Bright Data's Dataset API is async: trigger → poll → fetch. This workflow
   already implements that poll loop, but **field names in the scraped JSON
   can differ by collector/dataset version.** Run the workflow once for a
   single test lead, open the **Bright Data: Fetch Profile Result** /
   **...Fetch Company Result** node's output, and adjust the field-name
   fallbacks at the top of the **Merge, Verify & Normalize Lead** code node
   to match what your dataset actually returns.

## Sheet schemas

**`ApolloLeads`** (input, one row per Apollo export lead):
`Apollo_ID, Full_Name, Title, Company, Email, LinkedIn_URL, Company_LinkedIn_URL`

**`Leads`** (output/master, auto-created columns on first append):
`Apollo_ID, Full_Name, Title, Company, Company_Industry, Company_Size, Email,
LinkedIn_URL, Company_LinkedIn_URL, Verified, Verification_Notes,
Recent_Company_News, Personal_Highlights, Draft_Subject, Draft_Body, Status`

`Verified = N` rows include a `Verification_Notes` reason (name/company
mismatch, or scrape failure) — review those before emailing.

## Rate limits & cost notes

- The `Wait (rate limit)` node adds a 3s pause per lead before scraping; bump
  it if your Bright Data plan or LinkedIn account needs more headroom for a
  50-100 lead run.
- Each lead runs two full Bright Data trigger→poll→fetch cycles (profile +
  company), each polling every 8s up to `BRIGHTDATA_MAX_POLL_ATTEMPTS` times
  — for 50-100 leads this workflow can take a while end-to-end; that's normal
  for async scraping APIs, not a stuck workflow.
- Bright Data and SerpAPI both cost credits/usage per call — check your plan
  before running the full batch.
- Claude drafting uses `claude-sonnet-5`; swap the model name in the
  **Draft Personalized Email (Claude)** node if you want a different tier.

## Customizing the email voice

Edit the prompt template in the **Build Email Prompt** code node — it's the
single place that controls tone, length, and what counts as "specific enough"
context to reference.
