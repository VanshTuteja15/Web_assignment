/**
 * File: src/components/MovieList.tsx
 * Student: Group 12
 * Date: August 15, 2026
 * Course: Full-Stack Web Applications — SAIT
 *
 * Description:
 * Catalogue list rendered from movies fetched on the server. This component
 * does not talk to Supabase itself. Administrators receive Edit and Delete
 * controls on each card; guests and viewers see a read-only list.
 *
 * Inputs: Movie array and whether the viewer is an administrator.
 * Processing: Maps each row onto a MovieCard, or shows an empty state.
 * Outputs: A list of movie cards (or an empty-state panel).
 */

import Link from "next/link";
import { DeleteMovieButton } from "@/components/DeleteMovieButton";
import { EmptyState } from "@/components/EmptyState";
import { MovieCard } from "@/components/MovieCard";
import { Button } from "@/components/ui/button";
import type { Movie } from "@/lib/types";

type MovieListProps = {
  movies: Movie[];
  isAdmin: boolean;
};

export function MovieList({ movies, isAdmin }: MovieListProps) {
  if (movies.length === 0) {
    return (
      <EmptyState
        title="No movies yet"
        message={
          isAdmin
            ? "Add the first title to open the catalogue."
            : "An administrator has not added any movies yet."
        }
        action={
          isAdmin ? (
            <Button nativeButton={false} render={<Link href="/movies/new" />}>
              Add movie
            </Button>
          ) : null
        }
      />
    );
  }

  return (
    <ul className="grid gap-3">
      {movies.map((movie) => (
        <li key={movie.id}>
          <MovieCard
            movie={movie}
            actions={
              isAdmin ? (
                <>
                  <Button nativeButton={false} variant="outline" size="sm" render={<Link href={`/movies/${movie.id}/edit`} />}>
                    Edit
                  </Button>
                  <DeleteMovieButton movieId={movie.id} title={movie.title} />
                </>
              ) : null
            }
          />
        </li>
      ))}
    </ul>
  );
}
