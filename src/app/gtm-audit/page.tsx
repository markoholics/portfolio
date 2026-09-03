import type { Metadata } from "next";
import GtmAuditLanding from "@/components/gtm-audit/GtmAuditLanding";
import { SITE_URL } from "@/lib/seo";

const TITLE = "GTM Audit · Markoholics";
const DESCRIPTION =
  "You're paying agency-bloat prices for freelancer-speed output. Here's what an AI-native engine costs instead.";
const PATH = "/gtm-audit";

export const metadata: Metadata = {
  // { absolute } bypasses the root layout's "%s | Markoholics" title
  // template, which would otherwise double up as "GTM Audit · Markoholics |
  // Markoholics".
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  // Paid-traffic-only landing page: kept out of organic search so it
  // doesn't compete with the main site for rankings or show up out of
  // context. Flip index to true if you also want it discoverable organically.
  robots: { index: false, follow: true },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}${PATH}`,
    siteName: "Markoholics",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function GtmAuditPage() {
  return <GtmAuditLanding />;
}
