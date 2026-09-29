-- Markoholics /gtm-audit landing page: order log for real Razorpay payments.
-- Run this in the Supabase SQL editor for your project (same one that
-- already runs schema.sql and gtm_audit_leads.sql) before the Razorpay
-- webhook (src/app/api/gtm-audit/razorpay-webhook/route.ts) or the
-- checkout verify step (src/app/api/gtm-audit/verify-payment/route.ts)
-- can record a sale.

create table if not exists public.gtm_audit_orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  razorpay_order_id text not null,
  razorpay_payment_id text not null unique,
  amount bigint not null,
  currency text not null,
  status text not null default 'created',
  method text,
  email text,
  contact text,
  notes jsonb,
  raw_event jsonb
);

alter table public.gtm_audit_orders enable row level security;

-- No public read/write policies are created. All inserts go through the
-- Next.js API routes above using the Supabase service role key, which
-- bypasses RLS, so the table stays private.

create index if not exists gtm_audit_orders_created_at_idx
  on public.gtm_audit_orders (created_at desc);

create index if not exists gtm_audit_orders_razorpay_order_id_idx
  on public.gtm_audit_orders (razorpay_order_id);
