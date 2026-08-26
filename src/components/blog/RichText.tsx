import Link from "next/link";

// Parses lightweight "[label](href)" markdown-link syntax out of otherwise
// plain post copy, so body content can carry real internal/external links
// (for on-page and off-page SEO) without pulling in a markdown renderer.
function parseInline(text: string): (string | { label: string; href: string })[] {
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: (string | { label: string; href: string })[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    parts.push({ label: match[1], href: match[2] });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

export default function RichText({ text }: { text: string }) {
  const parts = parseInline(text);

  return (
    <>
      {parts.map((part, i) => {
        if (typeof part === "string") return <span key={i}>{part}</span>;

        const isInternal = part.href.startsWith("/");
        const linkClassName = "underline underline-offset-2 hover:text-white transition-colors";

        if (isInternal) {
          return (
            <Link key={i} href={part.href} className={linkClassName}>
              {part.label}
            </Link>
          );
        }

        return (
          <a
            key={i}
            href={part.href}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className={linkClassName}
          >
            {part.label}
          </a>
        );
      })}
    </>
  );
}
