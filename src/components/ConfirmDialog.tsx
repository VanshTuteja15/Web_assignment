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
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-4" role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-desc"
        className="w-full max-w-md rounded-sm border border-[var(--line)] bg-velvet p-6 shadow-[var(--shadow)]"
      >
        <h2 id="confirm-title" className="font-display text-3xl text-gold">
          {title}
        </h2>
        <p id="confirm-desc" className="mt-3 text-sm leading-6 text-muted">
          {description}
        </p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            className="min-h-11 cursor-pointer rounded-sm border border-[var(--line)] px-4 text-sm uppercase tracking-[0.12em] text-ivory hover:bg-panel transition-colors duration-200"
            onClick={onCancel}
            disabled={busy}
          >
            Cancel
          </button>
          <button
            type="button"
            className="min-h-11 cursor-pointer rounded-sm bg-danger px-4 text-sm uppercase tracking-[0.12em] text-ivory hover:brightness-110 transition-all duration-200 disabled:opacity-60"
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? "Working…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
