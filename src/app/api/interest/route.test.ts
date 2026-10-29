import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const sendThankYouEmail = vi.fn();
const sendInternalNotification = vi.fn();
const backupToGoogleSheets = vi.fn();
const isRateLimited = vi.fn();

vi.mock("@/lib/roundtable/email", () => ({
  sendThankYouEmail: (...args: unknown[]) => sendThankYouEmail(...args),
  sendInternalNotification: (...args: unknown[]) => sendInternalNotification(...args),
}));

vi.mock("@/lib/roundtable/sheets", () => ({
  backupToGoogleSheets: (...args: unknown[]) => backupToGoogleSheets(...args),
}));

vi.mock("@/lib/roundtable/rateLimit", () => ({
  isRateLimited: (...args: unknown[]) => isRateLimited(...args),
  getClientIp: () => "203.0.113.1",
}));

import { POST } from "@/app/api/interest/route";

function validBody(overrides: Record<string, unknown> = {}) {
  return {
    fullName: "Jane Founder",
    businessEmail: "jane@acmecorp.com",
    whatsappCountry: "IN",
    whatsappNumber: "",
    designation: "Head of Marketing",
    companyName: "Acme Corp",
    companyWebsite: "",
    linkedinUrl: "https://linkedin.com/in/janefounder",
    cityCountry: "Bengaluru, India",
    expertise: ["GTM strategy"],
    expertiseOther: "",
    yearsExperience: "3 to 5",
    topic: "A twenty character or longer topic about GTM strategy for founders.",
    pastLinks: "",
    joinAs: "Guest speaker",
    preferredFormat: "Either works",
    availability: [],
    anythingElse: "",
    consent: true,
    websiteUrlConfirm: "",
    formRenderedAt: Date.now() - 5000,
    ...overrides,
  };
}

function makeRequest(body: unknown) {
  return new NextRequest("http://localhost/api/interest", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
  });
}

beforeEach(() => {
  sendThankYouEmail.mockReset().mockResolvedValue(true);
  sendInternalNotification.mockReset().mockResolvedValue(true);
  backupToGoogleSheets.mockReset().mockResolvedValue(undefined);
  isRateLimited.mockReset().mockResolvedValue(false);
});

describe("POST /api/interest", () => {
  it("sends both emails and returns success for a valid submission", async () => {
    const res = await POST(makeRequest(validBody()));
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(sendInternalNotification).toHaveBeenCalledTimes(1);
    expect(sendThankYouEmail).toHaveBeenCalledTimes(1);
    expect(backupToGoogleSheets).toHaveBeenCalledTimes(1);
  });

  it("returns 400 for an invalid submission and sends no emails", async () => {
    const res = await POST(makeRequest(validBody({ fullName: "" })));
    expect(res.status).toBe(400);
    expect(sendInternalNotification).not.toHaveBeenCalled();
    expect(sendThankYouEmail).not.toHaveBeenCalled();
  });

  it("returns 429 when rate limited, without sending emails", async () => {
    isRateLimited.mockResolvedValue(true);
    const res = await POST(makeRequest(validBody()));
    expect(res.status).toBe(429);
    expect(sendInternalNotification).not.toHaveBeenCalled();
  });

  it("silently accepts a honeypot submission without sending emails", async () => {
    const res = await POST(makeRequest(validBody({ websiteUrlConfirm: "http://spam.example" })));
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(sendInternalNotification).not.toHaveBeenCalled();
    expect(sendThankYouEmail).not.toHaveBeenCalled();
  });

  it("silently accepts a too-fast submission without sending emails", async () => {
    const res = await POST(makeRequest(validBody({ formRenderedAt: Date.now() })));
    expect(res.status).toBe(201);
    expect(sendInternalNotification).not.toHaveBeenCalled();
  });

  it("returns 500 when the internal notification fails, since a lost lead is worse than a visible error", async () => {
    sendInternalNotification.mockResolvedValue(false);
    const res = await POST(makeRequest(validBody()));
    expect(res.status).toBe(500);
    expect(sendThankYouEmail).not.toHaveBeenCalled();
  });

  it("still returns success when only the thank you email fails", async () => {
    sendThankYouEmail.mockResolvedValue(false);
    const res = await POST(makeRequest(validBody()));
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.success).toBe(true);
  });
});
