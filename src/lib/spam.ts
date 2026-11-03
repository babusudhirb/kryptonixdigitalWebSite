/**
 * Spam protection for the two public form endpoints. Server only.
 *
 * Two layers, both in memory:
 *  - per-IP limit: stops one client hammering a form;
 *  - per-route ceiling: a backstop for the Gmail account's daily send quota,
 *    since the client IP comes from a proxy header and a bot can vary it.
 *
 * In memory means the counters reset when the Node process restarts and are
 * not shared between processes. That is fine for a single `next start`
 * instance; behind several instances each one keeps its own counts.
 */

const MINUTE = 60_000;

const LIMITS = {
  /** Same client, same form: generous for a person retrying, tight for a script. */
  perIp: { max: 5, windowMs: 10 * MINUTE },
  /** Everyone, same form. Far above real traffic for this site. */
  perRoute: { max: 20, windowMs: 60 * MINUTE },
} as const;

type Window = { count: number; resetAt: number };
const windows = new Map<string, Window>();

/** Fixed-window counter. Returns ms until the window resets when over the limit. */
function hit(key: string, max: number, windowMs: number, now: number): number | null {
  const w = windows.get(key);
  if (!w || now >= w.resetAt) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }
  w.count += 1;
  return w.count > max ? w.resetAt - now : null;
}

function prune(now: number) {
  if (windows.size < 1000) return;
  for (const [key, w] of windows) if (now >= w.resetAt) windows.delete(key);
}

/**
 * The visitor's IP as reported by the reverse proxy in front of `next start`.
 * Null when no proxy header is present: those requests skip the per-IP limit
 * rather than all sharing one bucket and locking each other out.
 */
function clientIp(request: Request): string | null {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip")?.trim() || null;
}

/** Null when the request may proceed, otherwise seconds to wait. */
export function rateLimit(request: Request, route: string): number | null {
  const now = Date.now();
  prune(now);

  const ip = clientIp(request);
  const ipWait = ip ? hit(`${route}:ip:${ip}`, LIMITS.perIp.max, LIMITS.perIp.windowMs, now) : null;
  // Only count toward the route ceiling once the per-IP check passes, so one
  // abusive client cannot spend everyone else's allowance.
  const routeWait =
    ipWait === null ? hit(`${route}:all`, LIMITS.perRoute.max, LIMITS.perRoute.windowMs, now) : null;

  const wait = ipWait ?? routeWait;
  return wait === null ? null : Math.ceil(wait / 1000);
}
