/**
 * File: src/proxy.ts
 * Student: Vansh Tuteja
 * Date: August 12, 2026
 * Course: Full-Stack Web Applications — SAIT
 *
 * Description:
 * Next.js 16 network proxy. It runs before matched routes so expired Auth
 * cookies can be refreshed and unauthenticated visitors cannot open the
 * catalogue or admin pages by typing a URL. Fine-grained admin checks still
 * belong in server actions and Supabase Row Level Security.
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
