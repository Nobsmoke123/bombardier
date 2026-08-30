export type UserPublic = {
  id: string;
  name: string;
  email: string;
  dailyTarget: number;
  createdAt: string;
};

export type AuthSuccessResponse = {
  user: UserPublic;
};

export type AuthTokenResponse = {
  user: UserPublic;
  accessToken: string;
};

export type ApiErrorResponse = {
  statusCode: number;
  message: string;
  errors?: string[];
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type StorageFolder = "resumes" | "imports";

export type PresignUploadRequest = {
  folder: StorageFolder;
  filename: string;
  contentType: string;
};

export type PresignUploadResponse = {
  uploadUrl: string;
  key: string;
  headers: Record<string, string>;
  expiresIn: number;
};

export type PresignViewResponse = {
  viewUrl: string;
  key: string;
  expiresIn: number;
};

export const RESUME_FOCUSES = [
  "BACKEND",
  "FULLSTACK",
  "FRONTEND",
  "DEVOPS",
] as const;

export type ResumeFocus = (typeof RESUME_FOCUSES)[number];

export type ResumePublic = {
  id: string;
  title: string;
  focus: ResumeFocus;
  fileKey: string;
  createdAt: string;
};

export type CreateResumeRequest = {
  title: string;
  focus: ResumeFocus;
  fileKey: string;
};

export const CSV_IMPORT_STATUSES = ["PENDING", "COMPLETED", "FAILED"] as const;
export type CsvImportStatus = (typeof CSV_IMPORT_STATUSES)[number];

export type CsvImportPublic = {
  id: string;
  filename: string;
  objectKey: string;
  totalRows: number;
  uniqueRows: number;
  duplicatesRemoved: number;
  status: CsvImportStatus;
  error: string | null;
  createdAt: string;
};

export type CreateCsvImportRequest = {
  filename: string;
  objectKey: string;
};

export const APPLICATION_STATUSES = [
  "NOT_APPLIED",
  "APPLIED",
  "HR_STAGE",
  "TECHNICAL",
  "FINAL_INTERVIEW",
  "ACCEPTED",
  "REJECTED",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export type ApplicationPublic = {
  id: string;
  role: string;
  resumeId: string | null;
  resumeTitle: string | null;
  coverLetter: string | null;
  linkedinMessage: string | null;
  applied: boolean;
  linkedinOutreach: boolean;
  connectionCount: number;
  applicationDate: string | null;
  status: ApplicationStatus;
};

export type CompanyPublic = {
  id: string;
  name: string;
  website: string | null;
  industry: string | null;
  createdAt: string;
  application: ApplicationPublic;
};

export type CompanyListResponse = {
  items: CompanyPublic[];
  page: number;
  pageSize: number;
  total: number;
};

export type UpdateCompanyRequest = {
  role?: string;
  resumeId?: string | null;
  coverLetter?: string | null;
  linkedinMessage?: string | null;
  status?: ApplicationStatus;
  applicationDate?: string | null;
  linkedinOutreach?: boolean;
};
