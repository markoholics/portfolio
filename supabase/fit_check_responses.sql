-- Markoholics /fit-check: stores every Fit Check response, including
-- partial ones, so drop off still gives signal. Run this in the Supabase
-- SQL editor for your project (same one that already runs schema.sql)
-- before the Fit Check can persist submissions.
--
-- Deliberately does NOT store the visitor's IP address or any field not
-- asked on screen, per the DPDP "collect the minimum" principle in the
-- consent copy (src/lib/fit-check/copy.ts). Rate limiting on the API route
-- uses the IP only in memory, never written here.

create table if not exists public.fit_check_responses (
  id uuid primary key default gen_random_uuid(),
  session_id text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,

  status text not null default 'in_progress' check (status in ('in_progress', 'completed')),
  current_step integer not null default 0,
  answers jsonb not null default '{}'::jsonb,

  -- Populated only once status = 'completed'. The literal route word is
  -- never shown to the visitor; it exists here purely for your own review
  -- and for the Make webhook payload.
  route text check (route in ('green', 'amber', 'red')),
  percent integer,
  raw_score integer,
  max_score integer,
  deal_breakers text[] not null default '{}',
  flags text[] not null default '{}',

  name text,
  email text,
  company_website text,
  linkedin_url text,
  notes text,
  one_off_note text,

  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  referrer text,

  booking_link_shown text
);

alter table public.fit_check_responses enable row level security;

-- No public read/write policies are created. All reads and writes go
-- through Next.js API routes (src/app/api/fit-check/route.ts and
-- src/app/api/fit-check/export/route.ts) using the Supabase service role
-- key, which bypasses RLS, so the table stays private.

create index if not exists fit_check_responses_created_at_idx
  on public.fit_check_responses (created_at desc);

create index if not exists fit_check_responses_status_idx
  on public.fit_check_responses (status);

create index if not exists fit_check_responses_route_idx
  on public.fit_check_responses (route);
