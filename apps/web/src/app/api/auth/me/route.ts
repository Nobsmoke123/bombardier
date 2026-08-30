import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { AuthSuccessResponse } from "@job-tracker/types";
import { api, ApiError } from "@/lib/api";
import { AUTH_COOKIE_NAME } from "@/lib/auth-cookie";

export async function GET() {
  const store = await cookies();
  const token = store.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json(
      { statusCode: 401, message: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const result = await api<AuthSuccessResponse>("/auth/me", { token });
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        {
          statusCode: error.statusCode,
          message: error.message,
          errors: error.errors,
        },
        { status: error.statusCode },
      );
    }
    return NextResponse.json(
      { statusCode: 500, message: "Unable to load session" },
      { status: 500 },
    );
  }
}
