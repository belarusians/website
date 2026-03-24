import { NextRequest } from 'next/server';
import { sendError } from './utils';

interface RateLimitConfig {
  /** Max requests per window */
  limit: number;
  /** Window size in milliseconds */
  windowMs: number;
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory store — resets on cold start. Sufficient for a low-traffic NGO site.
// For multi-instance deployments, replace with a Redis-backed solution.
const store = new Map<string, RateLimitEntry>();

function getIp(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
}

export function checkRateLimit(req: NextRequest, config: RateLimitConfig): ReturnType<typeof sendError> | null {
  const key = `${req.nextUrl.pathname}:${getIp(req)}`;
  const now = Date.now();

  const entry = store.get(key);
  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + config.windowMs });
    return null;
  }

  if (entry.count >= config.limit) {
    return sendError(429, 'Too Many Requests');
  }

  entry.count++;
  return null;
}
