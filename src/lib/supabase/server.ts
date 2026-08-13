/**
 * File: src/lib/supabase/server.ts
 * Student: Vansh Tuteja
 * Date: August 12, 2026
 * Course: Full-Stack Web Applications — SAIT
 *
 * Description:
 * Creates a request-scoped Supabase client for Server Components, Server
 * Actions, and Route Handlers. Cookies carry the Auth session. setAll is
 * wrapped in try/catch because Server Components cannot write cookies; the
 * proxy refreshes tokens on the way in instead.
 *
 * Inputs: Incoming request cookies plus the public Supabase credentials.
 * Processing: Builds a server client bound to this request's cookie jar.
 * Outputs: A Supabase client, or null when environment variables are missing.
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabasePublicConfig } from "@/lib/supabase/env";

export async function createServerSupabaseClient() {
  const config = getSupabasePublicConfig();
  if (!config) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient(config.url, config.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet, headers) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
          if (headers) {
            Object.entries(headers).forEach(([key, value]) => {
              void key;
              void value;
            });
          }
        } catch {
          // Called from a Server Component. The proxy writes refreshed cookies.
        }
      },
    },
  });
}
