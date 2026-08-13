/**
 * File: src/components/Navbar.tsx
 * Student: Vansh Tuteja
 * Date: August 12, 2026
 * Course: Full-Stack Web Applications — SAIT
 *
 * Description:
 * Custom static site header for IMR. Links are fixed in the source (Home,
 * Catalogue, Admin, Sign in / Sign up). The mobile disclosure is the only
 * interactive piece. Admin links are hidden for regular users, but the
 * matching routes still enforce Auth and RLS on the server.
 *
 * Inputs: AuthState and whether Supabase credentials are present.
 * Processing: Renders navigation, a mobile menu, and a sign-out form.
 * Outputs: The header landmark shown on every page.
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOutAction } from "@/actions/auth";
import { COMPANY } from "@/lib/constants";
import type { AuthState } from "@/lib/types";

type NavbarProps = {
  auth: AuthState;
  configured: boolean;
};

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar({ auth, configured }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const signedIn = Boolean(auth.userId);

  const links = [
    { href: "/", label: "Home" },
    { href: "/movies", label: "Catalogue" },
    ...(auth.isAdmin ? [{ href: "/admin", label: "Admin" }] : []),
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[color:rgb(10_0_23_/_0.88)] backdrop-blur-md">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-gold focus:px-3 focus:py-2 focus:text-booth"
      >
        Skip to content
      </a>
      <nav aria-label="Primary" className="page-wrap relative flex items-center justify-between gap-4 py-3">
        <Link href="/" className="group flex min-h-11 items-center gap-3 cursor-pointer" onClick={() => setOpen(false)}>
          <span className="grid h-11 w-11 place-items-center rounded-xl border border-gold/50 bg-velvet text-gold" aria-hidden="true">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M8 5v14M16 5v14M3 9h18M3 15h18" />
            </svg>
          </span>
          <span>
            <span className="font-display block text-2xl font-semibold leading-none text-ivory group-hover:text-gold-soft transition-colors duration-200">
              {COMPANY.shortName}
            </span>
            <span className="block text-[0.68rem] font-medium uppercase tracking-[0.18em] text-secondary">
              Movie rentals
            </span>
          </span>
        </Link>

        <button
          type="button"
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-[var(--border)] text-ivory cursor-pointer md:hidden"
          aria-expanded={open}
          aria-controls="primary-links"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>

        <div
          id="primary-links"
          className={`${open ? "flex" : "hidden"} absolute left-0 right-0 top-full z-30 flex-col gap-1 border-b border-[var(--border)] bg-booth px-4 py-4 md:static md:flex md:flex-row md:items-center md:gap-1 md:border-0 md:bg-transparent md:p-0`}
        >
          {links.map((link) => {
            const active = isActivePath(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`min-h-11 rounded-lg px-3 py-2 text-sm font-semibold tracking-wide transition-colors duration-200 cursor-pointer ${
                  active
                    ? "text-gold-soft bg-gold/10"
                    : "text-secondary hover:text-ivory hover:bg-white/5"
                }`}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}

          <div className="mt-2 flex flex-col gap-2 border-t border-[var(--border)] pt-3 md:mt-0 md:ml-3 md:flex-row md:items-center md:border-t-0 md:pt-0">
            {signedIn ? (
              <>
                <p className="px-2 text-sm text-secondary">
                  <span className="block font-medium text-ivory">{auth.email}</span>
                  <span className={`mt-1 badge ${auth.isAdmin ? "badge-admin" : "badge-member"}`}>
                    {auth.isAdmin ? "Admin" : "Member"}
                  </span>
                </p>
                <form action={signOutAction}>
                  <button type="submit" className="btn btn-secondary w-full md:w-auto">
                    Sign out
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="btn btn-secondary w-full md:w-auto"
                  onClick={() => setOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="btn btn-primary w-full md:w-auto"
                  onClick={() => setOpen(false)}
                >
                  Sign up
                </Link>
              </>
            )}
            {!configured ? (
              <span className="px-2 text-xs font-semibold uppercase tracking-[0.12em] text-danger">Setup needed</span>
            ) : null}
          </div>
        </div>
      </nav>
    </header>
  );
}
