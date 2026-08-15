/**
 * File: src/app/movies/[id]/edit/page.tsx
 * Student: Group 12
 * Date: August 15, 2026
 * Course: Full-Stack Web Applications — SAIT
 *
 * Description:
 * Administrator edit page. The existing row is loaded from Supabase by id.
 * Missing ids and unauthorized visitors are handled with redirects or a
 * clear error instead of a blank form.
 *
 * Inputs: Dynamic route param `id` and Auth cookies.
 * Processing: Authorizes the admin, loads the movie, renders MovieForm.
 * Outputs: A pre-filled edit form, or an error/redirect.
 */

import Link from "next/link";
import { redirect } from "next/navigation";
import { updateMovieAction } from "@/actions/movies";
import { MovieForm } from "@/components/MovieForm";
import { PageHero } from "@/components/PageHero";
import { StatusBanner } from "@/components/StatusBanner";
import { Button } from "@/components/ui/button";
import { getAuthState } from "@/lib/auth";
import { getMovieById } from "@/lib/movies";

export default async function EditMoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const auth = await getAuthState();
  const { id } = await params;

  if (!auth.userId) {
    redirect(`/login?next=/movies/${id}/edit`);
  }
  if (!auth.isAdmin) {
    redirect("/forbidden");
  }

  const result = await getMovieById(id);

  return (
    <div className="page-wrap max-w-2xl py-10">
      <PageHero
        kicker="Administrator"
        title="Edit title"
        description="Change the card and save. Validation runs in the browser and again on the server."
      />
      {result.ok ? (
        <MovieForm movie={result.movie} action={updateMovieAction} submitLabel="Save changes" />
      ) : (
        <div className="space-y-4">
          <StatusBanner tone="error" message={result.message} />
          <Button nativeButton={false} variant="outline" render={<Link href="/movies" />}>
            Back to movies
          </Button>
        </div>
      )}
    </div>
  );
}
