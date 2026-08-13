/**
 * File: src/app/not-found.tsx
 * Student: Vansh Tuteja
 * Date: August 12, 2026
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

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
      <p className="kicker">404</p>
      <h1 className="font-display mt-3 text-4xl font-semibold text-ivory sm:text-5xl">Page not found</h1>
      <p className="mt-4 text-sm leading-6 text-secondary">That address is not part of the IMR portal.</p>
      <Link href="/" className="btn btn-primary mt-8">
        Return home
      </Link>
    </div>
  );
}
