// TODO: Reemplazar por rate limit distribuido (Upstash/Redis) en producción.
const hits = new Map<string, { count: number; ts: number }>();

export function basicRateLimit(key: string, limit = 10, windowMs = 60_000): boolean {
  const now = Date.now();
  const item = hits.get(key);
  if (!item || now - item.ts > windowMs) {
    hits.set(key, { count: 1, ts: now });
    return true;
  }
  if (item.count >= limit) return false;
  item.count += 1;
  return true;
}
