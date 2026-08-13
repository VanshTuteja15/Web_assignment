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
import { PageHero } from "@/components/PageHero";
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
      <div className="page-wrap py-12">
        <SetupNotice />
      </div>
    );
  }

  const auth = await getAuthState();
  const { status } = await searchParams;
  const result = await listMovies();

  return (
    <div className="page-wrap py-10">
      <PageHero
        kicker="IMR catalogue"
        title="IMR Movie Library"
        description="Explore and manage the Internet Movies Rental Company collection. Every card lists the title, billed actors, and release year."
        actions={
          auth.isAdmin ? (
            <Link href="/movies/new" className="btn btn-primary">
              Add movie
            </Link>
          ) : null
        }
      />

      {status && statusCopy[status] ? (
        <div className="mb-6">
          <StatusBanner tone="success" message={statusCopy[status]} />
        </div>
      ) : null}

      {result.ok ? (
        <MovieList movies={result.movies} isAdmin={auth.isAdmin} />
      ) : (
        <StatusBanner tone="error" message={result.message} />
      )}
    </div>
  );
}
