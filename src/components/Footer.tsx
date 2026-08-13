/**
 * File: src/components/Footer.tsx
 * Student: Vansh Tuteja
 * Date: August 12, 2026
 * Course: Full-Stack Web Applications — SAIT
 *
 * Description:
 * Site-wide footer with IMR company and contact information required by
 * the assignment. The content is static: address, phone, email, and hours.
 * Useful navigation and role-aware links sit beside the company details.
 *
 * Inputs: COMPANY constants plus optional signed-in and admin flags.
 * Processing: Renders contact details and navigation in a responsive grid.
 * Outputs: The contentinfo landmark at the bottom of every page.
 */

import Link from "next/link";
import { COMPANY } from "@/lib/constants";

type FooterProps = {
  signedIn?: boolean;
  isAdmin?: boolean;
};

export function Footer({ signedIn = false, isAdmin = false }: FooterProps) {
  return (
    <footer className="mt-16 border-t border-[var(--border)] bg-velvet">
      <div className="page-wrap grid gap-10 py-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <p className="font-display text-3xl font-semibold text-ivory">{COMPANY.shortName}</p>
          <p className="mt-3 max-w-xs text-sm leading-6 text-secondary">
            {COMPANY.name}. {COMPANY.tagline}
          </p>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Visit</h2>
          <p className="mt-3 text-sm leading-6 text-ivory">{COMPANY.address}</p>
          <p className="mt-2 text-sm text-secondary">{COMPANY.hours}</p>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Contact</h2>
          <p className="mt-3 text-sm">
            <a className="text-ivory hover:text-gold-soft cursor-pointer" href={`tel:${COMPANY.phone.replace(/[^\d+]/g, "")}`}>
              {COMPANY.phone}
            </a>
          </p>
          <p className="mt-2 text-sm">
            <a className="text-ivory hover:text-gold-soft cursor-pointer" href={`mailto:${COMPANY.email}`}>
              {COMPANY.email}
            </a>
          </p>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Explore</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/" className="text-ivory hover:text-gold-soft cursor-pointer">
                Home
              </Link>
            </li>
            <li>
              <Link href="/movies" className="text-ivory hover:text-gold-soft cursor-pointer">
                Catalogue
              </Link>
            </li>
            {isAdmin ? (
              <li>
                <Link href="/admin" className="text-ivory hover:text-gold-soft cursor-pointer">
                  Admin desk
                </Link>
              </li>
            ) : null}
            {signedIn ? null : (
              <>
                <li>
                  <Link href="/login" className="text-ivory hover:text-gold-soft cursor-pointer">
                    Sign in
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="text-ivory hover:text-gold-soft cursor-pointer">
                    Create account
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
      <p className="border-t border-[var(--border)] px-4 py-4 text-center text-xs tracking-[0.08em] text-muted">
        © {new Date().getFullYear()} {COMPANY.name}. Academic project for SAIT Full-Stack Web Applications.
      </p>
    </footer>
  );
}
