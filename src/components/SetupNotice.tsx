/**
 * File: src/components/SetupNotice.tsx
 * Student: Group 12
 * Date: August 15, 2026
 * Course: Full-Stack Web Applications — SAIT
 *
 * Description:
 * Shown when NEXT_PUBLIC_SUPABASE_URL or the anon key is missing so the
 * app can still build and render without pretending the database works.
 * Instructors and students get the exact files and dashboard steps to finish.
 *
 * Inputs: None.
 * Processing: Renders a static checklist.
 * Outputs: A visible configuration warning.
 */

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function SetupNotice() {
  return (
    <Alert variant="destructive">
      <AlertTitle>Supabase is not configured yet</AlertTitle>
      <AlertDescription>
        <p className="mb-3">The application is running, but it has no database credentials. Add them locally, then reload.</p>
        <ol className="list-decimal space-y-1 pl-5">
          <li>
            Create a free project at supabase.com and run <code>supabase/schema.sql</code> in the SQL Editor.
          </li>
          <li>
            Copy <code>.env.local.example</code> to <code>.env.local</code>.
          </li>
          <li>Paste the Project URL and anon key. Never paste the service-role key.</li>
          <li>
            Restart <code>npm run dev</code>.
          </li>
        </ol>
      </AlertDescription>
    </Alert>
  );
}
