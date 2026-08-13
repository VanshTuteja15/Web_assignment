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
    <div className="page-wrap py-10 sm:py-16">
      <section className="page-hero">
        <div className="relative z-10 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <p className="kicker">Internet Movies Rental Company</p>
            <h1 className="font-display mt-4 text-5xl font-semibold leading-[1.05] text-ivory sm:text-6xl lg:text-7xl">
              IMR Movie Library
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-secondary">
              Explore and manage the {COMPANY.name} collection. Members browse title, cast, and year.
              Administrators keep the shelf current — every change lives in Supabase.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {auth.userId ? (
                <Link href="/movies" className="btn btn-primary">
                  Open catalogue
                </Link>
              ) : (
                <>
                  <Link href="/login" className="btn btn-primary">
                    Sign in
                  </Link>
                  <Link href="/signup" className="btn btn-secondary">
                    Create account
                  </Link>
                </>
              )}
            </div>
          </div>
          <aside className="card-surface p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">On every card</p>
            <p className="font-display mt-3 text-3xl font-semibold text-ivory sm:text-4xl">Title · Cast · Year</p>
            <p className="mt-4 text-sm leading-6 text-secondary">
              The three fields every IMR title must carry. Nothing else is required to run the shop.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="badge badge-gold">Now showing</span>
              <span className="badge badge-member">Staff portal</span>
            </div>
          </aside>
        </div>
      </section>

      {!configured ? (
        <div className="mt-12">
          <SetupNotice />
        </div>
      ) : null}

      <section className="mt-12 grid gap-4 md:grid-cols-3">
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
          <article key={card.title} className="card-surface p-6 transition-transform duration-200 hover:-translate-y-0.5">
            <p className="kicker">{card.kicker}</p>
            <h2 className="font-display mt-4 text-2xl font-semibold text-ivory">{card.title}</h2>
            <p className="mt-3 text-sm leading-6 text-secondary">{card.body}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
