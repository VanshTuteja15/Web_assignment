/**
 * File: src/app/forbidden/page.tsx
 * Student: Vansh Tuteja
 * Date: August 12, 2026
 * Course: Full-Stack Web Applications — SAIT
 *
 * Description:
 * Shown when a signed-in regular member opens an administrator URL.
 * The page explains the access level instead of failing silently or
 * exposing the admin form.
 *
 * Inputs: None.
 * Processing: Renders a static explanation and a link back to the catalogue.
 * Outputs: The forbidden page.
 */

import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
      <p className="kicker">Access</p>
      <h1 className="font-display mt-3 text-4xl font-semibold text-ivory sm:text-5xl">Staff only</h1>
      <p className="mt-4 text-sm leading-6 text-secondary">
        Adding, editing, and deleting movies is limited to administrators. You can still browse the catalogue as a
        member.
      </p>
      <Link href="/movies" className="btn btn-primary mt-8">
        Back to catalogue
      </Link>
    </div>
  );
}
