"use client";

import { useState, FormEvent } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      company: formData.get("company"),
      message: formData.get("message"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }

      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  if (status === "success") {
    return (
      <div className="border hairline p-10 glass-panel">
        <span className="eyebrow block mb-4">Received</span>
        <p className="font-display text-2xl text-white">
          Thanks. We will be in touch within one business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <label className="block">
          <span className="eyebrow block mb-3">Name</span>
          <input
            required
            type="text"
            name="name"
            className="w-full bg-transparent border-b hairline py-3 text-white outline-none focus:border-white transition-colors"
          />
        </label>
        <label className="block">
          <span className="eyebrow block mb-3">Email</span>
          <input
            required
            type="email"
            name="email"
            className="w-full bg-transparent border-b hairline py-3 text-white outline-none focus:border-white transition-colors"
          />
        </label>
      </div>
      <label className="block">
        <span className="eyebrow block mb-3">Company</span>
        <input
          type="text"
          name="company"
          className="w-full bg-transparent border-b hairline py-3 text-white outline-none focus:border-white transition-colors"
        />
      </label>
      <label className="block">
        <span className="eyebrow block mb-3">What are you building?</span>
        <textarea
          name="message"
          rows={4}
          className="w-full bg-transparent border-b hairline py-3 text-white outline-none focus:border-white transition-colors resize-none"
        />
      </label>
      {status === "error" && (
        <p className="text-grey text-sm">{errorMessage}</p>
      )}
      <button
        type="submit"
        data-cursor-hover
        disabled={status === "submitting"}
        className="btn-solid disabled:opacity-50"
      >
        {status === "submitting" ? "Sending..." : "Send"}
      </button>
    </form>
  );
}
