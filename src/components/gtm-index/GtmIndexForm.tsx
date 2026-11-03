"use client";

import { FormEvent, useState } from "react";
import { FORM_COPY, HERO_COPY } from "@/content/gtmIndex";

const inputClass =
  "w-full bg-transparent border-b hairline py-3 text-white outline-none focus:border-white focus-visible:border-white transition-colors";
const labelClass = "eyebrow block mb-3";

export default function GtmIndexForm({
  loading,
  error,
  onSubmit,
}: {
  loading: boolean;
  error: string;
  onSubmit: (values: { companyUrl: string; linkedinUrl: string; instagramUrl: string; xUrl: string }) => void;
}) {
  const [companyUrl, setCompanyUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [xUrl, setXUrl] = useState("");
  const [touched, setTouched] = useState(false);

  const trimmedCompanyUrl = companyUrl.trim();
  const companyUrlValid = trimmedCompanyUrl.length > 2 && trimmedCompanyUrl.includes(".");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setTouched(true);
    if (!companyUrlValid || loading) return;
    onSubmit({
      companyUrl: trimmedCompanyUrl,
      linkedinUrl: linkedinUrl.trim(),
      instagramUrl: instagramUrl.trim(),
      xUrl: xUrl.trim(),
    });
  };

  if (loading) {
    return (
      <div className="border hairline p-8 md:p-12 text-center">
        <div
          className="mx-auto mb-6 h-10 w-10 border-2 rounded-full animate-spin"
          style={{ borderColor: "rgba(217,217,217,0.25)", borderTopColor: "var(--color-accent)" }}
          aria-hidden="true"
        />
        <p className="text-white text-lg font-display">{FORM_COPY.loadingLabel}</p>
        <p className="text-grey mt-3 max-w-md mx-auto">{FORM_COPY.loadingSub}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border hairline p-8 md:p-12" noValidate>
      <label className="block mb-8">
        <span className={labelClass}>{FORM_COPY.companyUrlLabel}</span>
        <input
          type="text"
          inputMode="url"
          autoComplete="url"
          className={inputClass}
          placeholder={FORM_COPY.companyUrlPlaceholder}
          value={companyUrl}
          onChange={(e) => setCompanyUrl(e.target.value)}
          aria-invalid={touched && !companyUrlValid}
          aria-describedby={touched && !companyUrlValid ? "company-url-error" : undefined}
        />
        {touched && !companyUrlValid && (
          <p id="company-url-error" role="alert" className="text-sm mt-2" style={{ color: "var(--color-accent)" }}>
            Please enter a valid website, e.g. yourcompany.com
          </p>
        )}
      </label>

      <span className={labelClass}>{FORM_COPY.socialsLabel}</span>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <input
          type="text"
          className={inputClass}
          placeholder={FORM_COPY.linkedinPlaceholder}
          value={linkedinUrl}
          onChange={(e) => setLinkedinUrl(e.target.value)}
        />
        <input
          type="text"
          className={inputClass}
          placeholder={FORM_COPY.instagramPlaceholder}
          value={instagramUrl}
          onChange={(e) => setInstagramUrl(e.target.value)}
        />
        <input
          type="text"
          className={inputClass}
          placeholder={FORM_COPY.xPlaceholder}
          value={xUrl}
          onChange={(e) => setXUrl(e.target.value)}
        />
      </div>

      {error && (
        <p role="alert" className="text-sm mb-6" style={{ color: "var(--color-accent)" }}>
          {error}
        </p>
      )}

      <button type="submit" className="btn-solid w-full sm:w-auto justify-center" data-cursor-hover>
        {FORM_COPY.submitLabel}
      </button>

      <ul className="flex flex-wrap gap-x-6 gap-y-2 mt-8">
        {HERO_COPY.bullets.map((bullet) => (
          <li key={bullet} className="text-grey/70 text-xs flex items-center gap-2">
            <span className="w-1.5 h-1.5" style={{ backgroundColor: "var(--color-accent)" }} />
            {bullet}
          </li>
        ))}
      </ul>
    </form>
  );
}
