/**
 * File: src/components/DeleteMovieButton.tsx
 * Student: Group 12
 * Date: August 15, 2026
 * Course: Full-Stack Web Applications — SAIT
 *
 * Description:
 * Admin-only control that asks for confirmation before deleting a movie.
 * The actual delete runs as a Server Action against Supabase. Failures
 * surface beside the button; success refreshes the catalogue via router.
 *
 * Inputs: Movie id and title (for the confirmation copy).
 * Processing: Opens ConfirmDialog, calls deleteMovieAction, then refreshes.
 * Outputs: A delete button, a dialog, and an optional error message.
 */

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteMovieAction } from "@/actions/movies";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";

type DeleteMovieButtonProps = {
  movieId: string;
  title: string;
};

export function DeleteMovieButton({ movieId, title }: DeleteMovieButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function confirmDelete() {
    setBusy(true);
    setError(null);
    const result = await deleteMovieAction(movieId);
    setBusy(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    setOpen(false);
    router.refresh();
  }

  return (
    <div>
      <Button type="button" variant="destructive" size="sm" onClick={() => setOpen(true)}>
        Delete
      </Button>
      {error ? (
        <p role="alert" className="mt-2 max-w-[12rem] text-xs text-destructive">
          {error}
        </p>
      ) : null}
      <ConfirmDialog
        open={open}
        title="Delete this title?"
        description={`“${title}” will be removed from the IMR catalogue. This cannot be undone.`}
        confirmLabel="Delete movie"
        busy={busy}
        onCancel={() => {
          if (!busy) {
            setOpen(false);
          }
        }}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
