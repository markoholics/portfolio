import Link from "next/link";

export default function Byline({
  label = "Written by",
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <p className={`text-grey/50 text-xs uppercase tracking-[0.14em] ${className}`}>
      {label}{" "}
      <Link
        href="/about"
        data-cursor-hover
        className="text-grey hover:text-white transition-colors underline underline-offset-4"
      >
        The Markoholics Team
      </Link>
    </p>
  );
}
