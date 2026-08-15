/**
 * File: src/app/signup/page.tsx
 * Student: Group 12
 * Date: August 15, 2026
 * Course: Full-Stack Web Applications — SAIT
 *
 * Description:
 * Public registration page. New accounts are created through Supabase Auth
 * as viewers. They can browse the catalogue (which is also public without
 * an account), but they cannot add, edit, or delete movies until an
 * administrator promotes their profile row in the database.
 *
 * Inputs: None besides the form fields collected by AuthForm.
 * Processing: Renders AuthForm bound to signUpAction.
 * Outputs: The sign-up page.
 */

import { signUpAction } from "@/actions/auth";
import { AuthForm } from "@/components/AuthForm";

export default function SignupPage() {
  return (
    <div className="page-wrap flex justify-center py-16">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          New accounts are viewers. Catalogue changes stay with administrators.
        </p>
        <div className="mt-6">
          <AuthForm mode="signup" action={signUpAction} />
        </div>
      </div>
    </div>
  );
}
