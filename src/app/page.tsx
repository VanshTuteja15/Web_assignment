/**
 * File: src/app/page.tsx
 * Student: Group 12
 * Date: August 15, 2026
 * Course: Full-Stack Web Applications — SAIT
 *
 * Description:
 * Public landing page for the Internet Movies Rental Company. It introduces
 * the portal and sends everyone — guests included — to the live catalogue.
 * No movie rows are hard-coded here; titles load from Supabase on /movies.
 *
 * Inputs: Auth state from the current request (used for a quieter CTA).
 * Processing: Chooses call-to-action copy based on sign-in and role.
 * Outputs: A full-height, minimal home page.
 */

import Link from "next/link";
import { DemoLoginBanner } from "@/components/DemoLoginBanner";
import { SetupNotice } from "@/components/SetupNotice";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAuthState } from "@/lib/auth";
import { COMPANY } from "@/lib/constants";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export default async function HomePage() {
  const configured = isSupabaseConfigured();
  const auth = configured ? await getAuthState() : { userId: null, isAdmin: false, email: null, role: null };

  return (
    <div>
      <section className="page-wrap flex min-h-[calc(100svh-3.5rem)] flex-col">
        <div className="relative flex flex-1 flex-col justify-center py-16">
          {!auth.userId ? (
            <DemoLoginBanner className="absolute top-8 left-0 z-10 max-w-xl" />
          ) : null}
          <p className="text-sm text-muted-foreground">{COMPANY.name}</p>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight sm:text-6xl">
            The movie catalogue for IMR.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            Browse titles, actors, and release years. Guests can read the list. Administrators sign in
            to keep the collection current.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button nativeButton={false} size="lg" render={<Link href="/movies" />}>
              Browse movies
            </Button>
            {auth.isAdmin ? (
              <Button nativeButton={false} size="lg" variant="outline" render={<Link href="/movies/new" />}>
                Add a movie
              </Button>
            ) : auth.userId ? null : (
              <Button nativeButton={false} size="lg" variant="outline" render={<Link href="/login" />}>
                Sign in
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-4 py-10 sm:grid-cols-3">
          {[
            {
              title: "Public catalogue",
              body: "Title, cast, and year — no account required.",
            },
            {
              title: "Staff tools",
              body: "Admins add, edit, and delete movies in the database.",
            },
            {
              title: "Calgary shop",
              body: `${COMPANY.address.split(",")[0]}. ${COMPANY.hours}.`,
            },
          ].map((item) => (
            <Card key={item.title} size="sm">
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.body}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {!configured ? (
        <div className="page-wrap pb-12">
          <SetupNotice />
        </div>
      ) : null}
    </div>
  );
}
