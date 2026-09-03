"use client";

import { useState, type FormEvent } from "react";
import { trackLeadSubmit } from "@/components/gtm-audit/track";

type Status = "idle" | "submitting" | "success" | "error";

export default function LeadCaptureForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const form = event.currentTarget;
    const data = new FormData(form);
    const params = new URLSearchParams(window.location.search);

    try {
      // TODO(endpoint): this posts to the site's own /api/gtm-audit-lead
      // route, which writes to a Supabase table. Run
      // supabase/gtm_audit_leads.sql once in the Supabase SQL editor before
      // this can save submissions. Swap the URL below if you'd rather send
      // these leads to a different configured endpoint (Zapier, a CRM
      // webhook, etc.) instead.
      const response = await fetch("/api/gtm-audit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          company: data.get("company"),
          website: data.get("website"),
          utm_source: params.get("utm_source"),
          utm_medium: params.get("utm_medium"),
          utm_campaign: params.get("utm_campaign"),
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong. Please try again.");
      }

      trackLeadSubmit();
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-[#D6FE4E]/40 bg-[#D6FE4E]/5 p-8 text-center">
        <p className="font-display text-xl text-white">Spot reserved.</p>
        <p className="mt-2 text-white/70">
          We&apos;ll email your checkout link as soon as it&apos;s live, or reach out directly to get started.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="sm:col-span-1">
        <label htmlFor="gtm-name" className="mb-1.5 block text-sm text-white/70">
          Name
        </label>
        <input
          id="gtm-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-[#01A6C8] focus:outline-none"
        />
      </div>
      <div className="sm:col-span-1">
        <label htmlFor="gtm-email" className="mb-1.5 block text-sm text-white/70">
          Email
        </label>
        <input
          id="gtm-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-[#01A6C8] focus:outline-none"
        />
      </div>
      <div className="sm:col-span-1">
        <label htmlFor="gtm-company" className="mb-1.5 block text-sm text-white/70">
          Company
        </label>
        <input
          id="gtm-company"
          name="company"
          type="text"
          autoComplete="organization"
          className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-[#01A6C8] focus:outline-none"
        />
      </div>
      <div className="sm:col-span-1">
        <label htmlFor="gtm-website" className="mb-1.5 block text-sm text-white/70">
          Website URL
        </label>
        <input
          id="gtm-website"
          name="website"
          type="text"
          inputMode="url"
          placeholder="yourcompany.com"
          autoComplete="url"
          className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-[#01A6C8] focus:outline-none"
        />
      </div>

      {status === "error" && (
        <p className="sm:col-span-2 text-sm text-[#ff8080]" role="alert">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="sm:col-span-2 inline-flex items-center justify-center rounded-full bg-[#D6FE4E] px-8 py-4 text-sm font-bold uppercase tracking-wide text-black transition-transform hover:scale-[1.02] disabled:opacity-60"
      >
        {status === "submitting" ? "Reserving…" : "Reserve My Signal Sprint"}
      </button>
    </form>
  );
}
