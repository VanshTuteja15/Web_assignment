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
    <form action={formAction} className="space-y-5 rounded-sm border border-[var(--line)] bg-panel p-5 sm:p-8" noValidate>
      {nextPath ? <input type="hidden" name="next" value={nextPath} /> : null}
      {state.message ? (
        <StatusBanner
          tone={state.message.toLowerCase().includes("account created") ? "info" : "error"}
          message={state.message}
        />
      ) : null}

      <div>
        <label htmlFor="email" className="block text-xs uppercase tracking-[0.16em] text-muted">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="mt-2 min-h-11 w-full rounded-sm border border-[var(--line)] bg-booth px-3 text-ivory"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-xs uppercase tracking-[0.16em] text-muted">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete={isSignup ? "new-password" : "current-password"}
          required
          minLength={isSignup ? 8 : undefined}
          className="mt-2 min-h-11 w-full rounded-sm border border-[var(--line)] bg-booth px-3 text-ivory"
        />
        {isSignup ? (
          <p className="mt-1 text-xs text-muted">At least 8 characters.</p>
        ) : null}
      </div>

      {isSignup ? (
        <div>
          <label htmlFor="confirmPassword" className="block text-xs uppercase tracking-[0.16em] text-muted">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            className="mt-2 min-h-11 w-full rounded-sm border border-[var(--line)] bg-booth px-3 text-ivory"
          />
        </div>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="min-h-11 w-full cursor-pointer rounded-sm bg-gold text-sm uppercase tracking-[0.16em] text-booth hover:bg-gold-soft transition-colors duration-200 disabled:opacity-60"
      >
        {pending ? "Please wait…" : isSignup ? "Create account" : "Sign in"}
      </button>

      <p className="text-center text-sm text-muted">
        {isSignup ? (
          <>
            Already have an account?{" "}
            <Link href="/login" className="text-gold hover:text-gold-soft cursor-pointer">
              Sign in
            </Link>
          </>
        ) : (
          <>
            New to IMR?{" "}
            <Link href="/signup" className="text-gold hover:text-gold-soft cursor-pointer">
              Create an account
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
