/**
 * File: src/app/layout.tsx
 * Student: Group 12
 * Date: August 15, 2026
 * Course: Full-Stack Web Applications — SAIT
 *
 * Description:
 * Root layout for the IMR portal. It loads Geist, reads the current Auth
 * state once per request, and wraps every page in the navbar and company
 * footer required by the assignment. Pages only supply the main content.
 *
 * Inputs: The active route's children and the Auth cookies for this request.
 * Processing: Resolves the session, then composes navbar + main + footer.
 * Outputs: The HTML document shell rendered on every page.
 */

import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { getAuthState } from "@/lib/auth";
import { COMPANY } from "@/lib/constants";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { cn } from "@/lib/utils";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${COMPANY.shortName} — ${COMPANY.name}`,
    template: `%s · ${COMPANY.shortName}`,
  },
  description:
    "Public catalogue for the Internet Movies Rental Company. Browse titles; administrators add, edit, and retire movies.",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const configured = isSupabaseConfigured();
  const auth = configured
    ? await getAuthState()
    : { userId: null, email: null, role: null, isAdmin: false };

  return (
    <html lang="en" className={cn("dark h-full", geist.variable)}>
      <body className="flex min-h-full flex-col font-sans">
        <Navbar auth={auth} configured={configured} />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer signedIn={Boolean(auth.userId)} />
      </body>
    </html>
  );
}
