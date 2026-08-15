/**
 * File: src/lib/auth.ts
 * Student: Group 12
 * Date: August 15, 2026
 * Course: Full-Stack Web Applications — SAIT
 *
 * Description:
 * Loads the current Auth user and their profile role for Server Components
 * and Server Actions. The role always comes from the profiles table, not
 * from client-editable user metadata, so a visitor cannot promote themselves
 * by editing local storage.
 *
 * Inputs: The Auth session stored in cookies.
 * Processing: Verifies the user with getUser, then reads public.profiles.
 * Outputs: An AuthState object (signed-out when no session exists).
 */

import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { AuthState, Profile, UserRole } from "@/lib/types";

const signedOut: AuthState = {
  userId: null,
  email: null,
  role: null,
  isAdmin: false,
};

export async function getAuthState(): Promise<AuthState> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return signedOut;
  }

  // --- Resolve the signed-in user ---
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return signedOut;
  }

  // --- Load role from profiles (never from client metadata) ---
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, role, created_at")
    .eq("id", user.id)
    .maybeSingle<Profile>();

  const role: UserRole = profile?.role === "admin" ? "admin" : "viewer";

  return {
    userId: user.id,
    email: profile?.email ?? user.email ?? null,
    role,
    isAdmin: role === "admin",
  };
}

export async function requireUser(): Promise<AuthState> {
  const auth = await getAuthState();
  if (!auth.userId) {
    throw new Error("You must be signed in to change the catalogue.");
  }
  return auth;
}

export async function requireAdmin(): Promise<AuthState> {
  const auth = await requireUser();
  if (!auth.isAdmin) {
    throw new Error("Only administrators can change the catalogue.");
  }
  return auth;
}
