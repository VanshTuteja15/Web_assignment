/**
 * File: src/components/PageHero.tsx
 * Student: Vansh Tuteja
 * Date: August 12, 2026
 * Course: Full-Stack Web Applications — SAIT
 *
 * Description:
 * Shared cinematic page header used by the catalogue, admin desk, and
 * form pages. It keeps heading hierarchy, gold kickers, and optional
 * actions consistent so each screen still feels like the same IMR portal.
 *
 * Inputs: Optional kicker, required title, supporting copy, and actions.
 * Processing: Lays out a dark gradient panel with room for a call to action.
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
    <header className="page-hero mb-8">
      <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          {kicker ? <p className="kicker">{kicker}</p> : null}
          <h1 className="font-display mt-3 text-4xl font-semibold text-ivory sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-4 max-w-xl text-base leading-7 text-secondary">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="flex shrink-0 flex-col gap-3 sm:flex-row">{actions}</div> : null}
      </div>
    </header>
  );
}
