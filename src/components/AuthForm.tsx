/**
 * File: src/components/AuthForm.tsx
 * Student: Group 12
 * Date: August 15, 2026
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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    <form action={formAction} noValidate>
      <Card>
        <CardContent className="space-y-4">
          {nextPath ? <input type="hidden" name="next" value={nextPath} /> : null}
          {state.message ? (
            <StatusBanner
              tone={state.message.toLowerCase().includes("account created") ? "info" : "error"}
              message={state.message}
            />
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" autoComplete="email" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete={isSignup ? "new-password" : "current-password"}
              required
              minLength={isSignup ? 8 : undefined}
            />
            {isSignup ? <p className="text-xs text-muted-foreground">At least 8 characters.</p> : null}
          </div>

          {isSignup ? (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
              />
            </div>
          ) : null}
        </CardContent>
        <CardFooter className="flex-col gap-3">
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Please wait…" : isSignup ? "Create account" : "Sign in"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            {isSignup ? (
              <>
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
                  Sign in
                </Link>
              </>
            ) : (
              <>
                New to IMR?{" "}
                <Link href="/signup" className="font-medium text-foreground underline-offset-4 hover:underline">
                  Create an account
                </Link>
              </>
            )}
          </p>
        </CardFooter>
      </Card>
    </form>
  );
}
