import { describe, expect, test } from '@jest/globals';
import { isEligibleForBackfill, deduplicateEmails } from '../../../scripts/backfill-helpers';

describe('isEligibleForBackfill', () => {
  test('active subscription with >= 2 paid invoices is eligible', () => {
    expect(isEligibleForBackfill({ status: 'active' }, 2)).toBe(true);
  });

  test('active subscription with many paid invoices is eligible', () => {
    expect(isEligibleForBackfill({ status: 'active' }, 10)).toBe(true);
  });

  test('active subscription with 1 paid invoice is not eligible', () => {
    expect(isEligibleForBackfill({ status: 'active' }, 1)).toBe(false);
  });

  test('active subscription with 0 paid invoices is not eligible', () => {
    expect(isEligibleForBackfill({ status: 'active' }, 0)).toBe(false);
  });

  test('past_due subscription is not eligible', () => {
    expect(isEligibleForBackfill({ status: 'past_due' }, 5)).toBe(false);
  });

  test('canceled subscription is not eligible', () => {
    expect(isEligibleForBackfill({ status: 'canceled' }, 3)).toBe(false);
  });

  test('unpaid subscription is not eligible', () => {
    expect(isEligibleForBackfill({ status: 'unpaid' }, 2)).toBe(false);
  });

  test('incomplete_expired subscription is not eligible', () => {
    expect(isEligibleForBackfill({ status: 'incomplete_expired' }, 4)).toBe(false);
  });
});

describe('deduplicateEmails', () => {
  test('removes duplicate emails', () => {
    expect(deduplicateEmails(['a@b.com', 'a@b.com', 'c@d.com'])).toEqual(['a@b.com', 'c@d.com']);
  });

  test('normalizes case before deduplication', () => {
    expect(deduplicateEmails(['A@B.COM', 'a@b.com'])).toEqual(['a@b.com']);
  });

  test('trims whitespace before deduplication', () => {
    expect(deduplicateEmails(['  a@b.com  ', 'a@b.com'])).toEqual(['a@b.com']);
  });

  test('preserves order of first occurrence', () => {
    expect(deduplicateEmails(['c@d.com', 'a@b.com', 'c@d.com'])).toEqual(['c@d.com', 'a@b.com']);
  });

  test('filters out empty strings', () => {
    expect(deduplicateEmails(['a@b.com', '', '  ', 'c@d.com'])).toEqual(['a@b.com', 'c@d.com']);
  });

  test('handles empty array', () => {
    expect(deduplicateEmails([])).toEqual([]);
  });
});
