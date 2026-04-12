import { describe, expect, test } from '@jest/globals';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const nextConfig = require('../../next.config.js');

describe('Security Headers', () => {
  let headers: { key: string; value: string }[];

  beforeAll(async () => {
    const headerConfig = await nextConfig.headers();
    headers = headerConfig[0].headers;
  });

  const requiredHeaders = [
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
    { key: 'X-XSS-Protection', value: '1; mode=block' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
    { key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
    { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
    { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
  ];

  test.each(requiredHeaders)('should include $key header', ({ key, value }) => {
    const header = headers.find((h: { key: string; value: string }) => h.key === key);
    expect(header).toBeDefined();
    expect(header!.value).toBe(value);
  });

  test('should include Permissions-Policy header', () => {
    const header = headers.find((h: { key: string; value: string }) => h.key === 'Permissions-Policy');
    expect(header).toBeDefined();
    expect(header!.value).toContain('camera=()');
    expect(header!.value).toContain('microphone=()');
    expect(header!.value).toContain('geolocation=()');
  });

  test('should include Content-Security-Policy header', () => {
    const header = headers.find((h: { key: string; value: string }) => h.key === 'Content-Security-Policy');
    expect(header).toBeDefined();
    expect(header!.value).toContain("default-src 'self'");
    expect(header!.value).toContain('upgrade-insecure-requests');
  });

  test('CSP should not include unsafe-eval', () => {
    const header = headers.find((h: { key: string; value: string }) => h.key === 'Content-Security-Policy');
    expect(header).toBeDefined();
    expect(header!.value).not.toContain('unsafe-eval');
  });

  test('should apply headers to all routes', async () => {
    const headerConfig = await nextConfig.headers();
    expect(headerConfig[0].source).toBe('/(.*)');
  });
});
