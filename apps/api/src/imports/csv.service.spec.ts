import { CsvService, normalizeName } from './csv.service.js';

describe('CsvService', () => {
  const csv = new CsvService();

  it('normalizes names with trim, lowercase, and collapsed whitespace', () => {
    expect(normalizeName('  Acme   Robotics  ')).toBe('acme robotics');
  });

  it('parses, maps headers, and deduplicates in-file repeats', async () => {
    const buffer = Buffer.from(
      [
        'Company Name,Website,Industry',
        'Acme Inc,https://acme.com,Software',
        'acme   inc,https://acme.com/careers,Software',
        'Globex,https://globex.test,Energy',
        ',https://ignored.test,None',
      ].join('\n'),
    );

    const result = await csv.parseCompanies(buffer);

    expect(result.totalRows).toBe(3);
    expect(result.uniqueRows).toBe(2);
    expect(result.duplicatesRemoved).toBe(1);
    expect(result.rows.map((row) => row.normalizedName)).toEqual([
      'acme inc',
      'globex',
    ]);
    expect(result.rows[0]?.name).toBe('Acme Inc');
    expect(result.rows[0]?.website).toBe('https://acme.com');
  });
});
