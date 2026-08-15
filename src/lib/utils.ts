/**
 * File: src/lib/utils.ts
 * Student: Group 12
 * Date: August 15, 2026
 * Course: Full-Stack Web Applications — SAIT
 *
 * Description:
 * Class-name helper used by shadcn/ui components. It merges Tailwind
 * classes so later utilities can override earlier ones without fights.
 *
 * Inputs: Any number of class values (strings, conditionals, arrays).
 * Processing: clsx concatenates them; twMerge drops conflicting Tailwind rules.
 * Outputs: A single className string safe to put on a DOM node.
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
