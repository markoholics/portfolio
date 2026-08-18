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

  useEffect(() => {
    // Loaded imperatively (not as a JSX <link>) so it never lands in the
    // server-rendered <head> as a render-blocking stylesheet request.
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://assets.calendly.com/assets/external/widget.css";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <Script
      src="https://assets.calendly.com/assets/external/widget.js"
      strategy="afterInteractive"
      onLoad={openPopup}
    />
  );
}
