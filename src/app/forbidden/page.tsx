/**
 * File: src/app/forbidden/page.tsx
 * Student: Group 12
 * Date: August 15, 2026
 * Course: Full-Stack Web Applications — SAIT
 *
 * Description:
 * Shown when a signed-in viewer opens an administrator URL. The page
 * explains the access level instead of failing silently or exposing the
 * admin form. Guests never land here; they are redirected to login first.
 *
 * Inputs: None.
 * Processing: Renders a static explanation and a link back to the catalogue.
 * Outputs: The forbidden page.
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ForbiddenPage() {
  return (
    <div className="page-wrap max-w-lg py-20">
      <p className="text-sm text-muted-foreground">403</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Staff only</h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Adding, editing, and deleting movies is limited to administrators. You can still browse the catalogue as a
        viewer.
      </p>
      <Button nativeButton={false} className="mt-8" render={<Link href="/movies" />}>
        Back to movies
      </Button>
    </div>
  );
}
