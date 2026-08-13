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
      <div className="card-surface flex flex-col gap-3 p-4 sm:flex-row sm:items-end">
        <label className="block flex-1 text-xs font-semibold uppercase tracking-[0.16em] text-secondary">
          Search titles or actors
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="e.g. Yeoh or 2015"
            className="field"
          />
        </label>
        <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-secondary sm:w-56">
          Sort
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortKey)}
            className="field cursor-pointer"
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
              <Link href="/movies/new" className="btn btn-primary">
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
                      <Link href={`/movies/${movie.id}/edit`} className="btn btn-secondary">
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
