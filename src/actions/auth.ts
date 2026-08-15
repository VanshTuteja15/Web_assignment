/**
 * File: src/actions/auth.ts
 * Student: Group 12
 * Date: August 15, 2026
 * Course: Full-Stack Web Applications — SAIT
 *
 * Description:
 * Server Actions for sign-up, sign-in, and sign-out. Validation runs on the
 * server so empty or malformed credentials never reach Supabase. After a
 * successful sign-in the visitor is sent to the catalogue (or the `next`
 * path if it is a safe internal URL). Sign-up writes a viewer profile in
 * case the database trigger has not been installed yet.
 *
 * Inputs: FormData from the login and sign-up forms.
 * Processing: Validates fields, calls Supabase Auth, ensures a profile exists.
 * Outputs: Redirects on success; returns a user-facing error string on failure.
 */

"use server";

import { redirect } from "next/navigation";
import { toAuthMessage } from "@/lib/errors";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { validateEmail, validatePassword } from "@/lib/validation";

export type AuthFormState = {
  message: string | null;
};

function safeNextPath(raw: FormDataEntryValue | null): string {
  const value = typeof raw === "string" ? raw : "";
  if (value.startsWith("/") && !value.startsWith("//") && !value.startsWith("/\\")) {
    return value;
  }
  return "/movies";
}

async function ensureViewerProfile(userId: string, email: string) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return;
  }

  await supabase.from("profiles").upsert(
    { id: userId, email, role: "viewer" },
    { onConflict: "id", ignoreDuplicates: true },
  );
}

export async function signInAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = safeNextPath(formData.get("next"));

  const emailError = validateEmail(email);
  const passwordError = validatePassword(password, { isNewAccount: false });
  if (emailError || passwordError) {
    return { message: emailError ?? passwordError };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { message: "Supabase is not configured. Add credentials to .env.local first." };
  }

  // --- Sign in with email and password ---
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });

  if (error) {
    return { message: toAuthMessage(error, "Sign-in failed. Check your email and password.") };
  }
  if (!data.user) {
    return { message: "Sign-in failed. No user was returned." };
  }

  await ensureViewerProfile(data.user.id, data.user.email ?? email.trim().toLowerCase());
  redirect(next);
}

export async function signUpAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirmPassword") ?? "");

  const emailError = validateEmail(email);
  const passwordError = validatePassword(password, { isNewAccount: true });
  if (emailError || passwordError) {
    return { message: emailError ?? passwordError };
  }
  if (password !== confirm) {
    return { message: "Passwords do not match." };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { message: "Supabase is not configured. Add credentials to .env.local first." };
  }

  const normalisedEmail = email.trim().toLowerCase();

  // --- Create a viewer account ---
  const { data, error } = await supabase.auth.signUp({
    email: normalisedEmail,
    password,
  });

  if (error) {
    return { message: toAuthMessage(error, "Sign-up failed. Try a different email.") };
  }

  let user = data.user;
  let session = data.session;

  if (!session) {
    const signedIn = await supabase.auth.signInWithPassword({
      email: normalisedEmail,
      password,
    });
    if (signedIn.error || !signedIn.data.session) {
      return {
        message: toAuthMessage(
          signedIn.error ?? { message: "email not confirmed" },
          "Account created, but it could not be signed in yet. Turn Confirm email off under Authentication → Providers → Email, then sign in.",
        ),
      };
    }
    user = signedIn.data.user;
    session = signedIn.data.session;
  }

  if (user) {
    await ensureViewerProfile(user.id, user.email ?? normalisedEmail);
  }

  if (!session) {
    return { message: "Account created. Sign in with the same email and password." };
  }

  redirect("/movies");
}

export async function signOutAction() {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  redirect("/");
}
