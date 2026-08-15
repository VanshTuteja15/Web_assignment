/**
 * File: src/components/DemoLoginBanner.tsx
 * Student: Group 12
 * Date: August 15, 2026
 * Course: Full-Stack Web Applications — SAIT
 *
 * Description:
 * Public classroom banner that prints the demo administrator email and
 * password so testers can sign in without guessing credentials. It is
 * positioned over the landing title area, not as a site-wide header.
 *
 * Inputs: DEMO_ADMIN email and password from constants; optional className.
 * Processing: Renders a compact overlay notice.
 * Outputs: A visible notice sitting on the title block.
 */

import { DEMO_ADMIN } from "@/lib/constants";
import { cn } from "@/lib/utils";

type DemoLoginBannerProps = {
  className?: string;
};

export function DemoLoginBanner({ className }: DemoLoginBannerProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-sm text-muted-foreground backdrop-blur-md",
        className,
      )}
    >
      Test admin login:{" "}
      <span className="font-medium text-foreground">{DEMO_ADMIN.email}</span>
      <span className="mx-2 text-white/20">·</span>
      password{" "}
      <span className="font-medium text-foreground">{DEMO_ADMIN.password}</span>
    </div>
  );
}
