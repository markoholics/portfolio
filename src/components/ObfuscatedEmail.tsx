"use client";

import { useEffect, useState } from "react";

/**
 * Renders a mailto link built from parts at runtime instead of a literal
 * "user@domain" string in the server-rendered HTML, so scrapers harvesting
 * plain-text addresses from page source don't pick it up. Real visitors and
 * screen readers still get a normal, working mailto link once the page
 * hydrates.
 */
export default function ObfuscatedEmail({
  user,
  domain,
  className,
  "data-cursor-hover": cursorHover = true,
}: {
  user: string;
  domain: string;
  className?: string;
  "data-cursor-hover"?: boolean;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Intentional client-only reveal: the whole point is that the real
    // address never appears in the server-rendered HTML a scraper reads.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <span className={className} aria-label={`Email: ${user} at ${domain}`}>
        {user} [at] {domain}
      </span>
    );
  }

  const address = `${user}@${domain}`;

  return (
    <a href={`mailto:${address}`} className={className} data-cursor-hover={cursorHover}>
      {address}
    </a>
  );
}
