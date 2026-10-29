// Rate limiting for POST /api/interest. Uses Upstash Redis (a fixed
// window counter via INCR + EXPIRE) when UPSTASH_REDIS_REST_URL and
// UPSTASH_REDIS_REST_TOKEN are both set, so limits hold across serverless
// instances; otherwise falls back to the in-memory bucket pattern already
// used by src/app/api/fit-check/route.ts, which resets on cold start but
// needs no extra infrastructure for local dev or a low-traffic launch.

import { Redis } from "@upstash/redis";

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = UPSTASH_URL && UPSTASH_TOKEN ? new Redis({ url: UPSTASH_URL, token: UPSTASH_TOKEN }) : null;

const memoryBuckets = new Map<string, { count: number; windowStart: number }>();

function isRateLimitedInMemory(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = memoryBuckets.get(key);
  if (!bucket || now - bucket.windowStart > windowMs) {
    memoryBuckets.set(key, { count: 1, windowStart: now });
    return false;
  }
  bucket.count += 1;
  return bucket.count > max;
}

/**
 * Returns true if the given key has exceeded `max` hits within `windowMs`.
 * Each call counts as one hit. Fails open (not rate limited) if Upstash is
 * configured but the request to it errors, so a Redis outage never blocks
 * legitimate submissions.
 */
export async function isRateLimited(key: string, max: number, windowMs: number): Promise<boolean> {
  if (!redis) {
    return isRateLimitedInMemory(key, max, windowMs);
  }

  try {
    const windowSeconds = Math.ceil(windowMs / 1000);
    const redisKey = `roundtable:ratelimit:${key}`;
    const count = await redis.incr(redisKey);
    if (count === 1) {
      await redis.expire(redisKey, windowSeconds);
    }
    return count > max;
  } catch (error) {
    console.error("Roundtable rate limit check failed, allowing request:", error);
    return false;
  }
}

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}
