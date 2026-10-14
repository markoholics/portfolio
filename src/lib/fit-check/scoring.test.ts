import { describe, expect, it } from "vitest";
import { scoreFitCheck } from "@/lib/fit-check/scoring";
import type { FitCheckAnswers } from "@/lib/fit-check/config";

// Every answer at its best option: stage live+paying, top investment,
// Indian audience, the strongest 90-day goal, fastest sign-off, most
// founder time, and the longer engagement. 100% score, no deal breakers,
// no caps.
const BEST_ANSWERS: FitCheckAnswers = {
  stage: "live_paying",
  investment: "above_100k",
  audience: "mostly_indian",
  goal: "repeatable_pipeline",
  decisionSpeed: "same_day",
  founderTime: "three_plus_hours",
  workStyle: "six_month_engagement",
};

// Every answer at its worst (non deal breaker) option. Rock bottom score,
// no deal breakers triggered, still correctly routes Red on score alone.
const WORST_NON_DEAL_BREAKER_ANSWERS: FitCheckAnswers = {
  stage: "idea",
  investment: "60k_to_100k",
  audience: "mixed",
  goal: "brand_awareness",
  decisionSpeed: "committee",
  founderTime: "under_1_hour",
  workStyle: "six_week_sprint",
};

// A mid-table set of answers that lands squarely in the Amber band.
const AMBER_ANSWERS: FitCheckAnswers = {
  stage: "live_early_users",
  investment: "60k_to_100k",
  audience: "mixed",
  goal: "launch_product",
  decisionSpeed: "two_within_48h",
  founderTime: "one_to_two_hours",
  workStyle: "six_week_sprint",
};

describe("scoreFitCheck — routes", () => {
  it("routes Green for a best-case answer set", () => {
    const result = scoreFitCheck(BEST_ANSWERS);
    expect(result.route).toBe("green");
    expect(result.percent).toBe(100);
    expect(result.dealBreakers).toEqual([]);
    expect(result.flags).toEqual([]);
  });

  it("routes Amber for a mid-table answer set", () => {
    const result = scoreFitCheck(AMBER_ANSWERS);
    expect(result.route).toBe("amber");
    expect(result.percent).toBeGreaterThanOrEqual(55);
    expect(result.percent).toBeLessThan(80);
    expect(result.dealBreakers).toEqual([]);
  });

  it("routes Red on score alone when no deal breaker is present", () => {
    const result = scoreFitCheck(WORST_NON_DEAL_BREAKER_ANSWERS);
    expect(result.route).toBe("red");
    expect(result.percent).toBeLessThan(55);
    expect(result.dealBreakers).toEqual([]);
  });

  it("percent is always between 0 and 100", () => {
    for (const answers of [BEST_ANSWERS, AMBER_ANSWERS, WORST_NON_DEAL_BREAKER_ANSWERS]) {
      const { percent } = scoreFitCheck(answers);
      expect(percent).toBeGreaterThanOrEqual(0);
      expect(percent).toBeLessThanOrEqual(100);
    }
  });
});

describe("scoreFitCheck — deal breakers", () => {
  it("investment under ₹60,000 forces Red even with an otherwise near-perfect score", () => {
    const result = scoreFitCheck({
      ...BEST_ANSWERS,
      investment: "under_60k",
    });
    expect(result.route).toBe("red");
    expect(result.dealBreakers).toContain("investment:under_60k");
  });

  it("month-to-month-only work style forces Red even with an otherwise near-perfect score", () => {
    const result = scoreFitCheck({
      ...BEST_ANSWERS,
      workStyle: "month_to_month",
    });
    expect(result.route).toBe("red");
    expect(result.dealBreakers).toContain("workStyle:month_to_month");
  });

  it("records both deal breakers when both are present", () => {
    const result = scoreFitCheck({
      ...BEST_ANSWERS,
      investment: "under_60k",
      workStyle: "month_to_month",
    });
    expect(result.route).toBe("red");
    expect(result.dealBreakers).toEqual(
      expect.arrayContaining(["investment:under_60k", "workStyle:month_to_month"])
    );
    expect(result.dealBreakers).toHaveLength(2);
  });

  it("a deal breaker always wins over the amber score band", () => {
    // Same shape as AMBER_ANSWERS, but with the investment deal breaker.
    const result = scoreFitCheck({
      ...AMBER_ANSWERS,
      investment: "under_60k",
    });
    expect(result.route).toBe("red");
  });
});

describe("scoreFitCheck — soft caps (India-only)", () => {
  it("caps an otherwise-Green score to Amber when the audience is mostly outside India", () => {
    const result = scoreFitCheck({
      ...BEST_ANSWERS,
      audience: "mostly_outside_india",
    });
    expect(result.percent).toBeGreaterThanOrEqual(GREEN_WOULD_HAVE_BEEN_THRESHOLD);
    expect(result.route).toBe("amber");
    expect(result.dealBreakers).toEqual([]);
  });

  it("does not pull an already-Amber score down to Red", () => {
    const result = scoreFitCheck({
      ...AMBER_ANSWERS,
      audience: "mostly_outside_india",
    });
    expect(result.route).toBe("amber");
  });

  it("never upgrades a Red score to Amber", () => {
    const result = scoreFitCheck({
      ...WORST_NON_DEAL_BREAKER_ANSWERS,
      audience: "mostly_outside_india",
    });
    expect(result.route).toBe("red");
  });
});

describe("scoreFitCheck — flags", () => {
  it("flags unrealistic expectations without forcing a route on its own", () => {
    const result = scoreFitCheck({
      ...BEST_ANSWERS,
      goal: "guaranteed_revenue",
    });
    expect(result.flags).toContain("unrealistic_expectations");
    expect(result.dealBreakers).toEqual([]);
    // Score drops (goal is weighted double) but nothing here is a deal
    // breaker, so the route still follows the percentage band.
    expect(result.route).not.toBe("red");
  });
});

// 80, matching GREEN_THRESHOLD_PERCENT in config.ts — kept local so this
// test file has no silent dependency on the config value staying 80.
const GREEN_WOULD_HAVE_BEEN_THRESHOLD = 80;
