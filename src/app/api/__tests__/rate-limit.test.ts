import { describe, expect, test, beforeEach } from '@jest/globals';
import { NextRequest } from 'next/server';

import { checkRateLimit } from '../rate-limit';

function makeRequest(path: string, ip: string = '127.0.0.1'): NextRequest {
  return new NextRequest(`http://localhost${path}`, {
    headers: { 'x-forwarded-for': ip },
  });
}

describe('Rate Limiter', () => {
  // Each test uses a unique path to avoid cross-test state contamination
  let testPath: string;

  beforeEach(() => {
    testPath = `/api/test-${Date.now()}-${Math.random()}`;
  });

  test('should allow requests within limit', () => {
    const req = makeRequest(testPath);
    const result = checkRateLimit(req, { limit: 3, windowMs: 60_000 });
    expect(result).toBeNull();
  });

  test('should block requests exceeding limit', () => {
    for (let i = 0; i < 3; i++) {
      const req = makeRequest(testPath);
      checkRateLimit(req, { limit: 3, windowMs: 60_000 });
    }

    const req = makeRequest(testPath);
    const result = checkRateLimit(req, { limit: 3, windowMs: 60_000 });
    expect(result).not.toBeNull();
  });

  test('should track different IPs independently', () => {
    for (let i = 0; i < 3; i++) {
      checkRateLimit(makeRequest(testPath, '1.2.3.4'), { limit: 3, windowMs: 60_000 });
    }

    // Different IP should not be blocked
    const result = checkRateLimit(makeRequest(testPath, '5.6.7.8'), { limit: 3, windowMs: 60_000 });
    expect(result).toBeNull();
  });

  test('should return 429 status when rate limited', async () => {
    for (let i = 0; i < 2; i++) {
      checkRateLimit(makeRequest(testPath), { limit: 2, windowMs: 60_000 });
    }

    const result = checkRateLimit(makeRequest(testPath), { limit: 2, windowMs: 60_000 });
    expect(result).not.toBeNull();

    const json = await result!.json();
    expect(result!.status).toBe(429);
    expect(json.message).toBe('Too Many Requests');
  });
});
