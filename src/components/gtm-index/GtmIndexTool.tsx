"use client";

import { useState } from "react";
import { FORM_COPY } from "@/content/gtmIndex";
import type { GtmIndexPublicResult } from "@/lib/gtmIndex/types";
import GtmIndexForm from "@/components/gtm-index/GtmIndexForm";
import GtmIndexResult from "@/components/gtm-index/GtmIndexResult";

type Status = "idle" | "loading" | "done" | "error";

export default function GtmIndexTool() {
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<GtmIndexPublicResult | null>(null);
  const [error, setError] = useState("");

  const runAnalysis = async (values: { companyUrl: string; linkedinUrl: string; instagramUrl: string; xUrl: string }) => {
    setStatus("loading");
    setError("");
    try {
      const response = await fetch("/api/gtm-index/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data?.error || FORM_COPY.errorFallback);
        setStatus("error");
        return;
      }
      setResult(data as GtmIndexPublicResult);
      setStatus("done");
    } catch {
      setError(FORM_COPY.errorFallback);
      setStatus("error");
    }
  };

  const reset = () => {
    setStatus("idle");
    setResult(null);
    setError("");
  };

  if (status === "done" && result) {
    return <GtmIndexResult result={result} onRunAnother={reset} />;
  }

  return (
    <GtmIndexForm
      loading={status === "loading"}
      error={status === "error" ? error : ""}
      onSubmit={runAnalysis}
    />
  );
}
