// Shared Zod schema for the Roundtable interest form, used both by
// InterestForm.tsx (client side, for inline validation) and
// src/app/api/interest/route.ts (server side, the source of truth, which
// re-validates every submission independently and never trusts the
// client). Keep this the single place form validation rules live.

import { z } from "zod";
import { isValidPhoneNumber, type CountryCode } from "libphonenumber-js";
import {
  EXPERTISE_OPTIONS,
  YEARS_EXPERIENCE_OPTIONS,
  JOIN_AS_OPTIONS,
  PREFERRED_FORMAT_OPTIONS,
  AVAILABILITY_OPTIONS,
  COMPANY_STAGE_OPTIONS,
  HEARD_ABOUT_OPTIONS,
  FREE_EMAIL_DOMAINS,
  DISPOSABLE_EMAIL_DOMAINS,
} from "@/content/roundtable";

// ENFORCE_BUSINESS_EMAIL is a server-only env var (not NEXT_PUBLIC_, per
// the brief's own env var list), so the browser bundle can't read its real
// value. The client builds its schema with the documented default (true);
// the server always builds its own copy from the actual environment
// variable and is the one that decides what is finally accepted, so a
// mismatch is never a validation bypass, only, in the rare case someone
// changes the flag without a redeploy, a slightly stale client-side hint.
export function isEnforceBusinessEmailDefault(): boolean {
  return true;
}

export function serverEnforceBusinessEmail(): boolean {
  const raw = process.env.ENFORCE_BUSINESS_EMAIL;
  if (raw === undefined) return true;
  return raw.trim().toLowerCase() !== "false";
}

function emailDomain(email: string): string {
  return email.trim().toLowerCase().split("@")[1] ?? "";
}

export function isBlockedEmailDomain(email: string): boolean {
  const domain = emailDomain(email);
  return (
    (FREE_EMAIL_DOMAINS as readonly string[]).includes(domain) ||
    (DISPOSABLE_EMAIL_DOMAINS as readonly string[]).includes(domain)
  );
}

const LINKEDIN_PROFILE_PATTERN = /^https?:\/\/([a-z]{2,3}\.)?linkedin\.com\/.+/i;

// A small, common set of dialling codes for the WhatsApp country selector.
// +91 (India) is first and is the form's default per the brief.
export const WHATSAPP_COUNTRY_OPTIONS: { code: CountryCode; dial: string; label: string }[] = [
  { code: "IN", dial: "+91", label: "India (+91)" },
  { code: "US", dial: "+1", label: "United States (+1)" },
  { code: "GB", dial: "+44", label: "United Kingdom (+44)" },
  { code: "AE", dial: "+971", label: "United Arab Emirates (+971)" },
  { code: "SG", dial: "+65", label: "Singapore (+65)" },
  { code: "AU", dial: "+61", label: "Australia (+61)" },
  { code: "CA", dial: "+1", label: "Canada (+1)" },
  { code: "DE", dial: "+49", label: "Germany (+49)" },
];

export const DEFAULT_WHATSAPP_COUNTRY: CountryCode = "IN";

export interface BuildInterestSchemaOptions {
  enforceBusinessEmail: boolean;
}

export function buildInterestSchema({ enforceBusinessEmail }: BuildInterestSchemaOptions) {
  return z
    .object({
      // About you
      fullName: z.string().trim().min(1, "Please enter your full name.").max(200),
      businessEmail: z
        .email("Please enter a valid email address.")
        .max(320)
        .superRefine((email, ctx) => {
          if (enforceBusinessEmail && isBlockedEmailDomain(email)) {
            ctx.addIssue({
              code: "custom",
              message: "Please use your business email.",
            });
          }
        }),
      whatsappCountry: z.string().trim().optional(),
      whatsappNumber: z.string().trim().max(32).optional(),
      designation: z.string().trim().min(1, "Please enter your designation.").max(200),
      companyName: z.string().trim().min(1, "Please enter your company name.").max(200),
      companyWebsite: z
        .union([z.url("Please enter a valid website URL."), z.literal("")])
        .optional(),
      linkedinUrl: z
        .string()
        .trim()
        .min(1, "Please enter your LinkedIn profile URL.")
        .refine((val) => LINKEDIN_PROFILE_PATTERN.test(val), {
          message: "Please enter a linkedin.com profile URL.",
        }),
      cityCountry: z.string().trim().min(1, "Please enter your city and country.").max(200),

      // Your expertise
      expertise: z
        .array(z.enum(EXPERTISE_OPTIONS))
        .min(1, "Please choose at least one area of expertise."),
      expertiseOther: z.string().trim().max(200).optional(),
      yearsExperience: z.enum(YEARS_EXPERIENCE_OPTIONS, {
        error: "Please select your years of experience.",
      }),
      topic: z
        .string()
        .trim()
        .min(20, "Please share at least 20 characters.")
        .max(500, "Please keep this under 500 characters."),
      pastLinks: z.string().trim().max(2000).optional(),

      // How you would like to take part
      joinAs: z.enum(JOIN_AS_OPTIONS, { error: "Please select how you would like to join." }),
      preferredFormat: z.enum(PREFERRED_FORMAT_OPTIONS, {
        error: "Please select your preferred format.",
      }),
      availability: z.array(z.enum(AVAILABILITY_OPTIONS)).optional(),
      companyStage: z.enum(COMPANY_STAGE_OPTIONS).optional(),
      heardAbout: z.enum(HEARD_ABOUT_OPTIONS).optional(),
      anythingElse: z.string().trim().max(500).optional(),

      // Consent and protection
      consent: z.literal(true, { error: "Please agree before submitting." }),
      // Honeypot: deliberately unconstrained here (a bot filling it should
      // never see a validation error that reveals the trap). The route
      // handler, not this schema, decides what a non-empty value means.
      websiteUrlConfirm: z.string().max(500).optional().default(""),
      formRenderedAt: z.number(),

      // Source tracking (never shown to the user)
      ref: z.string().trim().max(100).optional(),
      utmSource: z.string().trim().max(200).optional(),
      utmMedium: z.string().trim().max(200).optional(),
      utmCampaign: z.string().trim().max(200).optional(),
      utmTerm: z.string().trim().max(200).optional(),
      utmContent: z.string().trim().max(200).optional(),
      referrer: z.string().trim().max(500).optional(),
    })
    .superRefine((data, ctx) => {
      if (data.expertise.includes("Other") && !data.expertiseOther?.trim()) {
        ctx.addIssue({
          code: "custom",
          message: "Please specify your other area of expertise.",
          path: ["expertiseOther"],
        });
      }
      if (data.whatsappNumber && data.whatsappNumber.trim().length > 0) {
        const country = (data.whatsappCountry as CountryCode) || DEFAULT_WHATSAPP_COUNTRY;
        if (!isValidPhoneNumber(data.whatsappNumber, country)) {
          ctx.addIssue({
            code: "custom",
            message: "Please enter a valid WhatsApp number.",
            path: ["whatsappNumber"],
          });
        }
      }
    });
}

export type InterestFormValues = z.infer<ReturnType<typeof buildInterestSchema>>;
