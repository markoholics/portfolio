"use client";

import { useEffect, useState } from "react";

export default function RotatePrompt() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(
      "(max-width: 820px) and (orientation: portrait)"
    );
    const update = () => setShow(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center gap-6">
      <svg
        width="56"
        height="56"
        viewBox="0 0 24 24"
        fill="none"
        className="text-white animate-[rotate-hint_2.4s_ease-in-out_infinite]"
      >
        <rect
          x="6"
          y="2"
          width="12"
          height="20"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle cx="12" cy="18.5" r="0.9" fill="currentColor" />
      </svg>
      <span className="eyebrow text-white text-center leading-relaxed">
        Please rotate
        <br />
        your phone
      </span>
    </div>
  );
}
