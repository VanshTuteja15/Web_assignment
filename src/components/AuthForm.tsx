/**
 * File: src/components/AuthForm.tsx
 * Student: Vansh Tuteja
 * Date: August 12, 2026
 * Course: Full-Stack Web Applications — SAIT
 *
 * Description:
 * Sign-in and sign-up form. Fields are labelled, errors are announced, and
 * the password is never echoed back. The Server Action performs the real
 * Auth call; this component only collects input and displays the result.
 *
 * Inputs: mode (login or signup), a Server Action, and an optional next path.
 * Processing: Submits FormData through useActionState.
 * Outputs: An authentication form with inline validation messages.
 */

"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { AuthFormState } from "@/actions/auth";
import { StatusBanner } from "@/components/StatusBanner";

type AuthFormProps = {
  mode: "login" | "signup";
  action: (state: AuthFormState, formData: FormData) => Promise<AuthFormState>;
  nextPath?: string;
};

const empty: AuthFormState = { message: null };

export function AuthForm({ mode, action, nextPath }: AuthFormProps) {
  const [state, formAction, pending] = useActionState(action, empty);
  const isSignup = mode === "signup";

  return (
    <form action={formAction} className="card-surface space-y-5 p-5 sm:p-8" noValidate>
      {nextPath ? <input type="hidden" name="next" value={nextPath} /> : null}
      {state.message ? (
        <StatusBanner
          tone={state.message.toLowerCase().includes("account created") ? "info" : "error"}
          message={state.message}
        />
      ) : null}

      <div>
        <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-[0.16em] text-secondary">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="field"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-[0.16em] text-secondary">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete={isSignup ? "new-password" : "current-password"}
          required
          minLength={isSignup ? 8 : undefined}
          className="field"
        />
        {isSignup ? (
          <p className="mt-1 text-xs text-muted">At least 8 characters.</p>
        ) : null}
      </div>

      {isSignup ? (
        <div>
          <label htmlFor="confirmPassword" className="block text-xs font-semibold uppercase tracking-[0.16em] text-secondary">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            className="field"
          />
        </div>
      ) : null}

      <button type="submit" disabled={pending} className="btn btn-primary w-full">
        {pending ? "Please wait…" : isSignup ? "Create account" : "Sign in"}
      </button>

      <p className="text-center text-sm text-secondary">
        {isSignup ? (
          <>
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-gold-soft hover:text-gold cursor-pointer">
              Sign in
            </Link>
          </>
        ) : (
          <>
            New to IMR?{" "}
            <Link href="/signup" className="font-semibold text-gold-soft hover:text-gold cursor-pointer">
              Create an account
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
