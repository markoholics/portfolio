-- Markoholics contact form backend.
-- Run this in the Supabase SQL editor for your project.

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  company text,
  message text
);

alter table public.contact_submissions enable row level security;

-- No public read/write policies are created. All inserts go through the
-- Next.js API route (src/app/api/contact/route.ts) using the Supabase
-- service role key, which bypasses RLS, so the table stays private.

create index if not exists contact_submissions_created_at_idx
  on public.contact_submissions (created_at desc);
