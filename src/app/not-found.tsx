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
      <p className="font-mono text-sm text-gold">404</p>
      <h1 className="font-display mt-2 text-5xl text-ivory">Reel not found</h1>
      <p className="mt-4 text-sm leading-6 text-muted">
        That address is not part of the IMR portal.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex min-h-11 cursor-pointer items-center rounded-sm bg-gold px-5 text-sm uppercase tracking-[0.14em] text-booth hover:bg-gold-soft transition-colors duration-200"
      >
        Return home
      </Link>
    </div>
  );
}
