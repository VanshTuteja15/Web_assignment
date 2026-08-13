/**
 * File: src/app/error.tsx
 * Student: Vansh Tuteja
 * Date: August 12, 2026
 * Course: Full-Stack Web Applications — SAIT
 *
 * Description:
 * Route error boundary. Unexpected failures (a thrown Error in a Server
 * Component, for example) land here instead of a blank screen. The original
 * stack is not shown to visitors.
 *
 * Inputs: The error object supplied by Next.js and a reset callback.
 * Processing: Displays a short apology and a retry button.
 * Outputs: A recovery UI for the current route segment.
 */

"use client";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
      <p className="kicker">Portal error</p>
      <h1 className="font-display mt-3 text-4xl font-semibold text-ivory sm:text-5xl">Something went wrong</h1>
      <p className="mt-4 text-sm leading-6 text-secondary">
        The portal hit an unexpected error. Try again. If it continues, check that Supabase is reachable.
      </p>
      <button type="button" onClick={reset} className="btn btn-primary mt-8">
        Try again
      </button>
    </div>
  );
}
