import type { Metadata } from "next";
import GtmAuditLanding from "@/components/gtm-audit/GtmAuditLanding";
import { SITE_URL } from "@/lib/seo";

const TITLE = "Free GTM Audit · Markoholics";
const DESCRIPTION =
  "Complimentary for select prospects: the 14-Day Signal Sprint, on us — no payment, no invoice.";
const PATH = "/free-gtm-audit";

export const metadata: Metadata = {
  // { absolute } bypasses the root layout's "%s | Markoholics" title
  // template, which would otherwise double up as "Free GTM Audit ·
  // Markoholics | Markoholics".
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  // This is an unlisted, select-prospect campaign page reached only via a
  // direct link, so it's kept out of organic search and isn't linked from
  // anywhere else on the site.
  robots: { index: false, follow: false },
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

export default function FreeGtmAuditPage() {
  return <GtmAuditLanding variant="free" />;
}
