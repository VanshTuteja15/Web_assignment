/**
 * File: tests/errors.test.ts
 * Student: Vansh Tuteja
 * Date: August 12, 2026
 * Course: Full-Stack Web Applications — SAIT
 *
 * Description:
 * Checks that database and Auth failures become short, safe messages.
 * Permission errors, missing rows, and bad credentials must not leak
 * stack traces or SQL to the browser.
 *
 * Inputs: Synthetic error objects that resemble Supabase responses.
 * Processing: Runs toUserMessage and toAuthMessage.
 * Outputs: Pass/fail results from `npm test`.
 */

import { describe, expect, it } from "vitest";
import { toAuthMessage, toUserMessage } from "@/lib/errors";

describe("toUserMessage", () => {
  it("maps row-level security failures to a permission line", () => {
    const message = toUserMessage(
      { code: "42501", message: "new row violates row-level security policy" },
      "fallback",
    );
    expect(message).toMatch(/permission/i);
  });

  it("maps a missing row to a not-found line", () => {
    const message = toUserMessage({ code: "PGRST116", message: "JSON object requested, 0 rows" }, "fallback");
    expect(message).toMatch(/found/i);
  });

  it("explains a missing movies table", () => {
    const message = toUserMessage(
      { code: "PGRST205", message: "Could not find the table 'public.movies' in the schema cache" },
      "fallback",
    );
    expect(message).toMatch(/schema\.sql/i);
  });
});

describe("toAuthMessage", () => {
  it("hides the raw invalid-login phrasing", () => {
    const message = toAuthMessage({ message: "Invalid login credentials" }, "fallback");
    expect(message).toBe("Email or password is incorrect.");
  });

  it("explains a duplicate sign-up", () => {
    const message = toAuthMessage({ message: "User already registered" }, "fallback");
    expect(message).toMatch(/already exists/i);
  });
});
