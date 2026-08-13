/**
 * File: src/lib/supabase/client.ts
 * Student: Vansh Tuteja
 * Date: August 12, 2026
 * Course: Full-Stack Web Applications — SAIT
 *
 * Description:
 * Creates the browser Supabase client used by Client Components. The helper
 * from @supabase/ssr stores the session in cookies so Server Components and
 * the Next.js proxy can see the same user. Only the public anon key is used.
 *
 * Inputs: Public Supabase URL and anon key from the environment.
 * Processing: Instantiates a browser client with cookie-based session storage.
 * Outputs: A Supabase client safe to call from the browser, or null if unset.
 */

"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublicConfig } from "@/lib/supabase/env";

export function createBrowserSupabaseClient() {
  const config = getSupabasePublicConfig();
  if (!config) {
    return null;
  }

  return createBrowserClient(config.url, config.anonKey);
}
