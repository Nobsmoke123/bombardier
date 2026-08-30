import type { ApiErrorResponse } from "@job-tracker/types";

export class ApiError extends Error {
  statusCode: number;
  errors?: string[];

  constructor(payload: ApiErrorResponse) {
    super(payload.message);
    this.name = "ApiError";
    this.statusCode = payload.statusCode;
    this.errors = payload.errors;
  }
}

function apiBase() {
  if (typeof window === "undefined") {
    return process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
  }
  return "/api/backend";
}

type ApiOptions = RequestInit & {
  token?: string;
};

export async function api<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { token, headers, ...init } = options;
  const response = await fetch(`${apiBase()}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  const text = await response.text();
  const data: unknown = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const payload = data as ApiErrorResponse | null;
    throw new ApiError({
      statusCode: payload?.statusCode ?? response.status,
      message: payload?.message ?? "Request failed",
      errors: payload?.errors,
    });
  }

  return data as T;
}
