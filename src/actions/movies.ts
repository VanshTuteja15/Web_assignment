/**
 * File: src/actions/movies.ts
 * Student: Vansh Tuteja
 * Date: August 12, 2026
 * Course: Full-Stack Web Applications — SAIT
 *
 * Description:
 * Server Actions that create, update, and delete movies. Every mutation
 * re-validates the payload, confirms the caller is an administrator, and
 * then talks to Supabase. Row Level Security is the last line of defence
 * if someone calls the Data API with a stolen anon key and a regular-user
 * session.
 *
 * Inputs: FormData from MovieForm or a movie id from DeleteMovieButton.
 * Processing: Auth check → validation → insert/update/delete → revalidate.
 * Outputs: ActionResult for the form, or a redirect after a successful write.
 */

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { toUserMessage } from "@/lib/errors";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types";
import { validateMovieInput } from "@/lib/validation";

function readMovieFields(formData: FormData) {
  return {
    title: String(formData.get("title") ?? ""),
    actors: String(formData.get("actors") ?? ""),
    releaseYear: String(formData.get("releaseYear") ?? ""),
  };
}

export async function createMovieAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  try {
    await requireAdmin();
  } catch (error) {
    return { ok: false, message: toUserMessage(error, "Only administrators can add movies.") };
  }

  const parsed = validateMovieInput(readMovieFields(formData));
  if (!parsed.ok) {
    return { ok: false, message: "Please fix the highlighted fields.", fieldErrors: parsed.fieldErrors };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { ok: false, message: "Supabase is not configured." };
  }

  const { error } = await supabase
    .from("movies")
    .insert({
      title: parsed.data.title,
      actors: parsed.data.actors,
      release_year: parsed.data.releaseYear,
    })
    .select("id")
    .single();

  if (error) {
    return { ok: false, message: toUserMessage(error, "The movie could not be added.") };
  }

  revalidatePath("/movies");
  revalidatePath("/admin");
  redirect("/movies?status=created");
}

export async function updateMovieAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  try {
    await requireAdmin();
  } catch (error) {
    return { ok: false, message: toUserMessage(error, "Only administrators can edit movies.") };
  }

  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    return { ok: false, message: "A movie id is required to save changes." };
  }

  const parsed = validateMovieInput(readMovieFields(formData));
  if (!parsed.ok) {
    return { ok: false, message: "Please fix the highlighted fields.", fieldErrors: parsed.fieldErrors };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { ok: false, message: "Supabase is not configured." };
  }

  const { data, error } = await supabase
    .from("movies")
    .update({
      title: parsed.data.title,
      actors: parsed.data.actors,
      release_year: parsed.data.releaseYear,
    })
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) {
    return { ok: false, message: toUserMessage(error, "The movie could not be updated.") };
  }
  if (!data) {
    return { ok: false, message: "That movie could not be found, or you are not allowed to edit it." };
  }

  revalidatePath("/movies");
  revalidatePath("/admin");
  revalidatePath(`/movies/${id}/edit`);
  redirect("/movies?status=updated");
}

export async function deleteMovieAction(movieId: string): Promise<ActionResult> {
  try {
    await requireAdmin();
  } catch (error) {
    return { ok: false, message: toUserMessage(error, "Only administrators can delete movies.") };
  }

  const id = movieId.trim();
  if (!id) {
    return { ok: false, message: "A movie id is required to delete a title." };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { ok: false, message: "Supabase is not configured." };
  }

  const { data, error } = await supabase
    .from("movies")
    .delete()
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) {
    return { ok: false, message: toUserMessage(error, "The movie could not be deleted.") };
  }
  if (!data) {
    return { ok: false, message: "That movie could not be found, or you are not allowed to delete it." };
  }

  revalidatePath("/movies");
  revalidatePath("/admin");
  return { ok: true, message: "Movie removed from the catalogue." };
}
