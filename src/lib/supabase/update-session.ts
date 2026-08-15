/**
 * File: src/lib/supabase/update-session.ts
 * Student: Group 12
 * Date: August 15, 2026
 * Course: Full-Stack Web Applications — SAIT
 *
 * Description:
 * Refreshes the Supabase Auth session on every matched request. The movie
 * list is public, so guests may open /movies. Only add and edit URLs require
 * a signed-in user; admin vs viewer is still checked in pages, actions, and
 * Row Level Security.
 *
 * Inputs: The incoming Next.js request (URL + cookies).
 * Processing: Confirms the signed-in user with getUser, copies refreshed
 *             cookies onto the response, and redirects GET navigations when
 *             the visitor is on the wrong side of auth. POST and Server Action
 *             requests are never redirected, because that would cancel sign-in.
 * Outputs: A NextResponse that either continues or redirects.
 */

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabasePublicConfig } from "@/lib/supabase/env";

function isAdminWritePath(path: string) {
  return path === "/movies/new" || /^\/movies\/[^/]+\/edit$/.test(path);
}

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

  // --- Refresh the Auth session ---
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isSignedIn = Boolean(user);

  const path = request.nextUrl.pathname;
  const isAuthPage = path === "/login" || path === "/signup";
  const isWritePath = isAdminWritePath(path);

  // Server Actions POST to the current page. Redirecting those requests
  // cancels sign-up / sign-in before cookies can be written.
  const isServerAction = request.headers.has("next-action") || request.headers.has("Next-Action");
  const isGet = request.method === "GET" || request.method === "HEAD";

  if (!isGet || isServerAction) {
    return response;
  }

  if (!isSignedIn && isWritePath) {
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
