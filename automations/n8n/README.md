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
   Apify/API rate limits for the 50-100 lead batch).
3. **Apify: Scrape LinkedIn Profile** — runs an Apify LinkedIn profile scraper
   actor against the lead's `LinkedIn_URL` to pull verified name, current
   title/company, about section, recent activity.
4. **Apify: Scrape LinkedIn Company** — runs an Apify LinkedIn company scraper
   against the company page for industry, size, description.
5. **Fetch Recent Company News** — pulls recent news via SerpAPI (Google News)
   keyed on company name, for milestone/challenge context.
6. **Merge, Verify & Normalize Lead** — cross-checks the Apollo record against
   the LinkedIn scrape (name + company match) and flags mismatches instead of
   silently trusting Apollo data.
7. **Append to Master Leads Sheet** — writes the full enriched record.
8. **Build Email Prompt / Draft Personalized Email (Claude)** — generates a
   short, specific, non-templated email referencing the real news/highlight
   found for that lead.
9. **Update Master Sheet With Draft** — writes the subject/body back into the
   same row so you can review before anything goes out.
10. **Push Contact + Draft to Brevo** — upserts the contact into a Brevo list
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
| `APIFY_API_TOKEN` | env var | Apify account token |
| `APIFY_LINKEDIN_PROFILE_ACTOR_ID` | env var | e.g. an actor like `apimaestro/linkedin-profile-detail` |
| `APIFY_LINKEDIN_COMPANY_ACTOR_ID` | env var | LinkedIn company-page scraper actor |
| `SERPAPI_API_KEY` | env var | Or swap the news node for any news/search API you prefer |
| `Anthropic API Key (x-api-key)` (HTTP Header Auth credential) | Draft email node | Header `x-api-key: <key>` |
| `Brevo API Key (api-key header)` (HTTP Header Auth credential) | Brevo node | Header `api-key: <key>` |
| `BREVO_OUTREACH_LIST_ID` | env var | Brevo list ID the contacts get added to |

Set env vars in n8n under **Settings → Environments** (or your n8n instance's
`.env`), and create the two HTTP Header Auth credentials under **Credentials**.

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
  it if your Apify actor or LinkedIn account needs more headroom for a
  50-100 lead run.
- Apify LinkedIn scraping actors and SerpAPI both cost credits per call —
  check your plan before running the full batch.
- Claude drafting uses `claude-sonnet-5`; swap the model name in the
  **Draft Personalized Email (Claude)** node if you want a different tier.

## Customizing the email voice

Edit the prompt template in the **Build Email Prompt** code node — it's the
single place that controls tone, length, and what counts as "specific enough"
context to reference.
