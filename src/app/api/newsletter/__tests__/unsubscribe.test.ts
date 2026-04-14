import { describe, expect, test } from '@jest/globals';
import { tokenSchema } from '../unsubscribe/route';

describe('tokenSchema', () => {
  test('accepts a valid base64url token', () => {
    const result = tokenSchema.safeParse({ token: 'abc123_DEF-456_xyz' });
    expect(result.success).toBe(true);
  });

  test('accepts a 43-character token (32 bytes base64url)', () => {
    const token = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmno';
    const result = tokenSchema.safeParse({ token });
    expect(result.success).toBe(true);
  });

  test('rejects missing token field', () => {
    const result = tokenSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  test('rejects empty string token', () => {
    const result = tokenSchema.safeParse({ token: '' });
    expect(result.success).toBe(false);
  });

  test('rejects token with spaces', () => {
    const result = tokenSchema.safeParse({ token: 'abc def' });
    expect(result.success).toBe(false);
  });

  test('rejects token with special characters', () => {
    const result = tokenSchema.safeParse({ token: 'abc+def/ghi=' });
    expect(result.success).toBe(false);
  });

  test('rejects non-string token', () => {
    const result = tokenSchema.safeParse({ token: 12345 });
    expect(result.success).toBe(false);
  });

  test('rejects null token', () => {
    const result = tokenSchema.safeParse({ token: null });
    expect(result.success).toBe(false);
  });

  test('rejects undefined token value', () => {
    const result = tokenSchema.safeParse({ token: undefined });
    expect(result.success).toBe(false);
  });

  test('accepts token with only underscores and hyphens', () => {
    const result = tokenSchema.safeParse({ token: '___---' });
    expect(result.success).toBe(true);
  });
});
