/**
 * File: src/lib/types.ts
 * Student: Vansh Tuteja
 * Date: August 12, 2026
 * Course: Full-Stack Web Applications — SAIT
 *
 * Description:
 * Shared TypeScript shapes for movies, profiles, form fields, and action
 * results. The application talks to Supabase in several places (server
 * components, server actions, and client forms). Central types keep those
 * layers aligned and make the instructor-facing code easier to follow.
 *
 * Inputs: None. This module only declares types.
 * Processing: None.
 * Outputs: Type aliases consumed by pages, components, and data helpers.
 */

export type UserRole = "user" | "admin";

export type Profile = {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
};

export type Movie = {
  id: string;
  title: string;
  actors: string[];
  release_year: number;
  created_at: string;
  updated_at: string;
};

export type MovieFormValues = {
  title: string;
  actors: string;
  releaseYear: string;
};

export type FieldErrors = Partial<Record<keyof MovieFormValues, string>>;

export type ActionResult =
  | { ok: true; message: string; movieId?: string }
  | { ok: false; message: string; fieldErrors?: FieldErrors };

export type AuthState = {
  userId: string | null;
  email: string | null;
  role: UserRole | null;
  isAdmin: boolean;
};
