/**
 * File: tests/validation.test.ts
 * Student: Vansh Tuteja
 * Date: August 12, 2026
 * Course: Full-Stack Web Applications — SAIT
 *
 * Description:
 * Automated tests for movie and auth validation. These specs cover the
 * Testing rubric: required fields, trimming, length limits, actor lists,
 * numeric years, impossible future years, and valid payloads. They run
 * without a live Supabase project.
 *
 * Inputs: Sample form values constructed in each test.
 * Processing: Calls validateMovieInput, parseActorList, validateEmail, and
 *             validatePassword, then asserts on the structured result.
 * Outputs: Pass/fail results from `npm test`.
 */

import { describe, expect, it } from "vitest";
import { getMaxReleaseYear, MIN_RELEASE_YEAR } from "@/lib/constants";
import {
  parseActorList,
  validateEmail,
  validateMovieInput,
  validatePassword,
} from "@/lib/validation";

const now = new Date("2026-08-12T12:00:00Z");

describe("parseActorList", () => {
  it("splits, trims, and drops empty names", () => {
    expect(parseActorList("  Michelle Yeoh , , Ke Huy Quan ")).toEqual([
      "Michelle Yeoh",
      "Ke Huy Quan",
    ]);
  });

  it("removes duplicate names without regard to case", () => {
    expect(parseActorList("Ada, ada, ADA")).toEqual(["Ada"]);
  });
});

describe("validateMovieInput", () => {
  it("accepts a complete, well-formed movie", () => {
    const result = validateMovieInput(
      {
        title: "  Spirited Away  ",
        actors: "Rumi Hiiragi, Miyu Irino",
        releaseYear: "2001",
      },
      now,
    );

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.title).toBe("Spirited Away");
      expect(result.data.actors).toEqual(["Rumi Hiiragi", "Miyu Irino"]);
      expect(result.data.releaseYear).toBe(2001);
    }
  });

  it("rejects an empty title after trimming", () => {
    const result = validateMovieInput(
      { title: "   ", actors: "Ada Lovelace", releaseYear: "1999" },
      now,
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.fieldErrors.title).toMatch(/required/i);
    }
  });

  it("rejects a title that is too long", () => {
    const result = validateMovieInput(
      { title: "A".repeat(201), actors: "Ada Lovelace", releaseYear: "1999" },
      now,
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.fieldErrors.title).toMatch(/200/);
    }
  });

  it("rejects an empty actors field", () => {
    const result = validateMovieInput(
      { title: "A film", actors: "   ", releaseYear: "1999" },
      now,
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.fieldErrors.actors).toBeTruthy();
    }
  });

  it("rejects actors that are only commas", () => {
    const result = validateMovieInput(
      { title: "A film", actors: ", , ,", releaseYear: "1999" },
      now,
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.fieldErrors.actors).toMatch(/at least one/i);
    }
  });

  it("rejects a missing year", () => {
    const result = validateMovieInput(
      { title: "A film", actors: "Ada Lovelace", releaseYear: "" },
      now,
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.fieldErrors.releaseYear).toMatch(/required/i);
    }
  });

  it("rejects a non-numeric year", () => {
    const result = validateMovieInput(
      { title: "A film", actors: "Ada Lovelace", releaseYear: "nineteen" },
      now,
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.fieldErrors.releaseYear).toMatch(/whole number/i);
    }
  });

  it("rejects a year before the earliest films", () => {
    const result = validateMovieInput(
      { title: "A film", actors: "Ada Lovelace", releaseYear: String(MIN_RELEASE_YEAR - 1) },
      now,
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.fieldErrors.releaseYear).toMatch(String(MIN_RELEASE_YEAR));
    }
  });

  it("rejects an obviously impossible future year", () => {
    const max = getMaxReleaseYear(now);
    const result = validateMovieInput(
      { title: "A film", actors: "Ada Lovelace", releaseYear: String(max + 5) },
      now,
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.fieldErrors.releaseYear).toMatch(/later than/i);
    }
  });

  it("accepts next calendar year for announced titles", () => {
    const result = validateMovieInput(
      {
        title: "Upcoming Feature",
        actors: "Ada Lovelace",
        releaseYear: String(getMaxReleaseYear(now)),
      },
      now,
    );
    expect(result.ok).toBe(true);
  });
});

describe("auth field validation", () => {
  it("rejects a blank email", () => {
    expect(validateEmail("  ")).toMatch(/required/i);
  });

  it("rejects a malformed email", () => {
    expect(validateEmail("not-an-email")).toMatch(/valid/i);
  });

  it("accepts a normal email", () => {
    expect(validateEmail("member@imr-rentals.ca")).toBeNull();
  });

  it("rejects a short password on sign-up", () => {
    expect(validatePassword("short", { isNewAccount: true })).toMatch(/8/);
  });

  it("accepts a long enough password on sign-up", () => {
    expect(validatePassword("long-enough", { isNewAccount: true })).toBeNull();
  });
});
