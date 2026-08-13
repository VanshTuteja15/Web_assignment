/**
 * File: src/components/MovieCard.tsx
 * Student: Vansh Tuteja
 * Date: August 12, 2026
 * Course: Full-Stack Web Applications — SAIT
 *
 * Description:
 * Ticket-stub card for one catalogue row. It always shows title, actors,
 * and release year. Edit and delete controls are passed in by the parent
 * so regular members never receive those buttons in the DOM.
 *
 * Inputs: A Movie record and optional admin action nodes.
 * Processing: Formats the actor list and lays out the stub.
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
    <article className="ticket-card sprocket-rail relative overflow-hidden rounded-sm border border-[var(--line)] pl-7">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-gold">{movie.release_year}</p>
          <h3 className="font-display mt-2 text-3xl leading-none text-ivory">{movie.title}</h3>
          <p className="mt-3 text-sm leading-6 text-muted">
            <span className="sr-only">Actors: </span>
            {formatActors(movie.actors)}
          </p>
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
      </div>
    </article>
  );
}
