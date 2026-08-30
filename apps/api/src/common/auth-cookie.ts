import type { CookieOptions } from 'express';

export const AUTH_COOKIE_NAME = 'access_token';

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export function authCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: 'lax',
    path: '/',
    maxAge: SEVEN_DAYS_MS,
  };
}
