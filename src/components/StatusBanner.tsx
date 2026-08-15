/**
 * File: src/components/StatusBanner.tsx
 * Student: Group 12
 * Date: August 15, 2026
 * Course: Full-Stack Web Applications — SAIT
 *
 * Description:
 * Accessible success and error banners used after CRUD and Auth operations.
 * Messages are short and actionable. The component never prints stack traces.
 *
 * Inputs: tone (success/error/info) and the message text.
 * Processing: Maps tone to a shadcn Alert.
 * Outputs: A banner the user can read immediately after a form submission.
 */

import { Alert, AlertDescription } from "@/components/ui/alert";

type StatusBannerProps = {
  tone: "success" | "error" | "info";
  message: string;
};

export function StatusBanner({ tone, message }: StatusBannerProps) {
  return (
    <Alert variant={tone === "error" ? "destructive" : "default"} role={tone === "error" ? "alert" : "status"}>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
