/**
 * File: vitest.config.mts
 * Student: Vansh Tuteja
 * Date: August 12, 2026
 * Course: Full-Stack Web Applications — SAIT
 *
 * Description:
 * Configures Vitest so the assignment's validation and error-mapping tests can
 * run without starting Next.js or connecting to Supabase. The alias matches
 * the Next.js "@/*" path so tests import the same modules the app uses.
 *
 * Inputs: None at runtime; Vitest reads this file when `npm test` is executed.
 * Processing: Resolves TypeScript path aliases and selects the Node test environment.
 * Outputs: A Vitest configuration object consumed by the test runner.
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(root, "./src"),
    },
  },
});
