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
      <div className="glass-panel flex items-center justify-center h-20 w-20 md:h-24 md:w-24">
        <Image
          src={partner.src}
          alt={`${partner.name} logo`}
          width={40}
          height={40}
          onError={() => setFailed(true)}
          className="h-10 w-10 md:h-12 md:w-12 object-contain opacity-80 transition-opacity duration-200 group-hover:opacity-100"
        />
      </div>
    </a>
  );
}
