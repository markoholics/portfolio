import {
  AMBER_THRESHOLD_PERCENT,
  DEAL_BREAKER_ANSWERS,
  FLAG_ANSWERS,
  GREEN_THRESHOLD_PERCENT,
  QUESTION_SCORES,
  QUESTION_WEIGHTS,
  SOFT_CAP_ANSWERS,
  type FitCheckAnswers,
  type FitCheckRoute,
} from "@/lib/fit-check/config";

export interface FitCheckResult {
  route: FitCheckRoute;
  /** 0-100, rounded. Never shown to the visitor. */
  percent: number;
  rawScore: number;
  maxScore: number;
  dealBreakers: string[];
  flags: string[];
}

const ROUTE_RANK: Record<FitCheckRoute, number> = { red: 0, amber: 1, green: 2 };

function worseOf(a: FitCheckRoute, b: FitCheckRoute): FitCheckRoute {
  return ROUTE_RANK[a] <= ROUTE_RANK[b] ? a : b;
}

function questionKeys(): (keyof FitCheckAnswers)[] {
  return Object.keys(QUESTION_WEIGHTS) as (keyof FitCheckAnswers)[];
}

function maxPossibleScore(): number {
  return questionKeys().reduce((sum, key) => {
    const options = QUESTION_SCORES[key] as Record<string, number>;
    const best = Math.max(...Object.values(options));
    return sum + best * QUESTION_WEIGHTS[key];
  }, 0);
}

// Pure function: same answers always produce the same route. No I/O, no
// randomness, so every branch is unit testable in isolation.
export function scoreFitCheck(answers: FitCheckAnswers): FitCheckResult {
  let rawScore = 0;
  const dealBreakers: string[] = [];
  const flags: string[] = [];
  let cap: FitCheckRoute = "green";

  for (const key of questionKeys()) {
    const answer = answers[key] as string;
    const options = QUESTION_SCORES[key] as Record<string, number>;
    const points = options[answer] ?? 0;
    rawScore += points * QUESTION_WEIGHTS[key];

    const dealBreakerList = DEAL_BREAKER_ANSWERS[key] as string[] | undefined;
    if (dealBreakerList?.includes(answer)) {
      dealBreakers.push(`${key}:${answer}`);
    }

    const softCapMap = SOFT_CAP_ANSWERS[key] as Record<string, FitCheckRoute> | undefined;
    const softCap = softCapMap?.[answer];
    if (softCap) {
      cap = worseOf(cap, softCap);
    }

    const flagMap = FLAG_ANSWERS[key] as Record<string, string> | undefined;
    const flag = flagMap?.[answer];
    if (flag) {
      flags.push(flag);
    }
  }

  const maxScore = maxPossibleScore();
  const percent = maxScore > 0 ? Math.round((rawScore / maxScore) * 100) : 0;

  let route: FitCheckRoute;
  if (dealBreakers.length > 0) {
    route = "red";
  } else if (percent >= GREEN_THRESHOLD_PERCENT) {
    route = worseOf("green", cap);
  } else if (percent >= AMBER_THRESHOLD_PERCENT) {
    route = worseOf("amber", cap);
  } else {
    route = "red";
  }

  return { route, percent, rawScore, maxScore, dealBreakers, flags };
}
