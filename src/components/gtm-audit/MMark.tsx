// Placeholder geometric "M" mark for the /gtm-audit hero.
// TODO: replace this inline SVG with the real Markoholics logo file
// (e.g. import from /public/logo.svg) once one is supplied.
export default function MMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      role="img"
      aria-label="Markoholics"
    >
      <path
        d="M4 34V6h6l10 14L30 6h6v28h-6V16l-10 14L10 16v18H4z"
        fill="#D6FE4E"
      />
    </svg>
  );
}
