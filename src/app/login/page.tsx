/**
 * File: src/app/login/page.tsx
 * Student: Group 12
 * Date: August 15, 2026
 * Course: Full-Stack Web Applications — SAIT
 *
 * Description:
 * Sign-in page for IMR viewers and administrators. Invalid credentials are
 * mapped to a short message. After success the visitor returns to the
 * catalogue or to the `next` path if it is an internal URL. Guests do not
 * need this page to browse movies.
 *
 * Inputs: Optional `next` search parameter.
 * Processing: Renders AuthForm bound to signInAction.
 * Outputs: The login page.
 */

import { signInAction } from "@/actions/auth";
import { AuthForm } from "@/components/AuthForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="page-wrap flex justify-center py-16">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          The catalogue is public. Sign in if you already have an IMR account.
        </p>
        <div className="mt-6">
          <AuthForm mode="login" action={signInAction} nextPath={next} />
        </div>
      </div>
    </div>
  );
}
