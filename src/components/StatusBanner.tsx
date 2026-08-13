/**
 * File: src/components/StatusBanner.tsx
 * Student: Vansh Tuteja
 * Date: August 12, 2026
 * Course: Full-Stack Web Applications — SAIT
 *
 * Description:
 * Accessible success and error banners used after CRUD and Auth operations.
 * Messages are short and actionable. The component never prints stack traces.
 *
 * Inputs: tone (success/error/info) and the message text.
 * Processing: Maps tone to colour and an ARIA live region.
 * Outputs: A banner the user can read immediately after a form submission.
 */

type StatusBannerProps = {
  tone: "success" | "error" | "info";
  message: string;
};

const toneClass: Record<StatusBannerProps["tone"], string> = {
  success: "border-gold/50 bg-gold/10 text-gold-soft",
  error: "border-danger/50 bg-danger/10 text-ivory",
  info: "border-[var(--line)] bg-panel text-muted",
};

export function StatusBanner({ tone, message }: StatusBannerProps) {
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={`rounded-sm border px-4 py-3 text-sm leading-6 ${toneClass[tone]}`}
    >
      {message}
    </p>
  );
}
