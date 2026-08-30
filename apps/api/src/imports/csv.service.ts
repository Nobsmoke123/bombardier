import { Injectable } from '@nestjs/common';
import { parse } from 'fast-csv';
import { Readable } from 'node:stream';

export type ParsedCompanyRow = {
  name: string;
  normalizedName: string;
  website: string | null;
  industry: string | null;
};

export type ParsedCsvResult = {
  rows: ParsedCompanyRow[];
  totalRows: number;
  uniqueRows: number;
  duplicatesRemoved: number;
};

const NAME_HEADERS = ['name', 'company', 'company_name', 'companyname'];
const WEBSITE_HEADERS = ['website', 'url', 'domain'];
const INDUSTRY_HEADERS = ['industry', 'sector'];

@Injectable()
export class CsvService {
  parseCompanies(buffer: Buffer): Promise<ParsedCsvResult> {
    const csv = stripBom(buffer.toString('utf8'));

    return new Promise((resolve, reject) => {
      const seen = new Map<string, ParsedCompanyRow>();
      let totalRows = 0;

      Readable.from(csv)
        .pipe(parse({ headers: normalizeHeaders, trim: true, ignoreEmpty: true }))
        .on('error', reject)
        .on('data', (row: Record<string, string>) => {
          const name = pick(row, NAME_HEADERS);
          if (!name) {
            return;
          }

          totalRows += 1;
          const normalizedName = normalizeName(name);
          if (seen.has(normalizedName)) {
            return;
          }

          seen.set(normalizedName, {
            name,
            normalizedName,
            website: pick(row, WEBSITE_HEADERS),
            industry: pick(row, INDUSTRY_HEADERS),
          });
        })
        .on('end', () => {
          const rows = [...seen.values()];
          resolve({
            rows,
            totalRows,
            uniqueRows: rows.length,
            duplicatesRemoved: totalRows - rows.length,
          });
        });
    });
  }
}

export function normalizeName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, ' ');
}

function pick(row: Record<string, string>, keys: string[]): string | null {
  for (const key of keys) {
    const value = row[key]?.trim();
    if (value) {
      return value;
    }
  }
  return null;
}

function normalizeHeaders(headers: (string | undefined | null)[]): string[] {
  return headers.map((header) =>
    (header ?? '')
      .replace(/^\uFEFF/, '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_'),
  );
}

function stripBom(value: string): string {
  return value.replace(/^\uFEFF/, '');
}
