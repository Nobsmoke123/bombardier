import { buildTimeline } from './dashboard.timeline.js';

describe('buildTimeline', () => {
  it('counts applications into a 14-day UTC series', () => {
    const now = new Date('2026-08-30T12:00:00.000Z');
    const timeline = buildTimeline(
      [
        { applicationDate: new Date('2026-08-30T09:00:00.000Z') },
        { applicationDate: new Date('2026-08-30T18:00:00.000Z') },
        { applicationDate: new Date('2026-08-29T01:00:00.000Z') },
        { applicationDate: null },
      ],
      now,
    );

    expect(timeline).toHaveLength(14);
    expect(timeline[13]).toEqual({ date: '2026-08-30', applied: 2 });
    expect(timeline[12]).toEqual({ date: '2026-08-29', applied: 1 });
    expect(timeline[0]?.date).toBe('2026-08-17');
  });
});
