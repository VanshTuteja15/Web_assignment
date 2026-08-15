/**
 * File: src/components/EmptyState.tsx
 * Student: Group 12
 * Date: August 15, 2026
 * Course: Full-Stack Web Applications — SAIT
 *
 * Description:
 * Reusable empty-catalogue message. Used when Supabase returns zero movies.
 * Admins see a call to action; guests and viewers see a quieter explanation.
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
    <div role="status" className="rounded-xl border border-dashed px-6 py-16 text-center">
      <h2 className="text-lg font-medium tracking-tight">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">{message}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
