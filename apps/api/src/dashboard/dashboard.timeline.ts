export type DatedApplication = {
  applicationDate: Date | null;
};

export function buildTimeline(
  applications: DatedApplication[],
  now = new Date(),
  days = 14,
) {
  const start = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
  start.setUTCDate(start.getUTCDate() - (days - 1));

  return Array.from({ length: days }, (_, index) => {
    const day = new Date(start);
    day.setUTCDate(start.getUTCDate() + index);
    const next = new Date(day);
    next.setUTCDate(day.getUTCDate() + 1);
    const applied = applications.filter((application) => {
      const date = application.applicationDate;
      return date && date >= day && date < next;
    }).length;

    return {
      date: day.toISOString().slice(0, 10),
      applied,
    };
  });
}
