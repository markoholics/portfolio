"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import ProgressBar from "@/components/fit-check/ProgressBar";
import OptionCard from "@/components/fit-check/OptionCard";
import {
  PROGRESS_COPY,
  CONSENT_COPY,
  QUESTIONS_COPY,
  DECISION_SCREEN_COPY,
  CONTACT_SCREEN_COPY,
  GREEN_SCREEN_COPY,
  AMBER_SCREEN_COPY,
  RED_SCREEN_COPY,
} from "@/lib/fit-check/copy";
import { AMBER_BOOKING_URL, GREEN_BOOKING_URL, type FitCheckAnswers } from "@/lib/fit-check/config";
import {
  trackFitCheckBookingClick,
  trackFitCheckComplete,
  trackFitCheckStart,
  trackFitCheckStep,
} from "@/components/fit-check/track";

type Route = "green" | "amber" | "red";

const TOTAL_STEPS = 7;

function createSessionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `fc_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

function readUtmParams(): Record<string, string | null> {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source"),
    utm_medium: params.get("utm_medium"),
    utm_campaign: params.get("utm_campaign"),
    utm_term: params.get("utm_term"),
    utm_content: params.get("utm_content"),
  };
}

function postJson(body: Record<string, unknown>) {
  // Fire and forget — partial-progress and analytics calls never block the
  // visitor's interaction, and a failure here is logged server side only.
  fetch("/api/fit-check", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).catch(() => {});
}

export default function FitCheckFlow() {
  const reduceMotion = useReducedMotion();
  // Lazy initializers run once at mount and are never rendered directly,
  // so there is nothing for server and client markup to disagree on — no
  // effect, and no hydration mismatch, needed to set these up.
  const [sessionId] = useState<string>(() => (typeof window === "undefined" ? "" : createSessionId()));
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Partial<FitCheckAnswers>>({});
  const [consentChecked, setConsentChecked] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const [oneOffNote, setOneOffNote] = useState("");
  const [redNoteSent, setRedNoteSent] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [route, setRoute] = useState<Route | null>(null);

  const startedTracking = useRef(false);
  // Same reasoning as sessionId above: read once at mount, never rendered,
  // so a plain memoised value is enough — no effect required.
  const utm = useMemo(() => readUtmParams(), []);

  const saveProgress = (nextAnswers: Partial<FitCheckAnswers>, nextStep: number) => {
    if (!sessionId) return;
    postJson({
      sessionId,
      event: "progress",
      currentStep: nextStep,
      answers: nextAnswers,
      utm,
    });
  };

  const goToStep = (next: number) => {
    setStep(next);
    trackFitCheckStep(next);
  };

  const markStarted = () => {
    if (startedTracking.current) return;
    startedTracking.current = true;
    trackFitCheckStart();
  };

  const selectSingle = <K extends keyof FitCheckAnswers>(
    key: K,
    value: FitCheckAnswers[K],
    nextStep: number
  ) => {
    markStarted();
    const nextAnswers = { ...answers, [key]: value };
    setAnswers(nextAnswers);
    saveProgress(nextAnswers, step);
    window.setTimeout(() => goToStep(nextStep), reduceMotion ? 0 : 220);
  };

  const selectDecisionTap = (field: "decisionSpeed" | "founderTime", value: string) => {
    markStarted();
    const nextAnswers = { ...answers, [field]: value } as Partial<FitCheckAnswers>;
    setAnswers(nextAnswers);
    saveProgress(nextAnswers, step);
    if (nextAnswers.decisionSpeed && nextAnswers.founderTime) {
      window.setTimeout(() => goToStep(6), reduceMotion ? 0 : 220);
    }
  };

  const goBack = () => setStep((s) => Math.max(1, s - 1));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (!name.trim() || !email.trim() || !companyWebsite.trim() || !linkedinUrl.trim()) {
      setSubmitError("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/fit-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          event: "submit",
          answers,
          contact: {
            name: name.trim(),
            email: email.trim(),
            companyWebsite: companyWebsite.trim(),
            linkedinUrl: linkedinUrl.trim(),
            notes: notes.trim(),
          },
          utm,
          company_size_hint: honeypot,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Something went wrong. Please try again.");

      setRoute(data.route as Route);
      trackFitCheckComplete();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const submitRedNote = () => {
    if (!oneOffNote.trim() || redNoteSent || !sessionId) return;
    postJson({
      sessionId,
      event: "red_note",
      oneOffNote: oneOffNote.trim(),
      name,
      email,
    });
    setRedNoteSent(true);
  };

  const onBookingClick = () => trackFitCheckBookingClick();

  if (route) {
    return <ResultScreen route={route} oneOffNote={oneOffNote} setOneOffNote={setOneOffNote} redNoteSent={redNoteSent} submitRedNote={submitRedNote} onBookingClick={onBookingClick} />;
  }

  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <ProgressBar current={step} total={TOTAL_STEPS} />
      <p className="eyebrow mt-6 mb-10">{PROGRESS_COPY.stepLabel(step, TOTAL_STEPS)}</p>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
          transition={transition}
        >
          {step === 1 && (
            <QuestionScreen
              copy={QUESTIONS_COPY.stage}
              selected={answers.stage}
              disabled={!consentChecked}
              onSelect={(value) => selectSingle("stage", value as FitCheckAnswers["stage"], 2)}
              before={
                <div className="mb-10 border hairline p-6 glass-panel">
                  <span className="eyebrow block mb-3">{CONSENT_COPY.heading}</span>
                  <p className="text-grey text-sm mb-3">{CONSENT_COPY.body}</p>
                  <p className="text-grey text-sm mb-4">
                    {CONSENT_COPY.withdraw}{" "}
                    <a href={CONSENT_COPY.privacyHref} className="underline hover:text-white">
                      {CONSENT_COPY.privacyLinkLabel}
                    </a>
                    .
                  </p>
                  <label className="flex items-start gap-3 text-sm text-mist cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consentChecked}
                      onChange={(e) => setConsentChecked(e.target.checked)}
                      className="mt-1 h-4 w-4 shrink-0 accent-white outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                    />
                    {CONSENT_COPY.consentCheckboxLabel}
                  </label>
                </div>
              }
            />
          )}

          {step === 2 && (
            <QuestionScreen
              copy={QUESTIONS_COPY.investment}
              selected={answers.investment}
              onSelect={(value) => selectSingle("investment", value as FitCheckAnswers["investment"], 3)}
              onBack={goBack}
            />
          )}

          {step === 3 && (
            <QuestionScreen
              copy={QUESTIONS_COPY.audience}
              selected={answers.audience}
              onSelect={(value) => selectSingle("audience", value as FitCheckAnswers["audience"], 4)}
              onBack={goBack}
            />
          )}

          {step === 4 && (
            <QuestionScreen
              copy={QUESTIONS_COPY.goal}
              selected={answers.goal}
              onSelect={(value) => selectSingle("goal", value as FitCheckAnswers["goal"], 5)}
              onBack={goBack}
            />
          )}

          {step === 5 && (
            <div>
              <h2 className="font-display text-2xl md:text-3xl text-white mb-3">
                {DECISION_SCREEN_COPY.heading}
              </h2>
              <p className="text-grey text-sm mb-8">{DECISION_SCREEN_COPY.whyWeAsk}</p>

              <span className="eyebrow block mb-3">{DECISION_SCREEN_COPY.signOff.label}</span>
              <div className="grid gap-3 mb-8">
                {DECISION_SCREEN_COPY.signOff.options.map((opt) => (
                  <OptionCard
                    key={opt.value}
                    label={opt.label}
                    selected={answers.decisionSpeed === opt.value}
                    onSelect={() => selectDecisionTap("decisionSpeed", opt.value)}
                  />
                ))}
              </div>

              <span className="eyebrow block mb-3">{DECISION_SCREEN_COPY.founderTime.label}</span>
              <div className="grid gap-3 mb-8">
                {DECISION_SCREEN_COPY.founderTime.options.map((opt) => (
                  <OptionCard
                    key={opt.value}
                    label={opt.label}
                    selected={answers.founderTime === opt.value}
                    onSelect={() => selectDecisionTap("founderTime", opt.value)}
                  />
                ))}
              </div>

              <BackButton onClick={goBack} />
            </div>
          )}

          {step === 6 && (
            <QuestionScreen
              copy={QUESTIONS_COPY.workStyle}
              selected={answers.workStyle}
              onSelect={(value) => selectSingle("workStyle", value as FitCheckAnswers["workStyle"], 7)}
              onBack={goBack}
            />
          )}

          {step === 7 && (
            <form onSubmit={handleSubmit}>
              <h2 className="font-display text-2xl md:text-3xl text-white mb-3">
                {CONTACT_SCREEN_COPY.heading}
              </h2>
              <p className="text-grey text-sm mb-8">{CONTACT_SCREEN_COPY.whyWeAsk}</p>

              <div className="space-y-6 mb-8">
                <label className="block">
                  <span className="eyebrow block mb-3">{CONTACT_SCREEN_COPY.fields.name.label}</span>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={CONTACT_SCREEN_COPY.fields.name.placeholder}
                    className="w-full bg-transparent border-b hairline py-3 text-white outline-none focus-visible:border-white transition-colors"
                  />
                </label>
                <label className="block">
                  <span className="eyebrow block mb-3">{CONTACT_SCREEN_COPY.fields.email.label}</span>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={CONTACT_SCREEN_COPY.fields.email.placeholder}
                    className="w-full bg-transparent border-b hairline py-3 text-white outline-none focus-visible:border-white transition-colors"
                  />
                </label>
                <label className="block">
                  <span className="eyebrow block mb-3">{CONTACT_SCREEN_COPY.fields.website.label}</span>
                  <input
                    required
                    type="text"
                    value={companyWebsite}
                    onChange={(e) => setCompanyWebsite(e.target.value)}
                    placeholder={CONTACT_SCREEN_COPY.fields.website.placeholder}
                    className="w-full bg-transparent border-b hairline py-3 text-white outline-none focus-visible:border-white transition-colors"
                  />
                </label>
                <label className="block">
                  <span className="eyebrow block mb-3">{CONTACT_SCREEN_COPY.fields.linkedin.label}</span>
                  <input
                    required
                    type="text"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder={CONTACT_SCREEN_COPY.fields.linkedin.placeholder}
                    className="w-full bg-transparent border-b hairline py-3 text-white outline-none focus-visible:border-white transition-colors"
                  />
                </label>
                <label className="block">
                  <span className="eyebrow block mb-3">{CONTACT_SCREEN_COPY.fields.notes.label}</span>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={CONTACT_SCREEN_COPY.fields.notes.placeholder}
                    rows={3}
                    className="w-full bg-transparent border-b hairline py-3 text-white outline-none focus-visible:border-white transition-colors resize-none"
                  />
                </label>

                {/* Honeypot: visually hidden from sighted users and not a
                    type="hidden" input (some bots skip those), kept out of
                    the tab order and screen reader tree. A real visitor
                    never interacts with this. */}
                <div aria-hidden="true" className="absolute left-[-9999px] w-px h-px overflow-hidden">
                  <label>
                    Leave this field blank
                    <input
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                    />
                  </label>
                </div>
              </div>

              {submitError && <p className="text-grey text-sm mb-6">{submitError}</p>}

              <div className="flex items-center gap-4">
                <BackButton onClick={goBack} />
                <button
                  type="submit"
                  data-cursor-hover
                  disabled={submitting}
                  className="btn-solid disabled:opacity-50"
                >
                  {submitting ? PROGRESS_COPY.submitting : PROGRESS_COPY.submitButton}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-cursor-hover
      className="text-grey text-sm uppercase tracking-[0.18em] outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black px-2 py-1"
    >
      {PROGRESS_COPY.backButton}
    </button>
  );
}

function QuestionScreen({
  copy,
  selected,
  disabled,
  onSelect,
  onBack,
  before,
}: {
  copy: { heading: string; whyWeAsk: string; options: { value: string; label: string }[] };
  selected?: string;
  disabled?: boolean;
  onSelect: (value: string) => void;
  onBack?: () => void;
  before?: React.ReactNode;
}) {
  return (
    <div>
      {before}
      <h2 className="font-display text-2xl md:text-3xl text-white mb-3">{copy.heading}</h2>
      <p className="text-grey text-sm mb-8">{copy.whyWeAsk}</p>
      <div className="grid gap-3 mb-8">
        {copy.options.map((opt) => (
          <OptionCard
            key={opt.value}
            label={opt.label}
            selected={selected === opt.value}
            onSelect={() => !disabled && onSelect(opt.value)}
          />
        ))}
      </div>
      {disabled && (
        <p className="text-grey text-xs mb-6">Tick the box above to continue.</p>
      )}
      {onBack && <BackButton onClick={onBack} />}
    </div>
  );
}

function ResultScreen({
  route,
  oneOffNote,
  setOneOffNote,
  redNoteSent,
  submitRedNote,
  onBookingClick,
}: {
  route: Route;
  oneOffNote: string;
  setOneOffNote: (value: string) => void;
  redNoteSent: boolean;
  submitRedNote: () => void;
  onBookingClick: () => void;
}) {
  if (route === "green") {
    return (
      <div className="w-full max-w-2xl mx-auto border hairline p-8 md:p-10 glass-panel">
        <span className="eyebrow block mb-4">Fit Check</span>
        <h2 className="font-display text-3xl md:text-4xl text-white mb-4">{GREEN_SCREEN_COPY.heading}</h2>
        <p className="text-grey mb-3">{GREEN_SCREEN_COPY.body}</p>
        <p className="text-grey text-sm mb-8">{GREEN_SCREEN_COPY.footnote}</p>
        <a
          href={GREEN_BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor-hover
          onClick={onBookingClick}
          className="btn-solid"
        >
          {GREEN_SCREEN_COPY.bookingButton}
        </a>
      </div>
    );
  }

  if (route === "amber") {
    return (
      <div className="w-full max-w-2xl mx-auto border hairline p-8 md:p-10 glass-panel">
        <span className="eyebrow block mb-4">Fit Check</span>
        <h2 className="font-display text-3xl md:text-4xl text-white mb-4">{AMBER_SCREEN_COPY.heading}</h2>
        <p className="text-grey mb-3">{AMBER_SCREEN_COPY.body}</p>
        <p className="text-grey text-sm mb-3">{AMBER_SCREEN_COPY.sprintCredit}</p>
        <p className="text-grey text-sm mb-8">{AMBER_SCREEN_COPY.callPrompt}</p>
        <a
          href={AMBER_BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor-hover
          onClick={onBookingClick}
          className="btn-solid"
        >
          {AMBER_SCREEN_COPY.bookingButton}
        </a>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto border hairline p-8 md:p-10 glass-panel">
      <span className="eyebrow block mb-4">Fit Check</span>
      <h2 className="font-display text-3xl md:text-4xl text-white mb-4">{RED_SCREEN_COPY.heading}</h2>
      <p className="text-grey mb-3">{RED_SCREEN_COPY.body}</p>
      <p className="text-grey mb-8">{RED_SCREEN_COPY.reassurance}</p>

      <p className="text-grey text-sm mb-3">{RED_SCREEN_COPY.resourceIntro}</p>
      <a
        href={RED_SCREEN_COPY.resourceHref}
        data-cursor-hover
        className="font-display text-xl text-white underline hover:text-grey transition-colors block mb-10"
      >
        {RED_SCREEN_COPY.resourceLabel}
      </a>

      {!redNoteSent ? (
        <div className="mb-6">
          <label className="block mb-3">
            <span className="eyebrow block mb-3">{RED_SCREEN_COPY.oneOffLabel}</span>
            <textarea
              value={oneOffNote}
              onChange={(e) => setOneOffNote(e.target.value)}
              placeholder={RED_SCREEN_COPY.oneOffPlaceholder}
              rows={2}
              className="w-full bg-transparent border-b hairline py-3 text-white outline-none focus-visible:border-white transition-colors resize-none"
            />
          </label>
          <button
            type="button"
            onClick={submitRedNote}
            data-cursor-hover
            disabled={!oneOffNote.trim()}
            className="btn-outline disabled:opacity-50"
          >
            Send
          </button>
        </div>
      ) : (
        <p className="text-grey text-sm mb-6">Thanks, we will take a look.</p>
      )}

      <p className="text-grey text-sm">{RED_SCREEN_COPY.returnLine}</p>
    </div>
  );
}
