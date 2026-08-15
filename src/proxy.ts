/**
 * File: src/proxy.ts
 * Student: Group 12
 * Date: August 15, 2026
 * Course: Full-Stack Web Applications — SAIT
 *
 * Description:
 * Next.js 16 network proxy. It runs before matched routes so expired Auth
 * cookies can be refreshed. Guests may browse the catalogue. Add and edit
 * URLs require a session; fine-grained admin checks still belong in server
 * actions and Supabase Row Level Security.
 *
 * Inputs: Every non-static request that matches the matcher below.
 * Processing: Delegates to updateSession, which talks to Supabase Auth.
 * Outputs: A forwarded or redirected response with up-to-date cookies.
 */

import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/update-session";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
