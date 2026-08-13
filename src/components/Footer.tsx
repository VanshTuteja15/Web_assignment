/**
 * File: src/components/Footer.tsx
 * Student: Vansh Tuteja
 * Date: August 12, 2026
 * Course: Full-Stack Web Applications — SAIT
 *
 * Description:
 * Site-wide footer with IMR company and contact information required by
 * the assignment. The content is static: address, phone, email, and hours.
 * It is a server component because it never needs client interactivity.
 *
 * Inputs: COMPANY constants from src/lib/constants.ts.
 * Processing: Renders contact details in a responsive three-column layout.
 * Outputs: The contentinfo landmark at the bottom of every page.
 */

import { COMPANY } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-[var(--line)] bg-velvet">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-display text-3xl text-gold">{COMPANY.shortName}</p>
          <p className="mt-2 max-w-xs text-sm leading-6 text-muted">{COMPANY.name}. {COMPANY.tagline}</p>
        </div>
        <div>
          <h2 className="text-xs uppercase tracking-[0.2em] text-gold">Visit</h2>
          <p className="mt-3 text-sm leading-6 text-ivory">{COMPANY.address}</p>
          <p className="mt-2 text-sm text-muted">{COMPANY.hours}</p>
        </div>
        <div>
          <h2 className="text-xs uppercase tracking-[0.2em] text-gold">Contact</h2>
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
      </div>
      <p className="border-t border-[var(--line)] px-4 py-4 text-center text-xs tracking-[0.14em] text-muted">
        © {new Date().getFullYear()} {COMPANY.name}. Academic project for SAIT Full-Stack Web Applications.
      </p>
    </footer>
  );
}
