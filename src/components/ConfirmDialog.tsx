/**
 * File: src/components/ConfirmDialog.tsx
 * Student: Vansh Tuteja
 * Date: August 12, 2026
 * Course: Full-Stack Web Applications — SAIT
 *
 * Description:
 * Keyboard-accessible confirmation overlay used before deleting a movie.
 * Focus stays on the dialog actions. Cancel closes without side effects;
 * Confirm runs the caller-supplied async handler.
 *
 * Inputs: Open flag, title, description, busy flag, and confirm/cancel callbacks.
 * Processing: Renders a modal dialog when open is true.
 * Outputs: A confirmation UI; no data is changed until Confirm is pressed.
 */

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  busy: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  busy,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/75 px-4" role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-desc"
        className="card-surface w-full max-w-md p-6"
      >
        <h2 id="confirm-title" className="font-display text-3xl font-semibold text-ivory">
          {title}
        </h2>
        <p id="confirm-desc" className="mt-3 text-sm leading-6 text-secondary">
          {description}
        </p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
          <button type="button" className="btn btn-danger" onClick={onConfirm} disabled={busy}>
            {busy ? "Working…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
