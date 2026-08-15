/**
 * File: src/components/MovieForm.tsx
 * Student: Group 12
 * Date: August 15, 2026
 * Course: Full-Stack Web Applications — SAIT
 *
 * Description:
 * Shared create/edit form for administrators. Client-side validation runs
 * on submit for immediate feedback; the Server Action validates again and
 * writes to Supabase. Cancel returns to the catalogue without saving.
 *
 * Inputs: Optional existing movie, a Server Action, and submit-button label.
 * Processing: Tracks field state, maps ActionResult errors onto inputs.
 * Outputs: A labelled form that either saves a movie or explains why it did not.
 */

"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { StatusBanner } from "@/components/StatusBanner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ActionResult, FieldErrors, Movie } from "@/lib/types";
import { formatActors, validateMovieInput } from "@/lib/validation";

type MovieFormProps = {
  movie?: Movie;
  action: (state: ActionResult | null, formData: FormData) => Promise<ActionResult>;
  submitLabel: string;
};

const initial: ActionResult | null = null;

export function MovieForm({ movie, action, submitLabel }: MovieFormProps) {
  const [state, formAction, pending] = useActionState(action, initial);
  const [title, setTitle] = useState(movie?.title ?? "");
  const [actors, setActors] = useState(movie ? formatActors(movie.actors) : "");
  const [releaseYear, setReleaseYear] = useState(movie ? String(movie.release_year) : "");
  const [localErrors, setLocalErrors] = useState<FieldErrors>({});

  const fieldErrors = { ...localErrors, ...(state && !state.ok ? state.fieldErrors : {}) };

  function handleSubmit(formData: FormData) {
    const parsed = validateMovieInput({
      title: String(formData.get("title") ?? ""),
      actors: String(formData.get("actors") ?? ""),
      releaseYear: String(formData.get("releaseYear") ?? ""),
    });

    if (!parsed.ok) {
      setLocalErrors(parsed.fieldErrors);
      return;
    }

    setLocalErrors({});
    formAction(formData);
  }

  return (
    <form action={handleSubmit} noValidate>
      <Card>
        <CardContent className="space-y-5">
          {movie ? <input type="hidden" name="id" value={movie.id} /> : null}

          {state && !state.ok ? <StatusBanner tone="error" message={state.message} /> : null}

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={200}
              required
              autoComplete="off"
              aria-invalid={Boolean(fieldErrors.title)}
              aria-describedby={fieldErrors.title ? "title-error" : "title-help"}
            />
            <p id="title-help" className="text-xs text-muted-foreground">
              Required. Up to 200 characters.
            </p>
            {fieldErrors.title ? (
              <p id="title-error" role="alert" className="text-sm text-destructive">
                {fieldErrors.title}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="actors">Actors</Label>
            <Input
              id="actors"
              name="actors"
              value={actors}
              onChange={(event) => setActors(event.target.value)}
              maxLength={500}
              required
              autoComplete="off"
              aria-invalid={Boolean(fieldErrors.actors)}
              aria-describedby={fieldErrors.actors ? "actors-error" : "actors-help"}
              placeholder="Michelle Yeoh, Ke Huy Quan"
            />
            <p id="actors-help" className="text-xs text-muted-foreground">
              Required. Separate names with commas.
            </p>
            {fieldErrors.actors ? (
              <p id="actors-error" role="alert" className="text-sm text-destructive">
                {fieldErrors.actors}
              </p>
            ) : null}
          </div>

          <div className="max-w-[12rem] space-y-2">
            <Label htmlFor="releaseYear">Release year</Label>
            <Input
              id="releaseYear"
              name="releaseYear"
              inputMode="numeric"
              value={releaseYear}
              onChange={(event) => setReleaseYear(event.target.value)}
              required
              aria-invalid={Boolean(fieldErrors.releaseYear)}
              aria-describedby={fieldErrors.releaseYear ? "year-error" : "year-help"}
            />
            <p id="year-help" className="text-xs text-muted-foreground">
              Required. A four-digit year between 1888 and next year.
            </p>
            {fieldErrors.releaseYear ? (
              <p id="year-error" role="alert" className="text-sm text-destructive">
                {fieldErrors.releaseYear}
              </p>
            ) : null}
          </div>
        </CardContent>
        <CardFooter className="justify-end gap-2">
          <Button nativeButton={false} variant="outline" render={<Link href="/movies" />}>
            Cancel
          </Button>
          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : submitLabel}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
