import { getSupabaseServerClient } from "@/lib/supabase";
import type { FitCheckAnswers } from "@/lib/fit-check/config";
import type { FitCheckResult } from "@/lib/fit-check/scoring";

const TABLE = "fit_check_responses";

export interface FitCheckUtm {
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_term?: string | null;
  utm_content?: string | null;
  referrer?: string | null;
}

// Called on every answered screen. Upserts by session_id so a visitor who
// drops off after step 3 still leaves a row showing they reached step 3 —
// that row is the drop off signal the brief asks for, no separate
// analytics event pipeline needed.
export async function saveFitCheckProgress(params: {
  sessionId: string;
  currentStep: number;
  answers: Partial<FitCheckAnswers>;
  utm: FitCheckUtm;
}): Promise<boolean> {
  try {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from(TABLE).upsert(
      {
        session_id: params.sessionId,
        current_step: params.currentStep,
        answers: params.answers,
        updated_at: new Date().toISOString(),
        ...params.utm,
      },
      { onConflict: "session_id" }
    );
    if (error) {
      console.error("Supabase fit_check_responses progress upsert error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Fit Check progress save (Supabase) error:", err);
    return false;
  }
}

export interface FitCheckContact {
  name: string;
  email: string;
  companyWebsite?: string | null;
  linkedinUrl?: string | null;
  notes?: string | null;
  oneOffNote?: string | null;
}

export async function saveFitCheckSubmission(params: {
  sessionId: string;
  answers: FitCheckAnswers;
  contact: FitCheckContact;
  result: FitCheckResult;
  bookingLinkShown: string | null;
  utm: FitCheckUtm;
}): Promise<boolean> {
  try {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from(TABLE).upsert(
      {
        session_id: params.sessionId,
        status: "completed",
        completed_at: new Date().toISOString(),
        current_step: 7,
        answers: params.answers,
        route: params.result.route,
        percent: params.result.percent,
        raw_score: params.result.rawScore,
        max_score: params.result.maxScore,
        deal_breakers: params.result.dealBreakers,
        flags: params.result.flags,
        name: params.contact.name,
        email: params.contact.email,
        company_website: params.contact.companyWebsite ?? null,
        linkedin_url: params.contact.linkedinUrl ?? null,
        notes: params.contact.notes ?? null,
        one_off_note: params.contact.oneOffNote ?? null,
        booking_link_shown: params.bookingLinkShown,
        updated_at: new Date().toISOString(),
        ...params.utm,
      },
      { onConflict: "session_id" }
    );
    if (error) {
      console.error("Supabase fit_check_responses submission upsert error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Fit Check submission save (Supabase) error:", err);
    return false;
  }
}

// Patches the optional one-line note on the Red screen ("If you have a
// defined one off project with a fixed budget..."). Submitted after the
// route is already known, so this only ever updates an existing row — it
// never creates one, and never touches score or route fields.
export async function saveFitCheckRedNote(sessionId: string, oneOffNote: string): Promise<boolean> {
  try {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase
      .from(TABLE)
      .update({ one_off_note: oneOffNote, updated_at: new Date().toISOString() })
      .eq("session_id", sessionId);
    if (error) {
      console.error("Supabase fit_check_responses red note update error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Fit Check red note save (Supabase) error:", err);
    return false;
  }
}

export interface FitCheckResponseRow {
  id: string;
  session_id: string;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  status: "in_progress" | "completed";
  current_step: number;
  route: "green" | "amber" | "red" | null;
  percent: number | null;
  name: string | null;
  email: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
}

// Used by the internal analytics/CSV export route only.
export async function listFitCheckResponses(): Promise<FitCheckResponseRow[]> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select(
      "id, session_id, created_at, updated_at, completed_at, status, current_step, route, percent, name, email, utm_source, utm_medium, utm_campaign"
    )
    .order("created_at", { ascending: false })
    .limit(5000);

  if (error) {
    throw new Error(`Supabase fit_check_responses list error: ${error.message}`);
  }
  return data ?? [];
}
