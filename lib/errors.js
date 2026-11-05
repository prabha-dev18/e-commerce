export class ApiError extends Error { constructor(message, status = 400) { super(message); this.status = status; } }

// Fixed-window in-memory rate limiter. Use Redis/Upstash when running several server instances.
const hits = global._hits || (global._hits = new Map());
export function rateLimit(key, max = 60, windowMs = 60_000) {
  const now = Date.now();
  const rec = hits.get(key);
  if (!rec || now > rec.reset) { hits.set(key, { count: 1, reset: now + windowMs }); return; }
  if (++rec.count > max) throw new ApiError('Too many requests. Please wait a moment and try again.', 429);
}
