"use client";

import { useState } from "react";
import Image from "next/image";
import type { PartnerStackLogo } from "@/lib/data";

// Renders nothing if the logo file 404s, so a partner added to the data
// list before its actual asset is uploaded never shows a broken-image icon
// on the live site.
export default function PartnerLogo({ partner }: { partner: PartnerStackLogo }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;

  return (
    <a
      href={partner.href}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor-hover
      className="group block"
      aria-label={partner.name}
    >
      <div className="glass-panel flex items-center justify-center h-24 md:h-28 w-40 md:w-48 px-8">
        <Image
          src={partner.src}
          alt={`${partner.name} logo`}
          width={160}
          height={48}
          onError={() => setFailed(true)}
          className="h-8 md:h-10 w-auto object-contain opacity-70 grayscale transition-all duration-200 group-hover:opacity-100 group-hover:grayscale-0"
        />
      </div>
    </a>
  );
}
