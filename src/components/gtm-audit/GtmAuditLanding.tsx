"use client";

import Link from "next/link";
import Reveal from "@/components/Reveal";
import MMark from "@/components/gtm-audit/MMark";
import StickyCtaBar from "@/components/gtm-audit/StickyCtaBar";
import LeadCaptureForm from "@/components/gtm-audit/LeadCaptureForm";
import ObjectionsAccordion from "@/components/gtm-audit/ObjectionsAccordion";
import { trackCtaClick } from "@/components/gtm-audit/track";
import { PAYMENT_URL } from "@/components/gtm-audit/constants";

const LIME = "#D6FE4E";
const CYAN = "#01A6C8";

const problems = [
  {
    title: "Siloed execution",
    body: "Separate teams for ads, content and strategy, with zero cross-talk.",
  },
  {
    title: "Inflated headcount",
    body: "Paying for a ten-person team to deliver two-person output.",
  },
  {
    title: "Manual iteration",
    body: "Waiting weeks to kill a dead campaign, burning budget the whole time.",
  },
];

const stats = [
  { value: "$500K+", caption: "POC pipeline value generated" },
  { value: "3", caption: "Markets entered in parallel" },
  { value: "8.3%", caption: "Outbound to POC conversion" },
  { value: "120", caption: "Curated target accounts worked" },
];

const engineLayers = [
  {
    step: "01",
    label: "Ground Truth",
    tool: "Apify",
    body: "Harvest the operating events the market publishes, and nobody sells.",
  },
  {
    step: "02",
    label: "Resolution",
    tool: "Apollo",
    body: "Resolve the event to a named decision-maker with a verified channel.",
  },
  {
    step: "03",
    label: "Reasoning",
    tool: "Claude + n8n",
    body: "Filter, read, and decide the play before a single credit is spent.",
  },
  {
    step: "04",
    label: "Execution",
    tool: "Apollo Sequences",
    body: "Deploy across email, LinkedIn and call, referencing the real event.",
  },
  {
    step: "05",
    label: "Compounding",
    tool: "Warehouse + BI",
    body: "Write outcomes back against the originating signal, then re-weight.",
  },
];

const valueStack = [
  "Full GTM audit: funnel audit, AI readiness score, competitive positioning gap analysis",
  "A 15-page strategic report",
  "A live Compounding Signal Engine map, built for your specific category, showing three real signals you're not currently harvesting",
  "One ghostwritten founder LinkedIn post in your voice, delivered with the audit",
  "A 30-minute working session, directly with the founder, not a salesperson",
];

const objections = [
  {
    q: "What exactly are you claiming?",
    a: "Not 3x on total revenue. We commit to new ARR added per month, measured at month six against your own baseline, agreed in writing before any spend.",
  },
  {
    q: "Whose numbers are we trusting?",
    a: "Yours. Your CRM is the source of truth, not ours. Every closed-won record traces back to the signal that created it.",
  },
  {
    q: "Am I locked in?",
    a: "No. The Sprint is a one-time $499 diagnostic. If you continue into a Growth Engine build, the first month runs with no lock-in beyond a short trial window, so you can walk away before any six-month commitment.",
  },
];

const eyebrowClass =
  "font-mono text-xs font-medium uppercase tracking-[0.28em]";

