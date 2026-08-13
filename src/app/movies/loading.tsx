/**
 * File: src/app/movies/loading.tsx
 * Student: Vansh Tuteja
 * Date: August 12, 2026
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

export default function MoviesLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6" aria-busy="true" aria-live="polite">
      <p className="text-sm uppercase tracking-[0.2em] text-muted">Loading catalogue…</p>
      <div className="mt-8 grid gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-32 animate-pulse rounded-sm bg-panel" />
        ))}
      </div>
    </div>
  );
}
