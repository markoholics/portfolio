import Link from "next/link";
import { navLinks, CONTACT_EMAIL } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="border-t hairline bg-black">
      <div className="container-edge py-20">
        <div className="grid-12">
          <div className="col-span-12 lg:col-span-5">
            <span className="font-display text-2xl text-white block mb-4">
              MARKOHOLICS
            </span>
            <p className="text-grey max-w-xs">
              Go-to-market and growth engines for technology companies that
              scale fast without losing brand equity.
            </p>
          </div>

          <div className="col-span-6 lg:col-span-3 lg:col-start-7 mt-10 lg:mt-0">
            <span className="eyebrow block mb-5">Navigate</span>
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  data-cursor-hover
                  className="text-mist hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="col-span-6 lg:col-span-3 mt-10 lg:mt-0">
            <span className="eyebrow block mb-5">Connect</span>
            <div className="flex flex-col gap-3">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                data-cursor-hover
                className="text-mist hover:text-white transition-colors"
              >
                {CONTACT_EMAIL}
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                data-cursor-hover
                className="text-mist hover:text-white transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                data-cursor-hover
                className="text-mist hover:text-white transition-colors"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t hairline flex flex-col md:flex-row justify-between gap-4 text-sm text-grey">
          <span>&copy; {new Date().getFullYear()} Markoholics. All rights reserved.</span>
          <span>Built for companies that intend to win their category.</span>
        </div>
      </div>
    </footer>
  );
}
