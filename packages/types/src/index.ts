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
