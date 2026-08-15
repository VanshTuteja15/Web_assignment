/**
 * File: src/components/Footer.tsx
 * Student: Group 12
 * Date: August 15, 2026
 * Course: Full-Stack Web Applications — SAIT
 *
 * Description:
 * Site-wide footer with IMR company and contact information required by
 * the assignment. The content is static: address, phone, email, and hours.
 * Useful navigation sits beside the company details on every page.
 *
 * Inputs: COMPANY constants plus an optional signed-in flag.
 * Processing: Renders contact details and navigation in a responsive grid.
 * Outputs: The contentinfo landmark at the bottom of every page.
 */

import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { COMPANY } from "@/lib/constants";

type FooterProps = {
  signedIn?: boolean;
};

export function Footer({ signedIn = false }: FooterProps) {
  return (
    <footer className="mt-auto border-t">
      <div className="page-wrap grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-sm font-semibold tracking-tight">{COMPANY.shortName}</p>
          <p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">
            {COMPANY.name}. {COMPANY.tagline}
          </p>
        </div>
        <div>
          <h2 className="text-sm font-medium">Visit</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{COMPANY.address}</p>
          <p className="mt-2 text-sm text-muted-foreground">{COMPANY.hours}</p>
        </div>
        <div>
          <h2 className="text-sm font-medium">Contact</h2>
          <p className="mt-3 text-sm">
            <a className="text-muted-foreground hover:text-foreground" href={`tel:${COMPANY.phone.replace(/[^\d+]/g, "")}`}>
              {COMPANY.phone}
            </a>
          </p>
          <p className="mt-2 text-sm">
            <a className="text-muted-foreground hover:text-foreground" href={`mailto:${COMPANY.email}`}>
              {COMPANY.email}
            </a>
          </p>
        </div>
        <div>
          <h2 className="text-sm font-medium">Explore</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/" className="text-muted-foreground hover:text-foreground">
                Home
              </Link>
            </li>
            <li>
              <Link href="/movies" className="text-muted-foreground hover:text-foreground">
                Movies
              </Link>
            </li>
            {signedIn ? null : (
              <>
                <li>
                  <Link href="/login" className="text-muted-foreground hover:text-foreground">
                    Sign in
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="text-muted-foreground hover:text-foreground">
                    Create account
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
      <Separator />
      <p className="page-wrap py-4 text-xs text-muted-foreground">
        © {new Date().getFullYear()} {COMPANY.name}.
      </p>
    </footer>
  );
}
