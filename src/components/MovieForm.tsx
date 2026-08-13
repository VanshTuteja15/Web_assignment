/**
 * File: src/components/MovieForm.tsx
 * Student: Vansh Tuteja
 * Date: August 12, 2026
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
    <form action={handleSubmit} className="space-y-5 rounded-sm border border-[var(--line)] bg-panel p-5 sm:p-8" noValidate>
      {movie ? <input type="hidden" name="id" value={movie.id} /> : null}

      {state && !state.ok && !state.fieldErrors ? <StatusBanner tone="error" message={state.message} /> : null}
      {state && !state.ok && state.fieldErrors ? <StatusBanner tone="error" message={state.message} /> : null}

      <div>
        <label htmlFor="title" className="block text-xs uppercase tracking-[0.16em] text-muted">
          Title
        </label>
        <input
          id="title"
          name="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={200}
          required
          autoComplete="off"
          aria-invalid={Boolean(fieldErrors.title)}
          aria-describedby={fieldErrors.title ? "title-error" : "title-help"}
          className="mt-2 min-h-11 w-full rounded-sm border border-[var(--line)] bg-booth px-3 text-ivory"
        />
        <p id="title-help" className="mt-1 text-xs text-muted">
          Required. Up to 200 characters.
        </p>
        {fieldErrors.title ? (
          <p id="title-error" role="alert" className="mt-1 text-sm text-danger">
            {fieldErrors.title}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="actors" className="block text-xs uppercase tracking-[0.16em] text-muted">
          Actors
        </label>
        <input
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
          className="mt-2 min-h-11 w-full rounded-sm border border-[var(--line)] bg-booth px-3 text-ivory"
        />
        <p id="actors-help" className="mt-1 text-xs text-muted">
          Required. Separate names with commas.
        </p>
        {fieldErrors.actors ? (
          <p id="actors-error" role="alert" className="mt-1 text-sm text-danger">
            {fieldErrors.actors}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="releaseYear" className="block text-xs uppercase tracking-[0.16em] text-muted">
          Release year
        </label>
        <input
          id="releaseYear"
          name="releaseYear"
          inputMode="numeric"
          value={releaseYear}
          onChange={(event) => setReleaseYear(event.target.value)}
          required
          aria-invalid={Boolean(fieldErrors.releaseYear)}
          aria-describedby={fieldErrors.releaseYear ? "year-error" : "year-help"}
          className="mt-2 min-h-11 w-full max-w-[12rem] rounded-sm border border-[var(--line)] bg-booth px-3 font-mono text-ivory"
        />
        <p id="year-help" className="mt-1 text-xs text-muted">
          Required. A four-digit year, not far in the future.
        </p>
        {fieldErrors.releaseYear ? (
          <p id="year-error" role="alert" className="mt-1 text-sm text-danger">
            {fieldErrors.releaseYear}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <Link
          href="/movies"
          className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-sm border border-[var(--line)] px-4 text-sm uppercase tracking-[0.14em] text-ivory hover:bg-velvet transition-colors duration-200"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={pending}
          className="min-h-11 cursor-pointer rounded-sm bg-gold px-5 text-sm uppercase tracking-[0.14em] text-booth hover:bg-gold-soft transition-colors duration-200 disabled:opacity-60"
        >
          {pending ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
