-- Markoholics /gtm-audit landing page: fallback lead-capture backend.
-- Run this in the Supabase SQL editor for your project (same one that
-- already runs schema.sql) before the /gtm-audit reserve-your-spot form
-- can save submissions.

create table if not exists public.gtm_audit_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  company text,
  website text,
  source text,
  utm_source text,
  utm_medium text,
  utm_campaign text
);

alter table public.gtm_audit_leads enable row level security;

-- No public read/write policies are created. All inserts go through the
-- Next.js API route (src/app/api/gtm-audit-lead/route.ts) using the
-- Supabase service role key, which bypasses RLS, so the table stays private.

create index if not exists gtm_audit_leads_created_at_idx
  on public.gtm_audit_leads (created_at desc);
