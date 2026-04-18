import { describe, expect, test } from '@jest/globals';
import { renderDate } from '../event-thumbnail';
import { Lang } from '../../../components/types';

describe('renderDate', () => {
  // 2026-06-15T22:00:00Z is 2026-06-16T00:00 in Europe/Amsterdam (CEST).
  // Without a fixed timeZone, the rendered date would flip between the server
  // (UTC: "15 June") and the client (Amsterdam: "16 June"), triggering React
  // hydration error #418.
  const nearMidnightUtc = '2026-06-15T22:00:00.000Z';

  test('uses Europe/Amsterdam day for a late-UTC timestamp (nl)', () => {
    const result = renderDate(nearMidnightUtc, Lang.nl, false);
    expect(result).toContain('16');
    expect(result).toContain('juni');
    expect(result).toContain('00:00');
  });

  test('uses Europe/Amsterdam day for a late-UTC timestamp (be)', () => {
    const result = renderDate(nearMidnightUtc, Lang.be, false);
    expect(result).toContain('16');
    expect(result).toContain('чэрвеня');
    expect(result).toContain('00:00');
  });

  test('omits the year when renderYear is false', () => {
    const result = renderDate('2026-03-10T12:00:00.000Z', Lang.nl, false);
    expect(result).not.toContain('2026');
  });

  test('includes the year when renderYear is true', () => {
    const result = renderDate('2026-03-10T12:00:00.000Z', Lang.nl, true);
    expect(result).toContain('2026');
  });
});
