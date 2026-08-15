/**
 * File: src/lib/validation.ts
 * Student: Group 12
 * Date: August 15, 2026
 * Course: Full-Stack Web Applications — SAIT
 *
 * Description:
 * Validates movie and authentication input before it is written to Supabase.
 * The same functions run in the browser (fast feedback) and again inside
 * server actions (so a user cannot bypass the form with a crafted request).
 * Rules cover required fields, trimming, length limits, actor lists, and
 * a four-digit release-year range.
 *
 * Inputs: Raw strings from forms (title, actors, release year, email, password).
 * Processing: Trims whitespace, splits actor names, parses integers, and
 *             collects per-field error messages.
 * Outputs: Either a normalised payload ready for the database or field errors.
 */

import {
  ACTOR_NAME_MAX_LENGTH,
  ACTORS_FIELD_MAX_LENGTH,
  ACTORS_MAX_COUNT,
  MIN_RELEASE_YEAR,
  PASSWORD_MIN_LENGTH,
  TITLE_MAX_LENGTH,
  getMaxReleaseYear,
} from "@/lib/constants";
import type { FieldErrors, MovieFormValues } from "@/lib/types";

export type ValidatedMovie = {
  title: string;
  actors: string[];
  releaseYear: number;
};

export type MovieValidationResult =
  | { ok: true; data: ValidatedMovie }
  | { ok: false; fieldErrors: FieldErrors };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Splits a comma-separated actor field into unique, trimmed names.
 * Empty tokens are discarded so "Ada, , Bob" becomes ["Ada", "Bob"].
 */
export function parseActorList(raw: string): string[] {
  const seen = new Set<string>();
  const actors: string[] = [];

  for (const token of raw.split(",")) {
    const name = token.trim().replace(/\s+/g, " ");
    if (!name) {
      continue;
    }
    const key = name.toLowerCase();
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    actors.push(name);
  }

  return actors;
}

export function validateMovieInput(
  values: MovieFormValues,
  now = new Date(),
): MovieValidationResult {
  const fieldErrors: FieldErrors = {};
  const title = values.title.trim().replace(/\s+/g, " ");
  const actorsRaw = values.actors.trim();
  const yearRaw = values.releaseYear.trim();
  const maxYear = getMaxReleaseYear(now);

  if (!title) {
    fieldErrors.title = "Title is required.";
  } else if (title.length > TITLE_MAX_LENGTH) {
    fieldErrors.title = `Title must be ${TITLE_MAX_LENGTH} characters or fewer.`;
  }

  if (!actorsRaw) {
    fieldErrors.actors = "Enter at least one actor, separated by commas.";
  } else if (actorsRaw.length > ACTORS_FIELD_MAX_LENGTH) {
    fieldErrors.actors = `The actors field must be ${ACTORS_FIELD_MAX_LENGTH} characters or fewer.`;
  } else {
    const actors = parseActorList(actorsRaw);
    if (actors.length === 0) {
      fieldErrors.actors = "Enter at least one actor name.";
    } else if (actors.length > ACTORS_MAX_COUNT) {
      fieldErrors.actors = `List at most ${ACTORS_MAX_COUNT} actors.`;
    } else if (actors.some((name) => name.length > ACTOR_NAME_MAX_LENGTH)) {
      fieldErrors.actors = `Each actor name must be ${ACTOR_NAME_MAX_LENGTH} characters or fewer.`;
    }
  }

  if (!yearRaw) {
    fieldErrors.releaseYear = "Release year is required.";
  } else if (!/^\d{4}$/.test(yearRaw)) {
    fieldErrors.releaseYear = "Release year must be a 4-digit number.";
  } else {
    const year = Number.parseInt(yearRaw, 10);
    if (year < MIN_RELEASE_YEAR) {
      fieldErrors.releaseYear = `Release year cannot be earlier than ${MIN_RELEASE_YEAR}.`;
    } else if (year > maxYear) {
      fieldErrors.releaseYear = `Release year cannot be later than ${maxYear}.`;
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, fieldErrors };
  }

  return {
    ok: true,
    data: {
      title,
      actors: parseActorList(actorsRaw),
      releaseYear: Number.parseInt(yearRaw, 10),
    },
  };
}

export function validateEmail(email: string): string | null {
  const value = email.trim().toLowerCase();
  if (!value) {
    return "Email is required.";
  }
  if (!EMAIL_PATTERN.test(value)) {
    return "Enter a valid email address.";
  }
  return null;
}

export function validatePassword(password: string, { isNewAccount }: { isNewAccount: boolean }): string | null {
  if (!password) {
    return "Password is required.";
  }
  if (isNewAccount && password.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
  }
  return null;
}

export function formatActors(actors: string[]): string {
  return actors.join(", ");
}
