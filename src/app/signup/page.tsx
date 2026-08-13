/**
 * File: src/app/signup/page.tsx
 * Student: Vansh Tuteja
 * Date: August 12, 2026
 * Course: Full-Stack Web Applications — SAIT
 *
 * Description:
 * Public registration page. New accounts are created through Supabase Auth
 * as regular members. They can view the catalogue after signing in, but
 * they cannot add, edit, or delete movies until an administrator promotes
 * their profile row in the database.
 *
 * Inputs: None besides the form fields collected by AuthForm.
 * Processing: Renders AuthForm bound to signUpAction.
 * Outputs: The sign-up page.
 */

import { signUpAction } from "@/actions/auth";
import { AuthForm } from "@/components/AuthForm";

export default function SignupPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <p className="text-xs uppercase tracking-[0.24em] text-gold">New members</p>
      <h1 className="font-display mt-2 text-5xl text-ivory">Create an account</h1>
      <p className="mt-3 text-sm leading-6 text-muted">
        Regular members can browse the catalogue. Catalogue changes stay with administrators.
      </p>
      <div className="mt-8">
        <AuthForm mode="signup" action={signUpAction} />
      </div>
    </div>
  );
}
