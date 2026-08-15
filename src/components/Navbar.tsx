/**
 * File: src/components/Navbar.tsx
 * Student: Group 12
 * Date: August 15, 2026
 * Course: Full-Stack Web Applications — SAIT
 *
 * Description:
 * Site header for IMR. Links are fixed in the source (Home, Movies, Sign in
 * / Sign up). The mobile sheet is the only interactive piece. Admin tools
 * stay on the catalogue page; this bar only shows login or logout state.
 *
 * Inputs: AuthState and whether Supabase credentials are present.
 * Processing: Renders navigation, a mobile sheet, and a sign-out form.
 * Outputs: The header landmark shown on every page.
 */

"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOutAction } from "@/actions/auth";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { COMPANY } from "@/lib/constants";
import type { AuthState } from "@/lib/types";
import { cn } from "@/lib/utils";

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
    { href: "/movies", label: "Movies" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/50 backdrop-blur-md">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-foreground focus:px-3 focus:py-2 focus:text-background"
      >
        Skip to content
      </a>
      <nav aria-label="Primary" className="page-wrap flex h-14 items-center gap-4">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold tracking-tight">
          <span className="grid size-6 place-items-center rounded-md bg-foreground text-[11px] font-bold text-background">
            {COMPANY.shortName}
          </span>
          <span className="hidden sm:inline">{COMPANY.name}</span>
        </Link>

        <div className="ml-6 hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const active = isActivePath(pathname, link.href);
            return (
              <Button
                key={link.href}
                variant="ghost"
                size="sm"
                nativeButton={false}
                render={<Link href={link.href} />}
                className={cn(active && "bg-muted")}
              >
                {link.label}
              </Button>
            );
          })}
        </div>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          {signedIn ? (
            <>
              <div className="hidden items-center gap-2 lg:flex">
                <span className="max-w-[14rem] truncate text-sm text-muted-foreground">{auth.email}</span>
                <Badge variant={auth.isAdmin ? "default" : "secondary"}>
                  {auth.isAdmin ? "Admin" : "Viewer"}
                </Badge>
              </div>
              <form action={signOutAction}>
                <Button type="submit" variant="outline" size="sm">
                  Sign out
                </Button>
              </form>
            </>
          ) : (
            <>
              <Button nativeButton={false} variant="ghost" size="sm" render={<Link href="/login" />}>
                Sign in
              </Button>
              <Button nativeButton={false} size="sm" render={<Link href="/signup" />}>
                Sign up
              </Button>
            </>
          )}
          {!configured ? (
            <Badge variant="destructive">Setup needed</Badge>
          ) : null}
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "ml-auto md:hidden")}>
            <Menu />
            <span className="sr-only">Open menu</span>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetHeader>
              <SheetTitle>{COMPANY.shortName}</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-1 px-4">
              {links.map((link) => (
                <Button
                  key={link.href}
                  variant="ghost"
                  className="justify-start"
                  nativeButton={false}
                  render={<Link href={link.href} />}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Button>
              ))}
            </div>
            <Separator />
            <div className="flex flex-col gap-2 px-4 pb-4">
              {signedIn ? (
                <>
                  <p className="text-sm text-muted-foreground">{auth.email}</p>
                  <Badge variant={auth.isAdmin ? "default" : "secondary"} className="w-fit">
                    {auth.isAdmin ? "Admin" : "Viewer"}
                  </Badge>
                  <form action={signOutAction}>
                    <Button type="submit" variant="outline" className="w-full">
                      Sign out
                    </Button>
                  </form>
                </>
              ) : (
                <>
                  <Button nativeButton={false} variant="outline" render={<Link href="/login" />} onClick={() => setOpen(false)}>
                    Sign in
                  </Button>
                  <Button nativeButton={false} render={<Link href="/signup" />} onClick={() => setOpen(false)}>
                    Sign up
                  </Button>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
