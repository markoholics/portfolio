// Persists GTM Index reports to Supabase. The full ledger and scored
// report (internal block included) are stored server side only; what the
// browser receives (see src/lib/gtmIndex/types.ts GtmIndexPublicResult)
// never includes them directly. See src/app/gtm-index/README.md for the
// table's create-table SQL.
import { getSupabaseServerClient } from "@/lib/supabase";
import type { EvidenceLedger, ScoredReport } from "@/lib/gtmIndex/types";

const TABLE = "gtm_index_reports";

export interface StoredReportRow {
  id: string;
  created_at: string;
  company_url: string;
  company_domain: string;
  company_name: string;
  status: "ok" | "insufficient_data";
  ledger: EvidenceLedger;
  scored: ScoredReport;
  index_score: number | null;
  index_band: string | null;
  delivered_at: string | null;
}

export async function createReport(params: {
  companyUrl: string;
  linkedinUrl: string | null;
  instagramUrl: string | null;
  xUrl: string | null;
  visitorIp: string;
  ledger: EvidenceLedger;
  scored: ScoredReport;
}): Promise<string> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      company_url: params.companyUrl,
      company_domain: params.scored.company_domain,
      company_name: params.scored.company_name,
      linkedin_url: params.linkedinUrl,
      instagram_url: params.instagramUrl,
      x_url: params.xUrl,
      visitor_ip: params.visitorIp,
      status: params.scored.status,
      ledger: params.ledger,
      scored: params.scored,
      index_score: params.scored.index?.score ?? null,
      index_band: params.scored.index?.band ?? null,
      primary_failure_pattern: params.scored.index?.primary_failure_pattern ?? null,
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(`Supabase gtm_index_reports insert error: ${error?.message ?? "no row returned"}`);
  }
  return data.id as string;
}

// Build note #6: cache the ledger by domain for seven days, so re-running
// the same company shortly after doesn't spend a fresh set of tool calls
// and two model calls for an identical result.
export async function findRecentReportByDomain(companyDomain: string): Promise<StoredReportRow | null> {
  const supabase = getSupabaseServerClient();
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from(TABLE)
    .select("id, created_at, company_url, company_domain, company_name, status, ledger, scored, index_score, index_band, delivered_at")
    .eq("company_domain", companyDomain)
    .eq("status", "ok")
    .gte("created_at", sevenDaysAgo)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Supabase gtm_index_reports cache lookup error:", error.message);
    return null;
  }
  return (data as StoredReportRow | null) ?? null;
}

export async function getReportById(id: string): Promise<StoredReportRow | null> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select("id, created_at, company_url, company_domain, company_name, status, ledger, scored, index_score, index_band, delivered_at")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Supabase gtm_index_reports lookup error:", error.message);
    return null;
  }
  return (data as StoredReportRow | null) ?? null;
}

export async function markDelivered(params: {
  id: string;
  recipientName: string;
  recipientEmail: string;
}): Promise<boolean> {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from(TABLE)
    .update({
      recipient_name: params.recipientName,
      recipient_email: params.recipientEmail,
      delivered_at: new Date().toISOString(),
    })
    .eq("id", params.id);

  if (error) {
    console.error("Supabase gtm_index_reports deliver update error:", error.message);
    return false;
  }
  return true;
}
