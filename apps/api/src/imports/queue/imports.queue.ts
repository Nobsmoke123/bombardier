export const CSV_IMPORT_QUEUE = 'csv-imports';
export const CSV_IMPORT_JOB = 'process';

export type CsvImportJobData = {
  importId: string;
  userId: string;
};
