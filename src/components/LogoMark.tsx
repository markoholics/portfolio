"use client";

export default function LogoMark({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const letters = text.split("");

  return (
    <span className={`group inline-flex overflow-hidden ${className}`}>
      {letters.map((letter, i) => (
        <span
          key={`${letter}-${i}`}
          className="relative inline-block h-[1.1em] overflow-hidden"
          style={{ transitionDelay: `${i * 18}ms` }}
        >
          <span
            className="block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full"
            style={{ transitionDelay: `${i * 18}ms` }}
          >
            {letter === " " ? " " : letter}
          </span>
          <span
            className="absolute left-0 top-full block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full"
            style={{ transitionDelay: `${i * 18}ms` }}
            aria-hidden="true"
          >
            {letter === " " ? " " : letter}
          </span>
        </span>
      ))}
    </span>
  );
}
