"use client";

import Script from "next/script";

declare global {
  interface Window {
    Calendly?: {
      initBadgeWidget: (options: {
        url: string;
        text: string;
        color: string;
        textColor: string;
        branding: boolean;
      }) => void;
    };
  }
}

export default function CalendlyBadge() {
  return (
    <>
      <link
        href="https://assets.calendly.com/assets/external/widget.css"
        rel="stylesheet"
      />
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="afterInteractive"
        onLoad={() => {
          window.Calendly?.initBadgeWidget({
            url: "https://calendly.com/markoholics/30min",
            text: "Book a Strategy Call",
            color: "#000000",
            textColor: "#ffffff",
            branding: true,
          });
        }}
      />
    </>
  );
}
