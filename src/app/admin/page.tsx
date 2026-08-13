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
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <p className="text-xs uppercase tracking-[0.24em] text-gold">Administrator</p>
      <h1 className="font-display mt-2 text-5xl text-ivory">Desk</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
        Signed in as {auth.email}. Add stock, correct a card, or retire a title. Every write is checked again by Row Level Security.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/movies/new"
          className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-sm bg-gold px-5 text-sm uppercase tracking-[0.14em] text-booth hover:bg-gold-soft transition-colors duration-200"
        >
          Add movie
        </Link>
        <Link
          href="/movies"
          className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-sm border border-gold/40 px-5 text-sm uppercase tracking-[0.14em] text-gold hover:bg-gold hover:text-booth transition-colors duration-200"
        >
          View catalogue
        </Link>
      </div>

      <section className="mt-10">
        <h2 className="font-display text-3xl text-ivory">Stock</h2>
        {!result.ok ? (
          <div className="mt-4">
            <StatusBanner tone="error" message={result.message} />
          </div>
        ) : (
          <>
            <p className="mt-2 font-mono text-sm text-muted">{result.movies.length} title{result.movies.length === 1 ? "" : "s"} on the shelf</p>
            <div className="mt-6 overflow-x-auto rounded-sm border border-[var(--line)]">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-velvet text-xs uppercase tracking-[0.16em] text-gold">
                  <tr>
                    <th className="px-4 py-3 font-medium">Title</th>
                    <th className="px-4 py-3 font-medium">Actors</th>
                    <th className="px-4 py-3 font-medium">Year</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {result.movies.map((movie) => (
                    <tr key={movie.id} className="border-t border-[var(--line)]">
                      <td className="px-4 py-3 text-ivory">{movie.title}</td>
                      <td className="px-4 py-3 text-muted">{formatActors(movie.actors)}</td>
                      <td className="px-4 py-3 font-mono text-gold">{movie.release_year}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <Link
                            href={`/movies/${movie.id}/edit`}
                            className="inline-flex min-h-11 cursor-pointer items-center rounded-sm border border-gold/40 px-3 text-xs uppercase tracking-[0.14em] text-gold hover:bg-gold hover:text-booth transition-colors duration-200"
                          >
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
          </>
        )}
      </section>
    </div>
  );
}
