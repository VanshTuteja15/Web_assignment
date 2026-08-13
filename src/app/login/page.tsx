/**
 * File: src/app/login/page.tsx
 * Student: Vansh Tuteja
 * Date: August 12, 2026
 * Course: Full-Stack Web Applications — SAIT
 *
 * Description:
 * Sign-in page for existing IMR members and administrators. Invalid
 * credentials are mapped to a short message. After success the visitor
 * returns to the catalogue or to the `next` path if it is internal.
 *
 * Inputs: Optional `next` search parameter.
 * Processing: Renders AuthForm bound to signInAction.
 * Outputs: The login page.
 */

import { signInAction } from "@/actions/auth";
import { AuthForm } from "@/components/AuthForm";
import { COMPANY } from "@/lib/constants";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="page-wrap flex justify-center py-12 sm:py-16">
      <div className="w-full max-w-md">
        <p className="kicker">{COMPANY.shortName} members</p>
        <h1 className="font-display mt-3 text-4xl font-semibold text-ivory sm:text-5xl">Sign in</h1>
        <p className="mt-3 text-sm leading-6 text-secondary">
          Use the email and password you created for the IMR portal.
        </p>
        <div className="mt-8">
          <AuthForm mode="login" action={signInAction} nextPath={next} />
        </div>
      </div>
    </div>
  );
}
