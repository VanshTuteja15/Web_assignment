/**
 * File: src/components/ConfirmDialog.tsx
 * Student: Group 12
 * Date: August 15, 2026
 * Course: Full-Stack Web Applications — SAIT
 *
 * Description:
 * Keyboard-accessible confirmation overlay used before deleting a movie.
 * Focus stays on the dialog actions. Cancel closes without side effects;
 * Confirm runs the caller-supplied async handler.
 *
 * Inputs: Open flag, title, description, busy flag, and confirm/cancel callbacks.
 * Processing: Renders a shadcn Dialog when open is true.
 * Outputs: A confirmation UI; no data is changed until Confirm is pressed.
 */

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
  return (
    <Dialog open={open} onOpenChange={(next) => (!next && !busy ? onCancel() : undefined)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel} disabled={busy}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={onConfirm} disabled={busy}>
            {busy ? "Working…" : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
