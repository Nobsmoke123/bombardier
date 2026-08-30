import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { AuthTokenResponse } from "@job-tracker/types";
import { api, ApiError } from "@/lib/api";
import { AUTH_COOKIE_NAME, authCookieOptions } from "@/lib/auth-cookie";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await api<AuthTokenResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    });

    const store = await cookies();
    store.set(AUTH_COOKIE_NAME, result.accessToken, authCookieOptions());

    return NextResponse.json({ user: result.user });
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
      { statusCode: 500, message: "Unable to sign in" },
      { status: 500 },
    );
  }
}
