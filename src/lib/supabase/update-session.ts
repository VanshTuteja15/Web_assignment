/**
 * File: src/lib/supabase/update-session.ts
 * Student: Vansh Tuteja
 * Date: August 12, 2026
 * Course: Full-Stack Web Applications — SAIT
 *
 * Description:
 * Refreshes the Supabase Auth session on every matched request and enforces
 * coarse route protection. Admin vs regular-user checks still happen in
 * server actions and RLS; this layer only requires a signed-in user for
 * catalogue and admin URLs, and sends signed-in visitors away from login.
 *
 * Inputs: The incoming Next.js request (URL + cookies).
 * Processing: Confirms the signed-in user with getUser, copies refreshed
 *             cookies onto the response, and redirects GET navigations when
 *             the visitor is on the wrong side of auth. POST and Server Action
 *             requests are never redirected, because that would cancel sign-up.
 * Outputs: A NextResponse that either continues or redirects.
 */

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabasePublicConfig } from "@/lib/supabase/env";

export async function updateSession(request: NextRequest) {
  const config = getSupabasePublicConfig();
  if (!config) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(config.url, config.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
        if (headers) {
          Object.entries(headers).forEach(([key, value]) => {
            response.headers.set(key, value);
          });
        }
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isSignedIn = Boolean(user);

  const path = request.nextUrl.pathname;
  const isAuthPage = path === "/login" || path === "/signup";
  const isProtected =
    path === "/movies" ||
    path.startsWith("/movies/") ||
    path === "/admin" ||
    path.startsWith("/admin/");

  // Server Actions POST to the current page. Redirecting those requests
  // cancels sign-up / sign-in before cookies can be written.
  const isServerAction = request.headers.has("next-action") || request.headers.has("Next-Action");
  const isGet = request.method === "GET" || request.method === "HEAD";

  if (!isGet || isServerAction) {
    return response;
  }

  if (!isSignedIn && isProtected) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("next", path);
    return NextResponse.redirect(redirectUrl);
  }

  if (isSignedIn && isAuthPage) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/movies";
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}
