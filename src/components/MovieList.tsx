/**
 * File: src/components/MovieList.tsx
 * Student: Vansh Tuteja
 * Date: August 12, 2026
 * Course: Full-Stack Web Applications — SAIT
 *
 * Description:
 * Interactive catalogue list. Movies are fetched on the server and passed
 * in as props so this component does not talk to Supabase itself. Search
 * and year sorting happen in memory, which is enough for a classroom-sized
 * catalogue and avoids extra round trips.
 *
 * Inputs: Movie array and whether the viewer is an administrator.
 * Processing: Filters by title/actor text and sorts by title or year.
 * Outputs: Toolbar plus a list of MovieCard rows (or an empty state).
 */

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DeleteMovieButton } from "@/components/DeleteMovieButton";
import { EmptyState } from "@/components/EmptyState";
import { MovieCard } from "@/components/MovieCard";
import type { Movie } from "@/lib/types";

type SortKey = "title" | "year-desc" | "year-asc";

type MovieListProps = {
  movies: Movie[];
  isAdmin: boolean;
};

export function MovieList({ movies, isAdmin }: MovieListProps) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("title");

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = needle
      ? movies.filter((movie) => {
          const haystack = `${movie.title} ${movie.actors.join(" ")} ${movie.release_year}`.toLowerCase();
          return haystack.includes(needle);
        })
      : movies;

    return [...filtered].sort((a, b) => {
      if (sort === "year-desc") {
        return b.release_year - a.release_year || a.title.localeCompare(b.title);
      }
      if (sort === "year-asc") {
        return a.release_year - b.release_year || a.title.localeCompare(b.title);
      }
      return a.title.localeCompare(b.title);
    });
  }, [movies, query, sort]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-sm border border-[var(--line)] bg-panel/70 p-4 sm:flex-row sm:items-end">
        <label className="block flex-1 text-xs uppercase tracking-[0.16em] text-muted">
          Search titles or actors
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="e.g. Yeoh or 2015"
            className="mt-2 min-h-11 w-full rounded-sm border border-[var(--line)] bg-booth px-3 text-sm text-ivory placeholder:text-muted/70"
          />
        </label>
        <label className="block text-xs uppercase tracking-[0.16em] text-muted sm:w-56">
          Sort
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortKey)}
            className="mt-2 min-h-11 w-full cursor-pointer rounded-sm border border-[var(--line)] bg-booth px-3 text-sm text-ivory"
          >
            <option value="title">Title (A–Z)</option>
            <option value="year-desc">Newest year first</option>
            <option value="year-asc">Oldest year first</option>
          </select>
        </label>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          title={query ? "No matching titles" : "The shelf is empty"}
          message={
            query
              ? "Try a different title, actor, or year."
              : isAdmin
                ? "Add the first title to open the catalogue."
                : "An administrator has not added any movies yet."
          }
          action={
            isAdmin && !query ? (
              <Link
                href="/movies/new"
                className="inline-flex min-h-11 cursor-pointer items-center rounded-sm bg-gold px-4 text-sm uppercase tracking-[0.14em] text-booth hover:bg-gold-soft transition-colors duration-200"
              >
                Add movie
              </Link>
            ) : null
          }
        />
      ) : (
        <ul className="grid gap-4">
          {visible.map((movie) => (
            <li key={movie.id}>
              <MovieCard
                movie={movie}
                actions={
                  isAdmin ? (
                    <>
                      <Link
                        href={`/movies/${movie.id}/edit`}
                        className="inline-flex min-h-11 cursor-pointer items-center rounded-sm border border-gold/40 px-3 text-xs uppercase tracking-[0.14em] text-gold hover:bg-gold hover:text-booth transition-colors duration-200"
                      >
                        Edit
                      </Link>
                      <DeleteMovieButton movieId={movie.id} title={movie.title} />
                    </>
                  ) : null
                }
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
