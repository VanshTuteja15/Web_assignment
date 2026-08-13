/**
 * File: src/app/page.tsx
 * Student: Vansh Tuteja
 * Date: August 12, 2026
 * Course: Full-Stack Web Applications — SAIT
 *
 * Description:
 * Public landing page for the Internet Movies Rental Company. It introduces
 * the portal, points members to the catalogue, and tells administrators
 * where to manage titles. No movie rows are hard-coded here; the live
 * catalogue lives on /movies and is loaded from Supabase.
 *
 * Inputs: Auth state from the root layout's request (re-read here for CTAs).
 * Processing: Chooses call-to-action copy based on sign-in and role.
 * Outputs: The home page hero and three service cards.
 */

import Link from "next/link";
import { SetupNotice } from "@/components/SetupNotice";
import { getAuthState } from "@/lib/auth";
import { COMPANY } from "@/lib/constants";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export default async function HomePage() {
  const configured = isSupabaseConfigured();
  const auth = configured ? await getAuthState() : { userId: null, isAdmin: false, email: null, role: null };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-gold">Staff portal</p>
          <h1 className="font-display mt-4 text-6xl leading-[0.9] text-ivory sm:text-7xl">
            {COMPANY.name}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-muted">
            Keep the rental shelf honest. Members browse title, cast, and year.
            Administrators add new stock, correct a card, or retire a title —
            every change is stored in Supabase, not in the browser.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {auth.userId ? (
              <Link
                href="/movies"
                className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-sm bg-gold px-6 text-sm uppercase tracking-[0.16em] text-booth hover:bg-gold-soft transition-colors duration-200"
              >
                Open catalogue
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-sm bg-gold px-6 text-sm uppercase tracking-[0.16em] text-booth hover:bg-gold-soft transition-colors duration-200"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-sm border border-gold/40 px-6 text-sm uppercase tracking-[0.16em] text-gold hover:bg-gold hover:text-booth transition-colors duration-200"
                >
                  Create account
                </Link>
              </>
            )}
          </div>
        </div>
        <aside className="ticket-card sprocket-rail rounded-sm border border-[var(--line)] p-6 pl-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">Tonight&apos;s desk copy</p>
          <p className="font-display mt-3 text-4xl text-ivory">Title · Cast · Year</p>
          <p className="mt-4 text-sm leading-6 text-muted">
            The three fields every IMR card must carry. Nothing else is required to run the shop.
          </p>
        </aside>
      </section>

      {!configured ? (
        <div className="mt-12">
          <SetupNotice />
        </div>
      ) : null}

      <section className="mt-16 grid gap-4 md:grid-cols-3">
        {[
          {
            kicker: "Members",
            title: "Browse the shelf",
            body: "Sign in to read every title, the billed actors, and the release year.",
          },
          {
            kicker: "Administrators",
            title: "Keep stock current",
            body: "Add, edit, and delete movies. The database — not the page — is the source of truth.",
          },
          {
            kicker: "Security",
            title: "Two locks",
            body: "The UI hides admin tools from members. Row Level Security blocks direct writes as well.",
          },
        ].map((card) => (
          <article key={card.title} className="rounded-sm border border-[var(--line)] bg-panel/80 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-gold">{card.kicker}</p>
            <h2 className="font-display mt-3 text-3xl text-ivory">{card.title}</h2>
            <p className="mt-3 text-sm leading-6 text-muted">{card.body}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
