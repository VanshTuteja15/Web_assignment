/**
 * File: src/lib/movies.ts
 * Student: Group 12
 * Date: August 15, 2026
 * Course: Full-Stack Web Applications — SAIT
 *
 * Description:
 * Server-side data access for the movies table. Pages call these helpers
 * instead of embedding Supabase queries in JSX. Failures are returned as
 * structured results so the UI can show a friendly empty or error state
 * rather than crashing the route. Guests may list movies because RLS
 * allows anonymous SELECT.
 *
 * Inputs: Optional movie id; the caller's Auth cookies are read by the client.
 * Processing: Queries public.movies through the user's Supabase session.
 * Outputs: Movie rows, a single movie, or an error message.
 */

import { toUserMessage } from "@/lib/errors";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Movie } from "@/lib/types";

export type MovieListResult =
  | { ok: true; movies: Movie[] }
  | { ok: false; message: string };

export type MovieItemResult =
  | { ok: true; movie: Movie }
  | { ok: false; message: string };

export async function listMovies(): Promise<MovieListResult> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return {
      ok: false,
      message: "Supabase is not configured. Add your project URL and anon key to .env.local.",
    };
  }

  // --- Fetch movies ---
  const { data, error } = await supabase
    .from("movies")
    .select("id, title, actors, release_year, created_at")
    .order("title", { ascending: true });

  if (error) {
    return { ok: false, message: toUserMessage(error, "The catalogue could not be loaded.") };
  }

  return { ok: true, movies: (data ?? []) as Movie[] };
}

export async function getMovieById(id: string): Promise<MovieItemResult> {
  if (!id) {
    return { ok: false, message: "A movie id is required." };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return {
      ok: false,
      message: "Supabase is not configured. Add your project URL and anon key to .env.local.",
    };
  }

  const { data, error } = await supabase
    .from("movies")
    .select("id, title, actors, release_year, created_at")
    .eq("id", id)
    .maybeSingle<Movie>();

  if (error) {
    return { ok: false, message: toUserMessage(error, "That movie could not be loaded.") };
  }
  if (!data) {
    return { ok: false, message: "That movie could not be found." };
  }

  return { ok: true, movie: data };
}
