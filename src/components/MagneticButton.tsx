"use client";

import { useRef, MouseEvent, ReactNode } from "react";
import Link from "next/link";

export default function MagneticButton({
  href,
  children,
  variant = "outline",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "outline" | "solid";
  className?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  const onMouseMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
  };

  const onMouseLeave = () => {
    if (ref.current) ref.current.style.transform = "translate(0, 0)";
  };

  return (
    <Link
      ref={ref}
      href={href}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      data-cursor-hover
      className={`${variant === "outline" ? "btn-outline" : "btn-solid"} ${className} transition-transform duration-200 ease-out`}
    >
      {children}
    </Link>
  );
}
