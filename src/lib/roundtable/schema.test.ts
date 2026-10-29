import { describe, it, expect } from "vitest";
import { buildInterestSchema, isBlockedEmailDomain } from "@/lib/roundtable/schema";

const schema = buildInterestSchema({ enforceBusinessEmail: true });

function validPayload(overrides: Partial<Record<string, unknown>> = {}) {
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
    pastLinks: "",
    joinAs: "Guest speaker",
    preferredFormat: "Either works",
    availability: [],
    companyStage: undefined,
    heardAbout: undefined,
    anythingElse: "",
    consent: true,
    websiteUrlConfirm: "",
    formRenderedAt: Date.now() - 5000,
    ...overrides,
  };
}

describe("buildInterestSchema", () => {
  it("accepts a fully valid submission", () => {
    const result = schema.safeParse(validPayload());
    expect(result.success).toBe(true);
  });

  it("rejects a submission missing required fields", () => {
    const result = schema.safeParse(
      validPayload({ fullName: "", companyName: "", linkedinUrl: "" })
    );
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path.join("."));
      expect(paths).toContain("fullName");
      expect(paths).toContain("companyName");
      expect(paths).toContain("linkedinUrl");
    }
  });

  it("rejects a free email provider when enforcement is on", () => {
    const result = schema.safeParse(validPayload({ businessEmail: "jane@gmail.com" }));
    expect(result.success).toBe(false);
    if (!result.success) {
      const emailIssue = result.error.issues.find((i) => i.path.join(".") === "businessEmail");
      expect(emailIssue?.message).toBe("Please use your business email.");
    }
  });

  it("allows a free email provider when enforcement is off", () => {
    const permissive = buildInterestSchema({ enforceBusinessEmail: false });
    const result = permissive.safeParse(validPayload({ businessEmail: "jane@gmail.com" }));
    expect(result.success).toBe(true);
  });

  it("rejects an invalid WhatsApp number but allows an empty one", () => {
    const bad = schema.safeParse(validPayload({ whatsappNumber: "123" }));
    expect(bad.success).toBe(false);

    const empty = schema.safeParse(validPayload({ whatsappNumber: "" }));
    expect(empty.success).toBe(true);

    const good = schema.safeParse(validPayload({ whatsappNumber: "9876543210" }));
    expect(good.success).toBe(true);
  });

  it("requires expertiseOther when Other is selected", () => {
    const missing = schema.safeParse(
      validPayload({ expertise: ["Other"], expertiseOther: "" })
    );
    expect(missing.success).toBe(false);

    const provided = schema.safeParse(
      validPayload({ expertise: ["Other"], expertiseOther: "Community building" })
    );
    expect(provided.success).toBe(true);
  });

  it("rejects a LinkedIn URL that isn't on linkedin.com", () => {
    const result = schema.safeParse(validPayload({ linkedinUrl: "https://twitter.com/jane" }));
    expect(result.success).toBe(false);
  });

  it("requires the consent checkbox to be true", () => {
    const result = schema.safeParse(validPayload({ consent: false }));
    expect(result.success).toBe(false);
  });
});

describe("isBlockedEmailDomain", () => {
  it("flags common free providers", () => {
    expect(isBlockedEmailDomain("someone@gmail.com")).toBe(true);
    expect(isBlockedEmailDomain("someone@yahoo.com")).toBe(true);
  });

  it("flags disposable providers", () => {
    expect(isBlockedEmailDomain("someone@mailinator.com")).toBe(true);
  });

  it("allows a business domain", () => {
    expect(isBlockedEmailDomain("someone@acmecorp.com")).toBe(false);
  });
});
