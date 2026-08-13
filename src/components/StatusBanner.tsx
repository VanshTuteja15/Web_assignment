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
  success: "border-emerald-400/40 bg-emerald-400/10 text-emerald-200",
  error: "border-danger/60 bg-danger/15 text-ivory",
  info: "border-[var(--border)] bg-velvet text-secondary",
};

export function StatusBanner({ tone, message }: StatusBannerProps) {
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={`rounded-xl border px-4 py-3 text-sm leading-6 ${toneClass[tone]}`}
    >
      {message}
    </p>
  );
}
