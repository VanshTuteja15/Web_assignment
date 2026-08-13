/**
 * File: src/components/MovieCard.tsx
 * Student: Vansh Tuteja
 * Date: August 12, 2026
 * Course: Full-Stack Web Applications — SAIT
 *
 * Description:
 * Catalogue card for one movie row. It always shows title, actors, and
 * release year. Edit and delete controls are passed in by the parent so
 * regular members never receive those buttons in the DOM. No poster image
 * is used because posters are not part of the database.
 *
 * Inputs: A Movie record and optional admin action nodes.
 * Processing: Formats the actor list and lays out the card.
 * Outputs: An article representing one rental title.
 */

import type { ReactNode } from "react";
import type { Movie } from "@/lib/types";
import { formatActors } from "@/lib/validation";

type MovieCardProps = {
  movie: Movie;
  actions?: ReactNode;
};

export function MovieCard({ movie, actions }: MovieCardProps) {
  return (
    <article className="card-surface overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:border-gold/35">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-stretch">
        <div className="flex h-20 w-full shrink-0 items-center justify-center rounded-xl bg-velvet sm:h-auto sm:w-24">
          <span className="badge badge-gold">{movie.release_year}</span>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-2xl font-semibold leading-tight text-ivory sm:text-3xl">{movie.title}</h3>
          <p className="mt-3 text-sm leading-6 text-secondary">
            <span className="sr-only">Actors: </span>
            {formatActors(movie.actors)}
          </p>
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap items-start gap-2">{actions}</div> : null}
      </div>
    </article>
  );
}
