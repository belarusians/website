import { describe, expect, test } from '@jest/globals';
import { parseDonation } from '../donate';

describe('parseDonation', () => {
  test('parses valid donation without newsletterOptin', () => {
    const result = parseDonation({ amount: 10, recurring: true });
    expect(result).toEqual({ amount: 10, recurring: true });
    expect(result.newsletterOptin).toBeUndefined();
  });

  test('coerces amount from string', () => {
    const result = parseDonation({ amount: '20', recurring: false });
    expect(result.amount).toBe(20);
  });

  test('accepts newsletterOptin as boolean true', () => {
    const result = parseDonation({ amount: 5, recurring: true, newsletterOptin: true });
    expect(result.newsletterOptin).toBe(true);
  });

  test('accepts newsletterOptin as boolean false', () => {
    const result = parseDonation({ amount: 5, recurring: true, newsletterOptin: false });
    expect(result.newsletterOptin).toBe(false);
  });

  test('coerces newsletterOptin from string "true"', () => {
    const result = parseDonation({ amount: 5, recurring: true, newsletterOptin: 'true' });
    expect(result.newsletterOptin).toBe(true);
  });

  test('coerces newsletterOptin from string "false"', () => {
    const result = parseDonation({ amount: 5, recurring: true, newsletterOptin: 'false' });
    expect(result.newsletterOptin).toBe(false);
  });

  test('newsletterOptin is optional - absent field is valid', () => {
    const result = parseDonation({ amount: 5, recurring: false });
    expect(result).toEqual({ amount: 5, recurring: false });
  });

  test('non-recurring donation ignores newsletterOptin at schema level', () => {
    const result = parseDonation({ amount: 5, recurring: false, newsletterOptin: true });
    expect(result.newsletterOptin).toBe(true);
    // The schema accepts it regardless of recurring; the route logic ignores it for non-recurring
  });

  test('throws on invalid amount', () => {
    expect(() => parseDonation({ amount: 0, recurring: false })).toThrow();
  });

  test('throws on amount exceeding max', () => {
    expect(() => parseDonation({ amount: 1001, recurring: false })).toThrow();
  });

  test('throws on missing amount', () => {
    expect(() => parseDonation({ recurring: false })).toThrow();
  });
});
