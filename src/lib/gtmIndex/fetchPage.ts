// A polite, bounded HTTP fetch for the zero-cost GTM Index evidence
// collector: a real User-Agent that identifies the bot, a robots.txt
// check before the first fetch of a given host, and a hard timeout so one
// slow or hanging site can't stall the whole run. No API key, no model
// call, just plain HTTP.
const USER_AGENT = "MarkoholicsGTMIndexBot/1.0 (+https://www.markoholics.com/gtm-index)";
const FETCH_TIMEOUT_MS = 10000;

export interface FetchResult {
  ok: boolean;
  status: number | null;
  html: string | null;
  finalUrl: string;
  error: string | null;
}

const robotsCache = new Map<string, Set<string> | null>();

function originOf(url: string): string {
  return new URL(url).origin;
}

async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": USER_AGENT, Accept: "text/html,application/xhtml+xml" },
      redirect: "follow",
    });
  } finally {
    clearTimeout(timer);
  }
}

// Returns the set of disallowed path prefixes for "*" (and our own UA, if
// named) from /robots.txt, or null if robots.txt is absent or unreadable
// (treated as "everything allowed", the standard default).
async function getDisallowedPaths(origin: string): Promise<Set<string> | null> {
  if (robotsCache.has(origin)) return robotsCache.get(origin) ?? null;
  try {
    const res = await fetchWithTimeout(`${origin}/robots.txt`, 5000);
    if (!res.ok) {
      robotsCache.set(origin, null);
      return null;
    }
    const text = await res.text();
    const disallowed = new Set<string>();
    let relevant = false;
    for (const rawLine of text.split("\n")) {
      const line = rawLine.trim();
      if (/^user-agent:/i.test(line)) {
        const agent = line.split(":")[1]?.trim().toLowerCase();
        relevant = agent === "*" || agent === "markoholicsgtmindexbot";
      } else if (relevant && /^disallow:/i.test(line)) {
        const path = line.split(":")[1]?.trim();
        if (path) disallowed.add(path);
      }
    }
    robotsCache.set(origin, disallowed);
    return disallowed;
  } catch {
    robotsCache.set(origin, null);
    return null;
  }
}

export async function isAllowedByRobots(url: string): Promise<boolean> {
  try {
    const parsed = new URL(url);
    const disallowed = await getDisallowedPaths(parsed.origin);
    if (!disallowed) return true;
    return ![...disallowed].some((prefix) => prefix === "/" || parsed.pathname.startsWith(prefix));
  } catch {
    return true;
  }
}

export async function fetchPage(url: string): Promise<FetchResult> {
  try {
    if (!(await isAllowedByRobots(url))) {
      return { ok: false, status: null, html: null, finalUrl: url, error: "disallowed_by_robots_txt" };
    }
    const res = await fetchWithTimeout(url, FETCH_TIMEOUT_MS);
    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("html")) {
      return { ok: res.ok, status: res.status, html: null, finalUrl: res.url || url, error: "non_html_content_type" };
    }
    const html = await res.text();
    return { ok: res.ok, status: res.status, html, finalUrl: res.url || url, error: res.ok ? null : `http_${res.status}` };
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown_error";
    return { ok: false, status: null, html: null, finalUrl: url, error: message };
  }
}

export { originOf };
