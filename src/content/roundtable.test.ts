import { describe, it, expect } from "vitest";
import * as roundtableContent from "@/content/roundtable";
import { ROUNDTABLE_HOME_HREF, ROUNDTABLE_HOME_FORMATS_HREF } from "@/content/roundtable";

function collectStrings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") {
    out.push(value);
  } else if (Array.isArray(value)) {
    value.forEach((item) => collectStrings(item, out));
  } else if (value && typeof value === "object") {
    Object.values(value).forEach((item) => collectStrings(item, out));
  }
  return out;
}

describe("homepage teaser links", () => {
  it("points the primary button at /roundtable?ref=home", () => {
    expect(ROUNDTABLE_HOME_HREF).toBe("/roundtable?ref=home");
  });

  it("points the formats link at /roundtable?ref=home#formats", () => {
    expect(ROUNDTABLE_HOME_FORMATS_HREF).toBe("/roundtable?ref=home#formats");
  });
});

describe("roundtable copy style rules", () => {
  it("never uses an em dash anywhere in the content file", () => {
    const strings = collectStrings(roundtableContent);
    const offenders = strings.filter((s) => s.includes("—"));
    expect(offenders).toEqual([]);
  });

  it("never uses a hyphen surrounded by spaces as a dash", () => {
    const strings = collectStrings(roundtableContent);
    const offenders = strings.filter((s) => / - /.test(s));
    expect(offenders).toEqual([]);
  });
});
