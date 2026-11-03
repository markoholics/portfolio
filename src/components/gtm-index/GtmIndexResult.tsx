"use client";

import { FormEvent, useState } from "react";
import { BAND_DESCRIPTIONS, INSUFFICIENT_DATA_COPY, RESULT_COPY } from "@/content/gtmIndex";
import type { GtmIndexPublicResult } from "@/lib/gtmIndex/types";

const inputClass =
  "w-full bg-transparent border-b hairline py-3 text-white outline-none focus:border-white focus-visible:border-white transition-colors";
const labelClass = "eyebrow block mb-3";

function confidenceColor(confidence: "High" | "Medium" | "Low"): string {
  if (confidence === "High") return "var(--color-accent)";
  if (confidence === "Medium") return "#d9d9d9";
  return "#8f969e";
}

export default function GtmIndexResult({
  result,
  onRunAnother,
}: {
  result: GtmIndexPublicResult;
  onRunAnother: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [deliverError, setDeliverError] = useState("");

  if (result.status === "insufficient_data" || !result.index || !result.summary) {
    return (
      <div className="border hairline p-8 md:p-12 text-center">
        <p className="text-white text-xl font-display mb-3">{INSUFFICIENT_DATA_COPY.heading}</p>
        <p className="text-grey max-w-md mx-auto mb-8">
          {result.message || "We couldn't gather enough public information to score this company."}
        </p>
        <button type="button" onClick={onRunAnother} className="btn-outline" data-cursor-hover>
          {INSUFFICIENT_DATA_COPY.tryAgainLabel}
        </button>
      </div>
    );
  }

  const { index, summary } = result;

  const handleDeliver = async (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !consent || sending) return;
    setSending(true);
    setDeliverError("");
    try {
      const response = await fetch("/api/gtm-index/deliver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId: result.reportId, name: name.trim(), email: email.trim(), consent }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setDeliverError(data?.error || "Something went wrong. Please try again.");
        setSending(false);
        return;
      }
      setSent(true);
      setSending(false);
    } catch {
      setDeliverError("Something went wrong. Please try again.");
      setSending(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="border hairline p-8 md:p-12 text-center">
        <span className="eyebrow block mb-4">{RESULT_COPY.scoreLabel}</span>
        <p className="font-display text-white text-6xl md:text-7xl leading-none">{index.score}</p>
        <p className="text-grey/70 text-sm mb-6">out of 100</p>
        <p className="text-white text-lg font-display mb-2">{index.band}</p>
        <p className="text-grey max-w-md mx-auto">{BAND_DESCRIPTIONS[index.band]}</p>
        <p className="mt-6 text-sm" style={{ color: "var(--color-accent)" }}>
          {RESULT_COPY.patternLabel}: {index.primary_failure_pattern}
        </p>
        {index.provisional && <p className="text-grey/60 text-xs mt-3">{RESULT_COPY.provisionalNote}</p>}
      </div>

      <div className="border hairline p-8 md:p-12">
        <span className={labelClass}>{RESULT_COPY.twoSentenceHeading}</span>
        <p className="text-white text-lg leading-relaxed mb-3">
          &ldquo;{summary.two_sentence_test.what_a_stranger_would_say}&rdquo;
        </p>
        <p className="text-grey text-sm">
          Verdict: <span className="text-white">{summary.two_sentence_test.verdict}</span>.{" "}
          {summary.two_sentence_test.reason}
        </p>
      </div>

      <div className="border hairline p-8 md:p-12">
        <span className={labelClass}>{RESULT_COPY.pillarsHeading}</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
          {summary.pillars.map((pillar) => (
            <div key={pillar.pillar} className="border-b hairline pb-4">
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-white font-display">{pillar.pillar}</span>
                <span className="text-grey/70 text-sm">{pillar.score ?? "n/a"}/10</span>
              </div>
              <p className="text-grey text-sm">{pillar.one_line}</p>
              {pillar.provisional && <p className="text-grey/50 text-xs mt-1">Provisional</p>}
            </div>
          ))}
        </div>
      </div>

      <div className="border hairline p-8 md:p-12">
        <span className={labelClass}>{RESULT_COPY.findingsHeading}</span>
        <div className="space-y-5 mt-4">
          {summary.top_findings.map((finding, i) => (
            <p key={i} className="text-grey leading-relaxed">
              {finding.finding}{" "}
              <span className="text-xs" style={{ color: confidenceColor(finding.confidence) }}>
                ({finding.confidence} confidence)
              </span>
            </p>
          ))}
        </div>
      </div>

      {sent ? (
        <div className="border hairline p-8 md:p-12 text-center">
          <p className="text-white text-xl font-display mb-3">{RESULT_COPY.successHeading}</p>
          <p className="text-grey mb-8">{RESULT_COPY.successSub}</p>
          <button type="button" onClick={onRunAnother} className="btn-outline" data-cursor-hover>
            {RESULT_COPY.runAnotherLabel}
          </button>
        </div>
      ) : (
        <div className="border hairline p-8 md:p-12" style={{ borderColor: "var(--color-accent)" }}>
          <span className="eyebrow block mb-4">{RESULT_COPY.unlockHeading}</span>
          <p className="text-grey mb-6">{RESULT_COPY.unlockSub}</p>
          <ul className="space-y-2 mb-8">
            {summary.locked_preview.map((title) => (
              <li key={title} className="text-mist text-sm flex items-start gap-2">
                <span className="mt-2 w-1.5 h-1.5 shrink-0" style={{ backgroundColor: "var(--color-accent)" }} />
                {title}
              </li>
            ))}
          </ul>

          <form onSubmit={handleDeliver} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <label className="block">
                <span className={labelClass}>{RESULT_COPY.nameLabel}</span>
                <input type="text" className={inputClass} value={name} onChange={(e) => setName(e.target.value)} required />
              </label>
              <label className="block">
                <span className={labelClass}>{RESULT_COPY.emailLabel}</span>
                <input
                  type="email"
                  className={inputClass}
                  placeholder={RESULT_COPY.emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
            </div>

            <label className="flex items-start gap-3 text-sm text-grey">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                style={{ accentColor: "var(--color-accent)" }}
                className="mt-1"
                required
              />
              {RESULT_COPY.consentLabel}
            </label>

            {deliverError && (
              <p role="alert" className="text-sm" style={{ color: "var(--color-accent)" }}>
                {deliverError}
              </p>
            )}

            <button type="submit" className="btn-solid w-full sm:w-auto justify-center" data-cursor-hover disabled={sending}>
              {sending ? RESULT_COPY.sendingLabel : RESULT_COPY.submitLabel}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
