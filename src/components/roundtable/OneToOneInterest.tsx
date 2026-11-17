"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Reveal from "@/components/Reveal";
import { CONTACT_EMAIL } from "@/lib/data";
import { ONE_TO_ONE_COPY } from "@/content/roundtable";

const inputClass =
  "w-full bg-transparent border-b hairline py-3 text-white outline-none focus:border-white focus-visible:border-white transition-colors";
const labelClass = "eyebrow block mb-3";

export default function OneToOneInterest() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const renderedAt = useRef(0);
  useEffect(() => {
    renderedAt.current = Date.now();
  }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/one-to-one", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          websiteUrlConfirm: honeypot,
          formRenderedAt: renderedAt.current,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <section className="section-pad bg-black border-t hairline">
      <div className="container-edge max-w-2xl">
        <Reveal>
          <span className="eyebrow block mb-6" style={{ color: "var(--color-accent)" }}>
            {ONE_TO_ONE_COPY.eyebrow}
          </span>
          <h2 className="font-display text-white text-3xl md:text-4xl leading-tight mb-4">
            {ONE_TO_ONE_COPY.heading}
          </h2>
          <p className="text-grey text-lg mb-10">{ONE_TO_ONE_COPY.sub}</p>

          {status === "success" ? (
            <div className="border hairline p-8">
              <p className="font-display text-white text-xl mb-2">{ONE_TO_ONE_COPY.successHeading}</p>
              <p className="text-grey">{ONE_TO_ONE_COPY.successSub}</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="space-y-8">
              {/* Honeypot: hidden via CSS (not type="hidden"), unreachable
                  by keyboard, never announced. Matches InterestForm.tsx. */}
              <div
                aria-hidden="true"
                style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", overflow: "hidden" }}
              >
                <label htmlFor="one_to_one_website_url_confirm">Leave this field empty</label>
                <input
                  id="one_to_one_website_url_confirm"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <label className="block">
                  <span className={labelClass}>{ONE_TO_ONE_COPY.nameLabel}</span>
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    className={inputClass}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </label>
                <label className="block">
                  <span className={labelClass}>{ONE_TO_ONE_COPY.emailLabel}</span>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    className={inputClass}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </label>
              </div>

              {status === "error" && (
                <p role="alert" className="text-sm" style={{ color: "var(--color-accent)" }}>
                  {errorMessage || ONE_TO_ONE_COPY.errorFallback} {CONTACT_EMAIL}.
                </p>
              )}

              <button
                type="submit"
                data-cursor-hover
                disabled={status === "submitting"}
                className="btn-outline disabled:opacity-50"
              >
                {status === "submitting" ? ONE_TO_ONE_COPY.sendingLabel : ONE_TO_ONE_COPY.submitLabel}
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
