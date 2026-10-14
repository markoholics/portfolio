import { NextRequest, NextResponse } from "next/server";
import { listFitCheckResponses, type FitCheckResponseRow } from "@/lib/fit-check/responses";

const EXPORT_KEY = process.env.FIT_CHECK_EXPORT_KEY ?? "";

// Internal analytics view and CSV export for the Fit Check funnel. Gated
// by a shared-secret query param (?key=...) rather than a login system,
// since this repo has no auth of its own yet — see README.md in
// src/lib/fit-check for how to generate and set FIT_CHECK_EXPORT_KEY.
//
// Covers: total starts, completion rate, step reached / drop off per
// step, route distribution, and average time to complete — everything the
// brief's ANALYTICS section asks for except "landing page views" and
// "booking rate", which this backend cannot see: landing views come from
// GA4 (the page fires a normal pageview like any other route), and
// confirmed bookings would need a Calendly webhook, which is out of scope
// unless you ask for it. The Green/Amber screens do fire a GA4 event when
// the booking link is clicked, which is the closest proxy available today.
export async function GET(request: NextRequest) {
  if (!EXPORT_KEY) {
    return NextResponse.json(
      { error: "FIT_CHECK_EXPORT_KEY is not configured." },
      { status: 404 }
    );
  }

  const providedKey = request.nextUrl.searchParams.get("key");
  if (!providedKey || providedKey !== EXPORT_KEY) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  let rows: FitCheckResponseRow[];
  try {
    rows = await listFitCheckResponses();
  } catch (err) {
    console.error("Fit Check export error:", err);
    return NextResponse.json({ error: "Could not load responses." }, { status: 500 });
  }

  const format = request.nextUrl.searchParams.get("format");
  if (format === "csv") {
    return new NextResponse(toCsv(rows), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="fit-check-responses.csv"`,
      },
    });
  }

  return NextResponse.json(summarise(rows));
}

function csvField(value: unknown): string {
  const str = value === null || value === undefined ? "" : String(value);
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

function toCsv(rows: FitCheckResponseRow[]): string {
  const headers = [
    "session_id",
    "created_at",
    "completed_at",
    "status",
    "current_step",
    "route",
    "percent",
    "name",
    "email",
    "utm_source",
    "utm_medium",
    "utm_campaign",
  ];
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(
      [
        row.session_id,
        row.created_at,
        row.completed_at ?? "",
        row.status,
        row.current_step,
        row.route ?? "",
        row.percent ?? "",
        row.name ?? "",
        row.email ?? "",
        row.utm_source ?? "",
        row.utm_medium ?? "",
        row.utm_campaign ?? "",
      ]
        .map(csvField)
        .join(",")
    );
  }
  return lines.join("\n");
}

const TOTAL_STEPS = 7;

function summarise(rows: FitCheckResponseRow[]) {
  const starts = rows.length;
  const completions = rows.filter((r) => r.status === "completed");
  const inProgress = rows.filter((r) => r.status === "in_progress");

  const stepReached: Record<number, number> = {};
  for (let step = 1; step <= TOTAL_STEPS; step++) stepReached[step] = 0;
  for (const row of rows) {
    const step = Math.min(Math.max(row.current_step, 1), TOTAL_STEPS);
    stepReached[step] += 1;
  }

  const dropOffByStep: Record<number, number> = {};
  for (let step = 1; step <= TOTAL_STEPS; step++) dropOffByStep[step] = 0;
  for (const row of inProgress) {
    const step = Math.min(Math.max(row.current_step, 1), TOTAL_STEPS);
    dropOffByStep[step] += 1;
  }

  const routeDistribution = { green: 0, amber: 0, red: 0 };
  for (const row of completions) {
    if (row.route) routeDistribution[row.route] += 1;
  }

  const completionTimesSeconds = completions
    .filter((r) => r.completed_at)
    .map((r) => (new Date(r.completed_at as string).getTime() - new Date(r.created_at).getTime()) / 1000)
    .filter((seconds) => seconds >= 0);
  const avgTimeToCompleteSeconds =
    completionTimesSeconds.length > 0
      ? Math.round(
          completionTimesSeconds.reduce((sum, s) => sum + s, 0) / completionTimesSeconds.length
        )
      : null;

  return {
    generatedAt: new Date().toISOString(),
    starts,
    completions: completions.length,
    completionRate: starts > 0 ? Math.round((completions.length / starts) * 1000) / 10 : 0,
    stepReached,
    dropOffByStep,
    routeDistribution,
    avgTimeToCompleteSeconds,
    note:
      "Landing page views are not tracked here — read them from GA4. Booking completion is not tracked here either; the closest proxy is the fit_check_booking_click GA4 event fired when a visitor clicks the Calendly link.",
  };
}
