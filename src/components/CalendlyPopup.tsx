"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
    };
  }
}

const CALENDLY_URL = "https://calendly.com/markoholics/30min";

export default function CalendlyPopup() {
  const opened = useRef(false);

  const openPopup = () => {
    if (opened.current || !window.Calendly) return;
    opened.current = true;
    window.Calendly.initPopupWidget({ url: CALENDLY_URL });
  };

  useEffect(() => {
    if (window.Calendly) {
      openPopup();
    }
  }, []);

  return (
    <>
      <link
        href="https://assets.calendly.com/assets/external/widget.css"
        rel="stylesheet"
      />
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="afterInteractive"
        onLoad={openPopup}
      />
    </>
  );
}
