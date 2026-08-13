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
      <p className="text-xs uppercase tracking-[0.24em] text-gold">Administrator</p>
      <h1 className="font-display mt-2 text-5xl text-ivory">Add a title</h1>
      <p className="mt-3 text-sm leading-6 text-muted">
        Title, actors, and release year are required. The new card appears in the catalogue as soon as Supabase accepts it.
      </p>
      <div className="mt-8">
        <MovieForm action={createMovieAction} submitLabel="Save movie" />
      </div>
    </div>
  );
}
