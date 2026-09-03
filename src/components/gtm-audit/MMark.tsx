// The real Markoholics "M" mark, same shape as src/app/icon.svg (the site
// favicon), rendered here in white with no background rect since the hero
// section is already pure black.
export default function MMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role="img"
      aria-label="Markoholics"
    >
      <polygon points="16,28 50,50 84,28 76,36 50,58 24,36" fill="#ffffff" />
      <polygon points="24,42 40,42 32,78 16,78" fill="#ffffff" />
      <polygon points="60,42 76,42 84,78 68,78" fill="#ffffff" />
      <polygon points="42,44 50,52 58,44 58,64 50,72 42,64" fill="#ffffff" />
    </svg>
  );
}
