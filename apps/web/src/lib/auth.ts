import type {
  AuthSuccessResponse,
  LoginRequest,
  RegisterRequest,
} from "@job-tracker/types";

export async function loginRequest(body: LoginRequest): Promise<AuthSuccessResponse> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parseAuthResponse(response);
}

export async function registerRequest(
  body: RegisterRequest,
): Promise<AuthSuccessResponse> {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parseAuthResponse(response);
}

export async function logoutRequest(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST" });
}

export async function meRequest(): Promise<AuthSuccessResponse> {
  const response = await fetch("/api/auth/me", { method: "GET" });
  return parseAuthResponse(response);
}

async function parseAuthResponse(response: Response): Promise<AuthSuccessResponse> {
  const data = (await response.json()) as AuthSuccessResponse & {
    message?: string;
    errors?: string[];
  };

  if (!response.ok) {
    const error = new Error(data.message ?? "Request failed") as Error & {
      errors?: string[];
    };
    error.errors = data.errors;
    throw error;
  }

  return { user: data.user };
}
