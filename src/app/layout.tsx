import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import ScrollProgress from "@/components/ScrollProgress";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "Markoholics — Growth Engines for Ambitious Technology Companies",
    template: "%s — Markoholics",
  },
  description:
    "Markoholics builds go-to-market and full-funnel growth engines for high-growth technology companies — GTM strategy, content, social, performance, and demand generation under one roof.",
  metadataBase: new URL("https://markoholics.com"),
  openGraph: {
    title: "Markoholics — Growth Engines for Ambitious Technology Companies",
    description:
      "Go-to-market and full-funnel marketing strategy for technology companies that need to scale fast without losing brand equity.",
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
        <ScrollProgress />
        <CustomCursor />
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
