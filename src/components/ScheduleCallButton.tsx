"use client";

// Renders a button that opens the Calendly scheduling popup on click,
// in place of the widget auto-opening the moment a visitor lands on the
// page. The Calendly script and stylesheet load lazily (not render
// blocking) and the popup only ever appears on an explicit click.
import { useRef, useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
    };
  }
}

const CALENDLY_URL = "https://calendly.com/markoholics/30min";

export default function ScheduleCallButton({
  label = "Schedule a 1:1 Call",
  className = "btn-solid",
}: {
  label?: string;
  className?: string;
}) {
  const [scriptReady, setScriptReady] = useState(false);
  const pendingOpen = useRef(false);
  const stylesheetAdded = useRef(false);

  const addStylesheetOnce = () => {
    if (stylesheetAdded.current) return;
    stylesheetAdded.current = true;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://assets.calendly.com/assets/external/widget.css";
    document.head.appendChild(link);
  };

  const openPopup = () => {
    if (!window.Calendly) return;
    window.Calendly.initPopupWidget({ url: CALENDLY_URL });
  };

  const handleClick = () => {
    addStylesheetOnce();
    if (scriptReady && window.Calendly) {
      openPopup();
    } else {
      // The click arrived before the script finished loading; open as
      // soon as onLoad fires below instead of making the visitor click twice.
      pendingOpen.current = true;
    }
  };

  const handleScriptLoad = () => {
    setScriptReady(true);
    if (pendingOpen.current) {
      pendingOpen.current = false;
      openPopup();
    }
  };

  return (
    <>
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
        onLoad={handleScriptLoad}
      />
      <button type="button" onClick={handleClick} data-cursor-hover className={className}>
        {label}
      </button>
    </>
  );
}
