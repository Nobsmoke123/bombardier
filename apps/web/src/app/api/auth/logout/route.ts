import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { api } from "@/lib/api";
import { AUTH_COOKIE_NAME, authCookieOptions } from "@/lib/auth-cookie";

export async function POST() {
  const store = await cookies();
  const token = store.get(AUTH_COOKIE_NAME)?.value;

  try {
    await api("/auth/logout", {
      method: "POST",
      token,
    });
  } catch {
    // Always clear the browser cookie even if the API is unreachable.
  }

  store.set(AUTH_COOKIE_NAME, "", { ...authCookieOptions(), maxAge: 0 });
  return NextResponse.json({ success: true });
}
