/**
 * File: src/app/error.tsx
 * Student: Group 12
 * Date: August 15, 2026
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

import { Button } from "@/components/ui/button";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <div className="page-wrap max-w-lg py-20">
      <p className="text-sm text-muted-foreground">Error</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Something went wrong</h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        The portal hit an unexpected error. Try again. If it continues, check that Supabase is reachable.
      </p>
      <Button type="button" className="mt-8" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
