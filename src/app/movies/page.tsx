/**
 * File: src/app/movies/page.tsx
 * Student: Vansh Tuteja
 * Date: August 12, 2026
 * Course: Full-Stack Web Applications — SAIT
 *
 * Description:
 * Authenticated movie list page. Rows come from Supabase. Title, actors,
 * and release year are always shown. Administrators also receive add, edit,
 * and delete controls. Loading, empty, and error states are all handled.
 *
 * Inputs: Optional `status` query flag after a successful write; Auth cookies.
 * Processing: Loads movies on the server, then hands them to MovieList.
 * Outputs: The catalogue page, or a friendly error if the database call fails.
 */

import Link from "next/link";
import { MovieList } from "@/components/MovieList";
import { SetupNotice } from "@/components/SetupNotice";
import { StatusBanner } from "@/components/StatusBanner";
import { getAuthState } from "@/lib/auth";
import { listMovies } from "@/lib/movies";
import { isSupabaseConfigured } from "@/lib/supabase/env";

const statusCopy: Record<string, string> = {
  created: "Title added to the catalogue.",
  updated: "Catalogue card updated.",
};

export default async function MoviesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <SetupNotice />
      </div>
    );
  }

  const auth = await getAuthState();
  const { status } = await searchParams;
  const result = await listMovies();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-gold">Catalogue</p>
          <h1 className="font-display mt-2 text-5xl text-ivory">Now on the shelf</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
            Every card lists the title, the billed actors, and the release year. Data is loaded from Supabase on each request.
          </p>
        </div>
        {auth.isAdmin ? (
          <Link
            href="/movies/new"
            className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-sm bg-gold px-5 text-sm uppercase tracking-[0.14em] text-booth hover:bg-gold-soft transition-colors duration-200"
          >
            Add movie
          </Link>
        ) : null}
      </div>

      {status && statusCopy[status] ? <div className="mb-6"><StatusBanner tone="success" message={statusCopy[status]} /></div> : null}

      {result.ok ? (
        <MovieList movies={result.movies} isAdmin={auth.isAdmin} />
      ) : (
        <StatusBanner tone="error" message={result.message} />
      )}
    </div>
  );
}
