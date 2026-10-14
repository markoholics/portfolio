// GA4 is already loaded sitewide (src/components/analytics/GoogleAnalytics.tsx),
// so this just fires Fit Check specific events on top of the pageview that
// script already sends when /fit-check (or a page embedding the flow)
// loads. The literal route word (green/amber/red) is never sent in any of
// these — see src/lib/fit-check/scoring.ts for why that distinction
// matters to this feature.
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackFitCheckStart() {
  if (typeof window === "undefined") return;
  window.gtag?.("event", "fit_check_start", { event_category: "fit_check" });
}

export function trackFitCheckStep(step: number) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", "fit_check_step", { event_category: "fit_check", step });
}

export function trackFitCheckComplete() {
  if (typeof window === "undefined") return;
  window.gtag?.("event", "fit_check_complete", { event_category: "fit_check" });
}

export function trackFitCheckBookingClick() {
  if (typeof window === "undefined") return;
  window.gtag?.("event", "fit_check_booking_click", { event_category: "fit_check" });
}
