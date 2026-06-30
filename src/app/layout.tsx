import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import ScrollProgress from "@/components/ScrollProgress";
import RotatePrompt from "@/components/RotatePrompt";

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
    default: "Markoholics: Growth Engines for Tech Founders",
    template: "%s | Markoholics",
  },
  description:
    "Markoholics builds go-to-market and full-funnel growth engines for tech founders launching and scaling technology products. GTM strategy, content, social, performance, demand generation, and AI transformation under one roof.",
  metadataBase: new URL("https://markoholics.com"),
  openGraph: {
    title: "Markoholics: Growth Engines for Tech Founders",
    description:
      "Go-to-market and full-funnel marketing strategy for tech founders who need to launch and scale fast without losing brand equity.",
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
        <RotatePrompt />
        <CustomCursor />
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
