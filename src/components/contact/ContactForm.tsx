"use client";

import { useState, FormEvent } from "react";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="border hairline p-10 glass-panel">
        <span className="eyebrow block mb-4">Received</span>
        <p className="font-display text-2xl text-white">
          Thanks — we&apos;ll be in touch within one business day.
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
      <button type="submit" data-cursor-hover className="btn-solid">
        Send
      </button>
    </form>
  );
}
