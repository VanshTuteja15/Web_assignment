/**
 * File: src/components/PageHero.tsx
 * Student: Group 12
 * Date: August 15, 2026
 * Course: Full-Stack Web Applications — SAIT
 *
 * Description:
 * Shared page header used by the catalogue and form pages. It keeps heading
 * hierarchy and optional actions consistent so each screen still feels like
 * the same IMR portal.
 *
 * Inputs: Optional kicker, required title, supporting copy, and actions.
 * Processing: Lays out a simple title block with room for a call to action.
 * Outputs: A page header landmark for the current view.
 */

import type { ReactNode } from "react";

type PageHeroProps = {
  kicker?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
};

export function PageHero({ kicker, title, description, actions }: PageHeroProps) {
  return (
    <header className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {kicker ? <p className="text-sm text-muted-foreground">{kicker}</p> : null}
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
        {description ? (
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 gap-2">{actions}</div> : null}
    </header>
  );
}
