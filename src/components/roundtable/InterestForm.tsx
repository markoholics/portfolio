"use client";

import { useEffect, useId, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Reveal from "@/components/Reveal";
import { CONTACT_EMAIL } from "@/lib/data";
import {
  buildInterestSchema,
  isEnforceBusinessEmailDefault,
  WHATSAPP_COUNTRY_OPTIONS,
  DEFAULT_WHATSAPP_COUNTRY,
  type InterestFormValues,
} from "@/lib/roundtable/schema";
import {
  EXPERTISE_OPTIONS,
  YEARS_EXPERIENCE_OPTIONS,
  JOIN_AS_OPTIONS,
  PREFERRED_FORMAT_OPTIONS,
  AVAILABILITY_OPTIONS,
  COMPANY_STAGE_OPTIONS,
  HEARD_ABOUT_OPTIONS,
  FORM_INTRO_COPY,
  FORM_SUCCESS_COPY,
  FORM_ERROR_COPY,
} from "@/content/roundtable";

const schema = buildInterestSchema({ enforceBusinessEmail: isEnforceBusinessEmailDefault() });

const inputClass =
  "w-full bg-transparent border-b hairline py-3 text-white outline-none focus:border-white focus-visible:border-white transition-colors";
const labelClass = "eyebrow block mb-3";
const errorClass = "text-sm mt-2";

function ErrorText({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className={errorClass} style={{ color: "var(--color-accent)" }}>
      {message}
    </p>
  );
}

export default function InterestForm() {
  const headingId = useId();
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [submittedFirstName, setSubmittedFirstName] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      expertise: [],
      availability: [],
      whatsappCountry: DEFAULT_WHATSAPP_COUNTRY,
      websiteUrlConfirm: "",
      formRenderedAt: 0,
    },
  });

  const expertise = watch("expertise") ?? [];

  useEffect(() => {
    setValue("formRenderedAt", Date.now());

    const params = new URLSearchParams(window.location.search);
    setValue("ref", params.get("ref") ?? undefined);
    setValue("utmSource", params.get("utm_source") ?? undefined);
    setValue("utmMedium", params.get("utm_medium") ?? undefined);
    setValue("utmCampaign", params.get("utm_campaign") ?? undefined);
    setValue("utmTerm", params.get("utm_term") ?? undefined);
    setValue("utmContent", params.get("utm_content") ?? undefined);
    setValue("referrer", document.referrer || undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const topicValue = watch("topic") ?? "";
  const anythingElseValue = watch("anythingElse") ?? "";

  const onSubmit = async (values: InterestFormValues) => {
    setStatus("submitting");
    setErrorMessage("");
    try {
      const res = await fetch("/api/interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }
      setSubmittedFirstName(values.fullName.trim().split(/\s+/)[0] || values.fullName.trim());
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  if (status === "success") {
    return (
      <section id="interest" className="section-pad bg-black border-t hairline scroll-mt-24">
        <div className="container-edge max-w-2xl">
          <Reveal>
            <div className="border hairline p-10">
              <span className="eyebrow block mb-4" style={{ color: "var(--color-accent)" }}>
                Received
              </span>
              <p className="font-display text-2xl md:text-3xl text-white mb-4">
                {FORM_SUCCESS_COPY.heading(submittedFirstName)}
              </p>
              <p className="text-grey text-lg">{FORM_SUCCESS_COPY.sub}</p>
            </div>
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <section id="interest" className="section-pad bg-black border-t hairline scroll-mt-24">
      <div className="container-edge max-w-3xl">
        <Reveal>
          <h2 id={headingId} className="font-display text-white text-3xl md:text-4xl leading-tight mb-3">
            {FORM_INTRO_COPY.heading}
          </h2>
          <p className="text-grey text-lg mb-3">{FORM_INTRO_COPY.sub}</p>
          <p className="text-grey text-sm mb-10">
            {FORM_INTRO_COPY.emailPreferLine}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="underline underline-offset-2 hover:text-white transition-colors"
              style={{ color: "var(--color-accent)" }}
            >
              {CONTACT_EMAIL}
            </a>
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <form onSubmit={handleSubmit(onSubmit)} aria-labelledby={headingId} noValidate className="space-y-14">
            {/* Honeypot: hidden via CSS (not type="hidden", which some bots
                skip), unreachable by keyboard, never announced. */}
            <div
              aria-hidden="true"
              style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", overflow: "hidden" }}
            >
              <label htmlFor="website_url_confirm">Leave this field empty</label>
              <input
                id="website_url_confirm"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                {...register("websiteUrlConfirm")}
              />
            </div>

            <fieldset className="space-y-8">
              <legend className="font-display text-white text-xl mb-2">About you</legend>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <label className="block">
                  <span className={labelClass}>Full name</span>
                  <input
                    type="text"
                    className={inputClass}
                    aria-invalid={!!errors.fullName}
                    aria-describedby={errors.fullName ? "fullName-error" : undefined}
                    {...register("fullName")}
                  />
                  <ErrorText id="fullName-error" message={errors.fullName?.message} />
                </label>

                <label className="block">
                  <span className={labelClass}>Business email</span>
                  <input
                    type="email"
                    className={inputClass}
                    aria-invalid={!!errors.businessEmail}
                    aria-describedby={errors.businessEmail ? "businessEmail-error" : undefined}
                    {...register("businessEmail")}
                  />
                  <ErrorText id="businessEmail-error" message={errors.businessEmail?.message} />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-4 md:gap-8">
                <label className="block">
                  <span className={labelClass}>Country</span>
                  <select className={inputClass} {...register("whatsappCountry")}>
                    {WHATSAPP_COUNTRY_OPTIONS.map((c) => (
                      <option key={c.code} value={c.code} className="bg-black">
                        {c.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className={labelClass}>WhatsApp number (optional)</span>
                  <input
                    type="tel"
                    className={inputClass}
                    aria-invalid={!!errors.whatsappNumber}
                    aria-describedby="whatsappNumber-help whatsappNumber-error"
                    {...register("whatsappNumber")}
                  />
                  <p id="whatsappNumber-help" className="text-grey/70 text-xs mt-2">
                    Optional. We will only use it to coordinate your episode.
                  </p>
                  <ErrorText id="whatsappNumber-error" message={errors.whatsappNumber?.message} />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <label className="block">
                  <span className={labelClass}>Designation</span>
                  <input
                    type="text"
                    className={inputClass}
                    aria-invalid={!!errors.designation}
                    aria-describedby={errors.designation ? "designation-error" : undefined}
                    {...register("designation")}
                  />
                  <ErrorText id="designation-error" message={errors.designation?.message} />
                </label>

                <label className="block">
                  <span className={labelClass}>Company name</span>
                  <input
                    type="text"
                    className={inputClass}
                    aria-invalid={!!errors.companyName}
                    aria-describedby={errors.companyName ? "companyName-error" : undefined}
                    {...register("companyName")}
                  />
                  <ErrorText id="companyName-error" message={errors.companyName?.message} />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <label className="block">
                  <span className={labelClass}>Company website (optional)</span>
                  <input
                    type="url"
                    placeholder="https://"
                    className={inputClass}
                    aria-invalid={!!errors.companyWebsite}
                    aria-describedby={errors.companyWebsite ? "companyWebsite-error" : undefined}
                    {...register("companyWebsite")}
                  />
                  <ErrorText id="companyWebsite-error" message={errors.companyWebsite?.message} />
                </label>

                <label className="block">
                  <span className={labelClass}>LinkedIn profile URL</span>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/"
                    className={inputClass}
                    aria-invalid={!!errors.linkedinUrl}
                    aria-describedby={errors.linkedinUrl ? "linkedinUrl-error" : undefined}
                    {...register("linkedinUrl")}
                  />
                  <ErrorText id="linkedinUrl-error" message={errors.linkedinUrl?.message} />
                </label>
              </div>

              <label className="block">
                <span className={labelClass}>City and country</span>
                <input
                  type="text"
                  className={inputClass}
                  aria-invalid={!!errors.cityCountry}
                  aria-describedby={errors.cityCountry ? "cityCountry-error" : undefined}
                  {...register("cityCountry")}
                />
                <ErrorText id="cityCountry-error" message={errors.cityCountry?.message} />
              </label>
            </fieldset>

            <fieldset className="space-y-8">
              <legend className="font-display text-white text-xl mb-2">Your expertise</legend>

              <div>
                <span className={labelClass} id="expertise-label">Areas of expertise</span>
                <div
                  role="group"
                  aria-labelledby="expertise-label"
                  aria-describedby={errors.expertise ? "expertise-error" : undefined}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4"
                >
                  {EXPERTISE_OPTIONS.map((option) => (
                    <label key={option} className="flex items-start gap-3 text-mist text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        value={option}
                        className="mt-0.5 w-4 h-4 shrink-0 focus-visible:ring-2"
                        style={{ accentColor: "var(--color-accent)" }}
                        {...register("expertise")}
                      />
                      {option}
                    </label>
                  ))}
                </div>
                <ErrorText id="expertise-error" message={errors.expertise?.message as string | undefined} />

                {expertise.includes("Other") && (
                  <label className="block mt-6">
                    <span className={labelClass}>Please specify</span>
                    <input type="text" className={inputClass} {...register("expertiseOther")} />
                    <ErrorText id="expertiseOther-error" message={errors.expertiseOther?.message} />
                  </label>
                )}
              </div>

              <label className="block max-w-xs">
                <span className={labelClass}>Years of experience</span>
                <select
                  className={inputClass}
                  defaultValue=""
                  aria-invalid={!!errors.yearsExperience}
                  aria-describedby={errors.yearsExperience ? "yearsExperience-error" : undefined}
                  {...register("yearsExperience")}
                >
                  <option value="" disabled className="bg-black">
                    Select
                  </option>
                  {YEARS_EXPERIENCE_OPTIONS.map((option) => (
                    <option key={option} value={option} className="bg-black">
                      {option}
                    </option>
                  ))}
                </select>
                <ErrorText id="yearsExperience-error" message={errors.yearsExperience?.message} />
              </label>

              <label className="block">
                <span className={labelClass}>A topic you could speak on</span>
                <textarea
                  rows={4}
                  placeholder="One idea, framework or lesson you could share in 10 minutes."
                  className={`${inputClass} resize-none`}
                  aria-invalid={!!errors.topic}
                  aria-describedby="topic-count topic-error"
                  {...register("topic")}
                />
                <div className="flex items-center justify-between mt-2">
                  <ErrorText id="topic-error" message={errors.topic?.message} />
                  <span id="topic-count" className="text-grey/70 text-xs ml-auto">
                    {topicValue.length}/500
                  </span>
                </div>
              </label>

              <label className="block">
                <span className={labelClass}>Links to past talks, podcasts or writing (optional)</span>
                <textarea rows={3} className={`${inputClass} resize-none`} {...register("pastLinks")} />
              </label>
            </fieldset>

            <fieldset className="space-y-8">
              <legend className="font-display text-white text-xl mb-2">How you would like to take part</legend>

              <div>
                <span className={labelClass}>I would like to join as</span>
                <select
                  className={inputClass}
                  defaultValue=""
                  aria-invalid={!!errors.joinAs}
                  aria-describedby={errors.joinAs ? "joinAs-error" : undefined}
                  {...register("joinAs")}
                >
                  <option value="" disabled className="bg-black">
                    Select
                  </option>
                  {JOIN_AS_OPTIONS.map((option) => (
                    <option key={option} value={option} className="bg-black">
                      {option}
                    </option>
                  ))}
                </select>
                <ErrorText id="joinAs-error" message={errors.joinAs?.message} />
              </div>

              <div>
                <span className={labelClass} id="preferredFormat-label">Preferred format</span>
                <div
                  role="radiogroup"
                  aria-labelledby="preferredFormat-label"
                  aria-describedby={errors.preferredFormat ? "preferredFormat-error" : undefined}
                  className="flex flex-wrap gap-6"
                >
                  {PREFERRED_FORMAT_OPTIONS.map((option) => (
                    <label key={option} className="flex items-center gap-3 text-mist text-sm cursor-pointer">
                      <input
                        type="radio"
                        value={option}
                        className="w-4 h-4 shrink-0 focus-visible:ring-2"
                        style={{ accentColor: "var(--color-accent)" }}
                        {...register("preferredFormat")}
                      />
                      {option}
                    </label>
                  ))}
                </div>
                <ErrorText id="preferredFormat-error" message={errors.preferredFormat?.message} />
              </div>

              <div>
                <span className={labelClass}>Availability for in person episodes (optional)</span>
                <div className="flex flex-wrap gap-6">
                  {AVAILABILITY_OPTIONS.map((option) => (
                    <label key={option} className="flex items-center gap-3 text-mist text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        value={option}
                        className="w-4 h-4 shrink-0 focus-visible:ring-2"
                        style={{ accentColor: "var(--color-accent)" }}
                        {...register("availability")}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <label className="block">
                  <span className={labelClass}>Company stage (optional)</span>
                  <select className={inputClass} defaultValue="" {...register("companyStage")}>
                    <option value="" className="bg-black">
                      Select
                    </option>
                    {COMPANY_STAGE_OPTIONS.map((option) => (
                      <option key={option} value={option} className="bg-black">
                        {option}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className={labelClass}>How did you hear about us? (optional)</span>
                  <select className={inputClass} defaultValue="" {...register("heardAbout")}>
                    <option value="" className="bg-black">
                      Select
                    </option>
                    {HEARD_ABOUT_OPTIONS.map((option) => (
                      <option key={option} value={option} className="bg-black">
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="block">
                <span className={labelClass}>Anything else we should know? (optional)</span>
                <textarea
                  rows={3}
                  className={`${inputClass} resize-none`}
                  aria-describedby="anythingElse-count"
                  {...register("anythingElse")}
                />
                <span id="anythingElse-count" className="text-grey/70 text-xs mt-2 block text-right">
                  {anythingElseValue.length}/500
                </span>
              </label>
            </fieldset>

            <fieldset className="space-y-6">
              <label className="flex items-start gap-3 text-mist text-sm cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-0.5 w-4 h-4 shrink-0 focus-visible:ring-2"
                  style={{ accentColor: "var(--color-accent)" }}
                  aria-invalid={!!errors.consent}
                  aria-describedby={errors.consent ? "consent-error" : undefined}
                  {...register("consent")}
                />
                I agree to Markoholics storing my details and contacting me about the Roundtable Series.
              </label>
              <ErrorText id="consent-error" message={errors.consent?.message} />

              {status === "error" && (
                <div className="border hairline p-4" style={{ borderColor: "var(--color-accent)" }}>
                  <p className="text-white text-sm mb-1">{FORM_ERROR_COPY.heading}</p>
                  <p className="text-grey text-sm">
                    {errorMessage || "Please try again."} {FORM_ERROR_COPY.sub}{" "}
                    <a href={`mailto:${CONTACT_EMAIL}`} className="underline" style={{ color: "var(--color-accent)" }}>
                      {CONTACT_EMAIL}
                    </a>
                    .
                  </p>
                </div>
              )}

              <button
                type="submit"
                data-cursor-hover
                disabled={isSubmitting || status === "submitting"}
                className="btn-solid disabled:opacity-50 min-h-[44px]"
              >
                {status === "submitting" ? "Sending..." : "Express interest"}
              </button>
            </fieldset>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