function PrimaryCta({ location, label = "Get the 14-Day Signal Sprint · $499" }: { location: string; label?: string }) {
  return (
    <a
      href={PAYMENT_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackCtaClick(location)}
      className="inline-flex items-center justify-center rounded-full px-8 py-4 text-center text-sm font-bold uppercase tracking-wide text-black transition-transform hover:scale-[1.02] sm:text-base"
      style={{ backgroundColor: LIME }}
    >
      {label}
    </a>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" className="mt-1 h-4 w-4 shrink-0" aria-hidden="true">
      <path
        d="M4 10.5 8 14l8-8"
        fill="none"
        stroke={LIME}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function GtmAuditLanding() {
  return (
    <div className="bg-black text-white">
      {/*
        Analytics: GA4 and Meta Pixel already load sitewide from the root
        layout (src/components/analytics/GoogleAnalytics.tsx and
        MetaPixel.tsx), using the tracking IDs already configured there
        (env vars NEXT_PUBLIC_GA_MEASUREMENT_ID / NEXT_PUBLIC_META_PIXEL_ID).
        This page only adds campaign-specific conversion events on top of
        that, via src/components/gtm-audit/track.ts.
      */}

      {/* 1. HERO */}
      <section className="relative overflow-hidden px-4 pb-20 pt-8 sm:px-6 sm:pt-10 lg:px-16">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          {/*
            Deliberately not a link: this is a paid landing page, so the
            logo is a brand mark only, not an exit route back to the site.
          */}
          <MMark className="h-8 w-8" />
        </div>

        <div className="mx-auto mt-16 max-w-3xl sm:mt-24">
          <Reveal>
            <span className={eyebrowClass} style={{ color: CYAN }}>
              MARKOHOLICS · AI-NATIVE GTM
            </span>
            <h1 className="mt-6 font-display text-4xl leading-[1.1] sm:text-5xl md:text-6xl">
              Still manual-testing your GTM in 2026?
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/70 sm:text-xl">
              You&apos;re paying agency-bloat prices for freelancer-speed output. Here&apos;s what an
              AI-native engine costs instead.
            </p>
            <div className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <PrimaryCta location="hero" />
              <a
                href="#offer"
                className="font-mono text-sm underline underline-offset-4"
                style={{ color: CYAN }}
              >
                See what&apos;s included ↓
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 2. THE PROBLEM */}
      <section className="border-t border-white/10 px-4 py-20 sm:px-6 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <span className={eyebrowClass} style={{ color: CYAN }}>
              THE TRADITIONAL AGENCY TRAP
            </span>
            <h2 className="mt-6 max-w-2xl font-display text-3xl leading-tight sm:text-4xl md:text-5xl">
              The $10,000-a-month retainer. The two-person output.
            </h2>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {problems.map((problem, i) => (
              <Reveal key={problem.title} delay={i * 0.08}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                  <h3 className="font-display text-lg text-white">{problem.title}</h3>
                  <p className="mt-3 text-white/60">{problem.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <p className="mt-10 max-w-2xl font-display text-xl text-white/90 sm:text-2xl">
              Features don&apos;t sell themselves. And a bloated agency doesn&apos;t scale them.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 3. THE RESULT FIRST */}
      <section className="border-t border-white/10 px-4 py-20 sm:px-6 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <span className={eyebrowClass} style={{ color: CYAN }}>
              PROOF, NOT PROMISES
            </span>
            <h2 className="mt-6 max-w-2xl font-display text-3xl leading-tight sm:text-4xl md:text-5xl">
              Six months. No sales team. A pipeline that opened enterprise doors.
            </h2>
          </Reveal>

          <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-4">
            {stats.map((stat, i) => (
              <Reveal key={stat.caption} delay={i * 0.08}>
                <div>
                  <div
                    className="font-display text-4xl font-bold sm:text-5xl"
                    style={{ color: LIME }}
                  >
                    {stat.value}
                  </div>
                  <p className="mt-2 text-sm text-white/60">{stat.caption}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <p className="mt-10 max-w-2xl text-sm text-white/50">
              ByoSync, an AI security engineering and compliance platform. Every figure is a
              client-reported outcome from the engagement window. Nothing here is a projection.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 4. THE ENGINE */}
      <section className="border-t border-white/10 px-4 py-20 sm:px-6 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <span className={eyebrowClass} style={{ color: CYAN }}>
              THE COMPOUNDING SIGNAL ENGINE
            </span>
            <h2 className="mt-6 max-w-2xl font-display text-3xl leading-tight sm:text-4xl md:text-5xl">
              Five layers. One loop.
            </h2>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-5 sm:gap-4">
            {engineLayers.map((layer, i) => (
              <Reveal key={layer.label} delay={i * 0.06}>
                <div className="h-full border-t-2 pt-4" style={{ borderColor: CYAN }}>
                  <span className="font-mono text-xs text-white/40">{layer.step}</span>
                  <h3 className="mt-2 font-display text-base text-white">{layer.label}</h3>
                  <span className="font-mono text-xs" style={{ color: CYAN }}>
                    {layer.tool}
                  </span>
                  <p className="mt-2 text-sm text-white/60">{layer.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <p className="mt-10 max-w-2xl font-mono text-sm" style={{ color: CYAN }}>
              This is why we call it compounding rather than automated. Automation repeats a
              decision. Compounding improves it.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 5. THE OFFER */}
      <section id="offer" className="border-t border-white/10 px-4 py-20 sm:px-6 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <span className={eyebrowClass} style={{ color: CYAN }}>
              THE 14-DAY SIGNAL SPRINT
            </span>
            <h2 className="mt-6 max-w-2xl font-display text-3xl leading-tight sm:text-4xl md:text-5xl">
              $499. Everything stacked in. Nothing held back.
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <ul className="mt-10 flex max-w-2xl flex-col gap-4">
              {valueStack.map((item) => (
                <li key={item} className="flex gap-3 text-white/85">
                  <CheckIcon />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.15}>
            <div
              className="mt-10 max-w-2xl rounded-2xl border p-6"
              style={{ borderColor: CYAN }}
            >
              <p className="font-display text-lg text-white sm:text-xl">
                The guarantee: if this audit doesn&apos;t surface at least three specific,
                actionable revenue leaks, it&apos;s free. No conditions.
              </p>
            </div>
            <p className="mt-4 max-w-2xl text-sm text-white/50">
              If you move forward with a Growth Engine build within 14 days, the $499 is credited
              in full against your first month.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-10">
              <PrimaryCta location="offer" />
            </div>
          </Reveal>

          {/*
            Fallback lead capture: a secondary path for anyone who wants to
            reserve a slot without paying online right now (e.g. needs an
            invoice, or wants a question answered first). See
            LeadCaptureForm.tsx for the POST endpoint.
          */}
          <Reveal delay={0.25}>
            <div
              id="reserve"
              className="mt-16 max-w-2xl scroll-mt-24 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8"
            >
              <h3 className="font-display text-xl text-white">
                Prefer not to pay online right now?
              </h3>
              <p className="mt-2 text-white/60">
                Reserve your Signal Sprint slot here and we&apos;ll follow up directly to sort
                payment.
              </p>
              <div className="mt-6">
                <LeadCaptureForm />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 6. OBJECTIONS */}
      <section className="border-t border-white/10 px-4 py-20 sm:px-6 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <span className={eyebrowClass} style={{ color: CYAN }}>
              BEFORE YOU ASK
            </span>
            <h2 className="mt-6 max-w-2xl font-display text-3xl leading-tight sm:text-4xl md:text-5xl">
              Straight answers to the obvious questions.
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-10 max-w-2xl">
              <ObjectionsAccordion items={objections} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* 7. FINAL CTA */}
      <section className="border-t border-white/10 px-4 py-20 pb-32 sm:px-6 lg:px-16">
        <div className="mx-auto max-w-5xl text-center">
          <Reveal>
            <span className={eyebrowClass} style={{ color: CYAN }}>
              BUILT FOR COMPANIES THAT INTEND TO WIN THEIR CATEGORY
            </span>
            <h2 className="mx-auto mt-6 max-w-2xl font-display text-3xl leading-tight sm:text-4xl md:text-5xl">
              Start with the Sprint. It pays for itself before the real engagement begins.
            </h2>
            <div className="mt-10 flex flex-col items-center gap-5">
              <PrimaryCta location="final" />
              <Link
                href="/contact"
                className="font-mono text-sm underline underline-offset-4"
                style={{ color: CYAN }}
              >
                Or book a GTM strategy call first → markoholics.com/contact
              </Link>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <p className="mx-auto mt-24 max-w-5xl text-center text-sm text-white/40">
            Mohammad Rahman · Founder and Director, Markoholics ·{" "}
            <a href="mailto:markoholics@outlook.com" className="underline underline-offset-2">
              markoholics@outlook.com
            </a>{" "}
            · markoholics.com
          </p>
        </Reveal>
      </section>

      <StickyCtaBar />
    </div>
  );
}
