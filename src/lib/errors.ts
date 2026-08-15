/**
 * File: src/lib/errors.ts
 * Student: Group 12
 * Date: August 15, 2026
 * Course: Full-Stack Web Applications — SAIT
 *
 * Description:
 * Converts Supabase, network, and Auth errors into short messages that are
 * safe to show in the UI. Raw stack traces and internal Postgres details are
 * never forwarded to the browser. Callers still log the original error on
 * the server when they need it for debugging.
 *
 * Inputs: Unknown thrown values or Supabase error objects.
 * Processing: Matches common Auth/PostgREST codes and falls back to a generic line.
 * Outputs: A user-facing string with no sensitive internals.
 */

type MaybeError = {
  message?: string;
  code?: string;
  status?: number;
};

export function toUserMessage(error: unknown, fallback: string): string {
  if (!error) {
    return fallback;
  }

  if (typeof error === "string" && error.trim()) {
    return sanitize(error, fallback);
  }

  const candidate = error as MaybeError;
  const code = candidate.code ?? "";
  const message = candidate.message ?? "";

  if (code === "23505" || /duplicate/i.test(message)) {
    return "That record already exists. Check the title and try again.";
  }
  if (code === "42501" || /row-level security|permission denied/i.test(message)) {
    return "You do not have permission to change the catalogue.";
  }
  if (code === "PGRST205" || /could not find the table/i.test(message)) {
    return "The movies table is missing. Open supabase/schema.sql in the Supabase SQL Editor, run the whole script, then reload this page.";
  }
  if (code === "PGRST116" || /0 rows/i.test(message)) {
    return "That movie could not be found. It may have already been removed.";
  }
  if (code === "22P02" || /invalid input syntax/i.test(message)) {
    return "The request contained an invalid movie id.";
  }
  if (/failed to fetch|network|fetch/i.test(message)) {
    return "The catalogue could not be reached. Check your connection and try again.";
  }

  return sanitize(message, fallback);
}

export function toAuthMessage(error: unknown, fallback: string): string {
  const candidate = error as MaybeError;
  const message = (candidate.message ?? "").toLowerCase();

  if (/invalid login credentials/.test(message)) {
    return "Email or password is incorrect.";
  }
  if (/email not confirmed/.test(message)) {
    return "This account has not confirmed its email yet. In Supabase open Authentication → Providers → Email and turn Confirm email off, then sign in with the same email and password.";
  }
  if (/user already registered/.test(message)) {
    return "An account with that email already exists. Sign in instead.";
  }
  if (/database error saving new user/.test(message)) {
    return "Sign-up could not finish because the profiles table is missing. Open supabase/schema.sql in the Supabase SQL Editor, run the whole script, then try again.";
  }
  if (/password/.test(message) && /least|characters|weak/.test(message)) {
    return "Choose a stronger password (at least 8 characters).";
  }
  if (/rate limit|too many/.test(message)) {
    return "Too many attempts. Wait a moment and try again.";
  }

  return toUserMessage(error, fallback);
}

function sanitize(message: string, fallback: string): string {
  if (!message.trim()) {
    return fallback;
  }
  if (/stack|sql|permission denied for schema|jwt/i.test(message) && message.length > 140) {
    return fallback;
  }
  return message.length > 180 ? fallback : message;
}
