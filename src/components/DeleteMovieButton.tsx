/**
 * File: src/components/DeleteMovieButton.tsx
 * Student: Vansh Tuteja
 * Date: August 12, 2026
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
      <button
        type="button"
        className="btn btn-danger"
        onClick={() => setOpen(true)}
      >
        Delete
      </button>
      {error ? (
        <p role="alert" className="mt-2 max-w-[12rem] text-xs text-danger">
          {error}
        </p>
      ) : null}
      <ConfirmDialog
        open={open}
        title="Retire this title?"
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
