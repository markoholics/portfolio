// GA4 and Meta Pixel are already loaded sitewide (see
// src/components/analytics/GoogleAnalytics.tsx and MetaPixel.tsx), so this
// page doesn't load its own tracking scripts. This just fires a campaign
// specific event on top of the pageview those scripts already send.
//
// TODO(analytics): if you want a distinct GA4 conversion or a Meta Ads
// custom conversion for this landing page specifically, give the events
// below a dedicated name/label here rather than reusing "generate_lead".
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackCtaClick(location: string) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", "generate_lead", {
    event_category: "gtm_audit_landing",
    event_label: location,
  });
  window.fbq?.("trackCustom", "GtmAuditCtaClick", { location });
}

export function trackLeadSubmit() {
  if (typeof window === "undefined") return;
  window.gtag?.("event", "generate_lead", {
    event_category: "gtm_audit_landing",
    event_label: "reserve_form",
  });
  window.fbq?.("track", "Lead");
}
