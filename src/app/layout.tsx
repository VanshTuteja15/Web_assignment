/**
 * File: src/app/layout.tsx
 * Student: Vansh Tuteja
 * Date: August 12, 2026
 * Course: Full-Stack Web Applications — SAIT
 *
 * Description:
 * Root layout for the IMR portal. It loads the display and body fonts,
 * reads the current Auth state once per request, and wraps every page in
 * the static navbar and company footer required by the assignment. Pages
 * only supply the main content.
 *
 * Inputs: The active route's children and the Auth cookies for this request.
 * Processing: Resolves the session, then composes navbar + main + footer.
 * Outputs: The HTML document shell rendered on every page.
 */

import type { Metadata } from "next";
import { Bebas_Neue, IBM_Plex_Mono, Source_Sans_3 } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { getAuthState } from "@/lib/auth";
import { COMPANY } from "@/lib/constants";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import "./globals.css";

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const ibmPlex = IBM_Plex_Mono({
  variable: "--font-ibm-plex",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${COMPANY.shortName} — ${COMPANY.name}`,
    template: `%s · ${COMPANY.shortName}`,
  },
  description:
    "Staff portal for the Internet Movies Rental Company. Browse the catalogue; administrators add, edit, and retire titles.",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const configured = isSupabaseConfigured();
  const auth = configured
    ? await getAuthState()
    : { userId: null, email: null, role: null, isAdmin: false };

  return (
    <html
      lang="en"
      className={`${sourceSans.variable} ${bebasNeue.variable} ${ibmPlex.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar auth={auth} configured={configured} />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
