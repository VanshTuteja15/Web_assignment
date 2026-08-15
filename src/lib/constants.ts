/**
 * File: src/lib/constants.ts
 * Student: Group 12
 * Date: August 15, 2026
 * Course: Full-Stack Web Applications — SAIT
 *
 * Description:
 * Shared limits and company copy used by validation, forms, and the footer.
 * Keeping these values in one file prevents the client form and the server
 * action from drifting apart, which would let invalid data through one path.
 *
 * Inputs: None. This module only exports constants.
 * Processing: None.
 * Outputs: Validation limits, year bounds, and IMR contact information.
 */

export const TITLE_MAX_LENGTH = 200;
export const ACTOR_NAME_MAX_LENGTH = 80;
export const ACTORS_MAX_COUNT = 20;
export const ACTORS_FIELD_MAX_LENGTH = 500;
export const PASSWORD_MIN_LENGTH = 8;

/** Earliest year accepted for a theatrical release (practical film history). */
export const MIN_RELEASE_YEAR = 1888;

/**
 * Latest year accepted. One year ahead of the current calendar year allows
 * announced upcoming titles without accepting obviously impossible dates.
 */
export function getMaxReleaseYear(now = new Date()): number {
  return now.getFullYear() + 1;
}

export const COMPANY = {
  name: "Internet Movies Rental Company",
  shortName: "IMR",
  tagline: "The neighbourhood catalogue, online.",
  address: "1301 16 Avenue NW, Calgary, AB T2M 0L4",
  phone: "(403) 555-0148",
  email: "catalogue@imr-rentals.ca",
  hours: "Daily 10:00–22:00 (Mountain Time)",
} as const;

/** Classroom demo administrator. Shown on a public banner so testers can sign in. */
export const DEMO_ADMIN = {
  email: "admin@gmail.com",
  password: "Admin123",
} as const;
