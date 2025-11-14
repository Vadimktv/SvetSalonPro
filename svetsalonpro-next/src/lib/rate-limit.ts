const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;

const ipStore = new Map<string, { count: number; timestamp: number }>();

export function isRateLimited(ip: string) {
  const now = Date.now();
  const record = ipStore.get(ip);

  if (!record) {
    ipStore.set(ip, { count: 1, timestamp: now });
    return false;
  }

  if (now - record.timestamp > RATE_LIMIT_WINDOW_MS) {
    ipStore.set(ip, { count: 1, timestamp: now });
    return false;
  }

  record.count += 1;
  ipStore.set(ip, record);

  return record.count > RATE_LIMIT_MAX_REQUESTS;
}
