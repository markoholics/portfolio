"use client";

import { useEffect, useState } from "react";
import { trackCtaClick } from "@/components/gtm-audit/track";

export default function StickyCtaBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[80] border-t border-[#D6FE4E]/30 bg-black/95 backdrop-blur transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      aria-hidden={!visible}
    >
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <span className="hidden text-sm text-white/70 sm:block">
          14-Day Signal Sprint
        </span>
        {/*
          TODO(payment): swap href="#checkout-placeholder" for the real
          Stripe Checkout / Payment Link URL once it exists. Until then this
          anchors down to the reserve-your-spot form so the page still
          converts leads.
        */}
        <a
          href="#checkout-placeholder"
          onClick={() => trackCtaClick("sticky_bar")}
          className="flex-1 sm:flex-none inline-flex items-center justify-center rounded-full bg-[#D6FE4E] px-6 py-3 text-center text-sm font-bold uppercase tracking-wide text-black transition-transform hover:scale-[1.02]"
        >
          Get the Sprint · $499
        </a>
      </div>
    </div>
  );
}
