/**
 * File: src/app/movies/new/page.tsx
 * Student: Vansh Tuteja
 * Date: August 12, 2026
 * Course: Full-Stack Web Applications — SAIT
 *
 * Description:
 * Administrator page for adding a movie. Regular members who type this
 * URL are sent to /forbidden. The form posts to createMovieAction, which
 * validates and inserts into Supabase.
 *
 * Inputs: Auth cookies for the current request.
 * Processing: Confirms admin role, then renders MovieForm.
 * Outputs: The add-movie page, or a redirect for unauthorized visitors.
 */

import { redirect } from "next/navigation";
import { createMovieAction } from "@/actions/movies";
import { MovieForm } from "@/components/MovieForm";
import { PageHero } from "@/components/PageHero";
import { getAuthState } from "@/lib/auth";

export default async function NewMoviePage() {
  const auth = await getAuthState();
  if (!auth.userId) {
    redirect("/login?next=/movies/new");
  }
  if (!auth.isAdmin) {
    redirect("/forbidden");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <PageHero
        kicker="Administrator"
        title="Add a title"
        description="Title, actors, and release year are required. The new card appears in the catalogue as soon as Supabase accepts it."
      />
      <MovieForm action={createMovieAction} submitLabel="Save movie" />
    </div>
  );
}
