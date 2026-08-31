import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import DeferredEffects from "@/components/DeferredEffects";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import MetaPixel from "@/components/analytics/MetaPixel";
import { SITE_URL, organizationJsonLd } from "@/lib/seo";

// Only weights actually referenced in the codebase (font-medium / .eyebrow)
// are loaded — every other weight is a font file request nobody uses.
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "Markoholics: AI-Native GTM Partner for Tech Founders",
    template: "%s | Markoholics",
  },
  description: "Markoholics is an AI-native GTM agency for Series A-C SaaS, fintech, and AI startups — running strategy, content, and demand generation as one autonomous system.",
  metadataBase: new URL(SITE_URL),
  authors: [{ name: "The Markoholics Team", url: `${SITE_URL}/about` }],
  creator: "Markoholics",
  publisher: "Markoholics",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Markoholics: AI-Native GTM Partner for Tech Founders",
    description: "Markoholics is an AI-native GTM agency for Series A-C SaaS, fintech, and AI startups — running strategy, content, and demand generation as one autonomous system.",
    url: SITE_URL,
    siteName: "Markoholics",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
        <GoogleAnalytics />
        <MetaPixel />
        <DeferredEffects />
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
