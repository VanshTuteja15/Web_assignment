/**
 * File: src/components/MovieCard.tsx
 * Student: Group 12
 * Date: August 15, 2026
 * Course: Full-Stack Web Applications — SAIT
 *
 * Description:
 * Catalogue card for one movie row. It always shows title, actors, and
 * release year. Edit and delete controls are passed in by the parent so
 * viewers never receive those buttons in the DOM. No poster image is used
 * because posters are not part of the database.
 *
 * Inputs: A Movie record and optional admin action nodes.
 * Processing: Formats the actor list and lays out the card.
 * Outputs: An article representing one rental title.
 */

import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Movie } from "@/lib/types";
import { formatActors } from "@/lib/validation";

type MovieCardProps = {
  movie: Movie;
  actions?: ReactNode;
};

export function MovieCard({ movie, actions }: MovieCardProps) {
  return (
    <Card>
      <CardHeader>
        <Badge variant="secondary" className="w-fit">
          {movie.release_year}
        </Badge>
        <CardTitle className="text-lg">{movie.title}</CardTitle>
        <CardDescription>
          <span className="sr-only">Actors: </span>
          {formatActors(movie.actors)}
        </CardDescription>
        {actions ? <CardAction className="flex flex-wrap gap-2">{actions}</CardAction> : null}
      </CardHeader>
    </Card>
  );
}
