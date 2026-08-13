/**
 * File: src/lib/supabase/env.ts
 * Student: Vansh Tuteja
 * Date: August 12, 2026
 * Course: Full-Stack Web Applications — SAIT
 *
 * Description:
 * Reads the public Supabase URL and anon/publishable key from environment
 * variables. Only public credentials are used. The service-role key is never
 * read by this application, which keeps privileged access off the client
 * and out of the Next.js bundle.
 *
 * Inputs: process.env values set in .env.local or the host (Vercel).
 * Processing: Trims values and accepts either ANON_KEY or PUBLISHABLE_KEY names.
 * Outputs: A config object, or null when the project has not been configured yet.
 */

export type SupabasePublicConfig = {
  url: string;
  anonKey: string;
};

export function getSupabasePublicConfig(): SupabasePublicConfig | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
  const anonKey = (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    ""
  ).trim();

  if (!url || !anonKey || url.includes("YOUR_PROJECT_REF")) {
    return null;
  }

  return { url, anonKey };
}

export function isSupabaseConfigured(): boolean {
  return getSupabasePublicConfig() !== null;
}
