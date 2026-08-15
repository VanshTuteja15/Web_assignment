/**
 * File: src/app/movies/page.tsx
 * Student: Group 12
 * Date: August 15, 2026
 * Course: Full-Stack Web Applications — SAIT
 *
 * Description:
 * Public movie list page. Rows come from Supabase. Title, actors, and
 * release year are always shown. Administrators also receive add, edit,
 * and delete controls. Guests and viewers see a read-only catalogue.
 * Loading, empty, and error states are all handled.
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
import { Button } from "@/components/ui/button";
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
        kicker="Catalogue"
        title="Movies"
        description="Title, billed actors, and release year for every IMR rental."
        actions={
          auth.isAdmin ? (
            <Button nativeButton={false} render={<Link href="/movies/new" />}>
              Add movie
            </Button>
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
