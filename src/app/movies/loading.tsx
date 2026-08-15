/**
 * File: src/app/movies/loading.tsx
 * Student: Group 12
 * Date: August 15, 2026
 * Course: Full-Stack Web Applications — SAIT
 *
 * Description:
 * Skeleton shown while the catalogue is fetched from Supabase. Reserved
 * height avoids a layout jump. Decorative only; the live list replaces it.
 *
 * Inputs: None.
 * Processing: Renders placeholder blocks.
 * Outputs: A loading UI announced by Next.js during navigation.
 */

import { Skeleton } from "@/components/ui/skeleton";

export default function MoviesLoading() {
  return (
    <div className="page-wrap py-10" aria-busy="true" aria-live="polite">
      <p className="text-sm text-muted-foreground">Loading catalogue…</p>
      <div className="mt-8 grid gap-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
