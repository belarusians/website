import { describe, expect, test } from '@jest/globals';
import { generateUnsubscribeToken, normalizeEmail } from '../subscriptions/service';

describe('generateUnsubscribeToken', () => {
  test('should return a base64url string of expected length', () => {
    const token = generateUnsubscribeToken();
    // 32 bytes in base64url = 43 characters (no padding with base64url)
    expect(token).toHaveLength(43);
  });

  test('should only contain url-safe characters', () => {
    const token = generateUnsubscribeToken();
    expect(token).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  test('should generate unique tokens across multiple calls', () => {
    const tokens = new Set(Array.from({ length: 50 }, () => generateUnsubscribeToken()));
    expect(tokens.size).toBe(50);
  });
});

describe('normalizeEmail', () => {
  test('should lowercase mixed case email', () => {
    expect(normalizeEmail('Test@Example.COM')).toBe('test@example.com');
  });

  test('should trim surrounding whitespace', () => {
    expect(normalizeEmail('  user@example.com  ')).toBe('user@example.com');
  });

  test('should handle already normalised email', () => {
    expect(normalizeEmail('user@example.com')).toBe('user@example.com');
  });

  test('should handle whitespace and mixed case together', () => {
    expect(normalizeEmail('  User@Test.Org  ')).toBe('user@test.org');
  });
});
