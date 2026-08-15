/**
 * File: src/app/not-found.tsx
 * Student: Group 12
 * Date: August 15, 2026
 * Course: Full-Stack Web Applications — SAIT
 *
 * Description:
 * Custom 404 page for unknown routes. Keeps the IMR chrome (navbar/footer
 * from the root layout) and points the visitor back to a real page.
 *
 * Inputs: None.
 * Processing: Renders a static not-found message.
 * Outputs: The 404 page.
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="page-wrap max-w-lg py-20">
      <p className="text-sm text-muted-foreground">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">That address is not part of the IMR portal.</p>
      <Button nativeButton={false} className="mt-8" render={<Link href="/" />}>
        Return home
      </Button>
    </div>
  );
}
