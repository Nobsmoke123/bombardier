export const AUTH_COOKIE_NAME = "access_token";

const SEVEN_DAYS = 60 * 60 * 24 * 7;

export function authCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SEVEN_DAYS,
  };
}
