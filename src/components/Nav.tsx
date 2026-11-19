"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { navLinks } from "@/lib/data";
import LogoMark from "@/components/LogoMark";

// Paid-campaign landing pages render their own hero/logo and deliberately
// give visitors no exit route back into the rest of the site.
const NAV_FREE_ROUTES = ["/gtm-audit", "/free-gtm-audit"];

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setOpen(false);

  if (NAV_FREE_ROUTES.includes(pathname)) return null;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[900] transition-all duration-300 ${
        scrolled ? "glass-panel" : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="container-edge flex items-center justify-between gap-4 h-20">
        <Link
          href="/"
          data-cursor-hover
          className="shrink-0 font-display text-lg tracking-tight text-white"
        >
          <LogoMark text="MARKOHOLICS" />
        </Link>

        <nav className="hidden lg:flex items-center gap-[14px] xl:gap-6 2xl:gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              data-cursor-hover
              className="eyebrow whitespace-nowrap text-grey hover:text-white transition-colors duration-200 text-[0.6rem] tracking-[0.12em] xl:text-[0.65rem] xl:tracking-[0.2em] 2xl:text-[0.7rem] 2xl:tracking-[0.28em]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/contact"
          data-cursor-hover
          className="hidden lg:inline-flex shrink-0 btn-outline whitespace-nowrap px-3 py-2 text-[0.6rem] tracking-[0.06em] xl:px-5 xl:py-3 xl:text-[0.7rem] xl:tracking-[0.14em] 2xl:px-7 2xl:py-[14px] 2xl:text-[0.8rem] 2xl:tracking-[0.18em]"
        >
          <span className="xl:hidden">Book a Call</span>
          <span className="hidden xl:inline">Book a Strategy Call</span>
        </Link>

        <button
          onClick={() => setOpen(true)}
          className="lg:hidden flex flex-col gap-1.5 w-8"
          aria-label="Open menu"
        >
          <span className="h-px w-full bg-white" />
          <span className="h-px w-full bg-white" />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black z-[950] flex flex-col"
          >
            <div className="container-edge flex items-center justify-between h-20">
              <span className="font-display text-lg text-white">MARKOHOLICS</span>
              <button onClick={() => setOpen(false)} aria-label="Close menu" className="text-white text-2xl">
                &times;
              </button>
            </div>
            <div className="flex-1 flex flex-col justify-center container-edge gap-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * i, duration: 0.5 }}
                >
                  <Link
                    href={link.href}
                    onClick={closeMenu}
                    className="font-display text-5xl text-white block"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * navLinks.length, duration: 0.5 }}
              >
                <Link href="/contact" onClick={closeMenu} className="btn-solid inline-flex mt-4">
                  Start a Project
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
