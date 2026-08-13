/**
 * File: src/app/admin/page.tsx
 * Student: Vansh Tuteja
 * Date: August 12, 2026
 * Course: Full-Stack Web Applications — SAIT
 *
 * Description:
 * Administrator dashboard. It summarises catalogue size and repeats the
 * add / edit / delete entry points so staff do not have to hunt through
 * the public list. Regular members who type this URL are sent to /forbidden.
 *
 * Inputs: Auth cookies and the movies table.
 * Processing: Confirms admin role, loads movies, renders management links.
 * Outputs: The admin page, or a redirect for unauthorized visitors.
 */

import Link from "next/link";
import { redirect } from "next/navigation";
import { DeleteMovieButton } from "@/components/DeleteMovieButton";
import { PageHero } from "@/components/PageHero";
import { StatusBanner } from "@/components/StatusBanner";
import { getAuthState } from "@/lib/auth";
import { listMovies } from "@/lib/movies";
import { formatActors } from "@/lib/validation";

export default async function AdminPage() {
  const auth = await getAuthState();
  if (!auth.userId) {
    redirect("/login?next=/admin");
  }
  if (!auth.isAdmin) {
    redirect("/forbidden");
  }

  const result = await listMovies();

  return (
    <div className="page-wrap py-10">
      <PageHero
        kicker="Administrator"
        title="Admin desk"
        description={`Signed in as ${auth.email}. Add stock, correct a card, or retire a title. Every write is checked again by Row Level Security.`}
        actions={
          <>
            <Link href="/movies/new" className="btn btn-primary">
              Add movie
            </Link>
            <Link href="/movies" className="btn btn-secondary">
              View catalogue
            </Link>
          </>
        }
      />

      <section className="card-surface overflow-hidden">
        <div className="border-b border-[var(--border)] px-5 py-4 sm:px-6">
          <h2 className="font-display text-2xl font-semibold text-ivory">Stock</h2>
          {result.ok ? (
            <p className="mt-1 text-sm text-secondary">
              {result.movies.length} title{result.movies.length === 1 ? "" : "s"} on the shelf
            </p>
          ) : null}
        </div>
        {!result.ok ? (
          <div className="p-5">
            <StatusBanner tone="error" message={result.message} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-velvet text-xs font-semibold uppercase tracking-[0.14em] text-secondary">
                <tr>
                  <th className="px-4 py-3 font-semibold sm:px-6">Title</th>
                  <th className="px-4 py-3 font-semibold sm:px-6">Actors</th>
                  <th className="px-4 py-3 font-semibold sm:px-6">Year</th>
                  <th className="px-4 py-3 font-semibold sm:px-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {result.movies.map((movie) => (
                  <tr key={movie.id} className="border-t border-[var(--border)] hover:bg-white/[0.03]">
                    <td className="px-4 py-4 font-medium text-ivory sm:px-6">{movie.title}</td>
                    <td className="px-4 py-4 text-secondary sm:px-6">{formatActors(movie.actors)}</td>
                    <td className="px-4 py-4 sm:px-6">
                      <span className="badge badge-gold">{movie.release_year}</span>
                    </td>
                    <td className="px-4 py-4 sm:px-6">
                      <div className="flex flex-wrap gap-2">
                        <Link href={`/movies/${movie.id}/edit`} className="btn btn-secondary">
                          Edit
                        </Link>
                        <DeleteMovieButton movieId={movie.id} title={movie.title} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
