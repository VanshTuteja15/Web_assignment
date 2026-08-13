/**
 * File: src/components/EmptyState.tsx
 * Student: Vansh Tuteja
 * Date: August 12, 2026
 * Course: Full-Stack Web Applications — SAIT
 *
 * Description:
 * Reusable empty-catalogue message. Used when Supabase returns zero movies
 * or when the client-side search matches nothing. Admins see a call to
 * action; regular members see a quieter explanation.
 *
 * Inputs: Title, supporting text, and an optional action node.
 * Processing: Renders a centred panel.
 * Outputs: An empty-state region with an accessible status role.
 */

import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  message: string;
  action?: ReactNode;
};

export function EmptyState({ title, message, action }: EmptyStateProps) {
  return (
    <div role="status" className="card-surface border-dashed px-6 py-16 text-center">
      <h2 className="font-display text-3xl font-semibold text-ivory">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-secondary">{message}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
