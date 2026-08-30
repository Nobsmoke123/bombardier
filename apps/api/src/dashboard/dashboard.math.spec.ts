import { rate, utcDayRange } from './dashboard.math.js';

describe('dashboard.math', () => {
  it('returns 0 when the denominator is 0', () => {
    expect(rate(4, 0)).toBe(0);
  });

  it('rounds rates to four decimals', () => {
    expect(rate(1, 3)).toBe(0.3333);
  });

  it('builds a UTC day range', () => {
    const { start, end } = utcDayRange(new Date('2026-08-30T15:22:00.000Z'));
    expect(start.toISOString()).toBe('2026-08-30T00:00:00.000Z');
    expect(end.toISOString()).toBe('2026-08-31T00:00:00.000Z');
  });
});
