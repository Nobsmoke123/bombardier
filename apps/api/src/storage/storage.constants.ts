export const STORAGE_FOLDERS = ['resumes', 'imports'] as const;
export type StorageFolder = (typeof STORAGE_FOLDERS)[number];

export const UPLOAD_EXPIRES_IN = 5 * 60;
export const VIEW_EXPIRES_IN = 15 * 60;

export const FOLDER_RULES: Record<
  StorageFolder,
  { extension: string; contentTypes: readonly string[] }
> = {
  resumes: {
    extension: 'pdf',
    contentTypes: ['application/pdf'],
  },
  imports: {
    extension: 'csv',
    contentTypes: ['text/csv', 'application/csv'],
  },
};
