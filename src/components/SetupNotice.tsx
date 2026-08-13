/**
 * File: src/components/SetupNotice.tsx
 * Student: Vansh Tuteja
 * Date: August 12, 2026
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

export function SetupNotice() {
  return (
    <section
      role="status"
      className="mx-auto max-w-3xl rounded-sm border border-rust/50 bg-panel px-5 py-6 text-ivory"
    >
      <h2 className="font-display text-3xl text-gold">Supabase is not configured yet</h2>
      <p className="mt-3 text-sm leading-6 text-muted">
        The application is running, but it has no database credentials. Add them locally, then reload.
      </p>
      <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-6">
        <li>Create a free project at supabase.com and run <code className="text-gold-soft">supabase/schema.sql</code> in the SQL Editor.</li>
        <li>Copy <code className="text-gold-soft">.env.example</code> to <code className="text-gold-soft">.env.local</code>.</li>
        <li>Paste the Project URL and anon (publishable) key. Never paste the service-role key.</li>
        <li>Restart <code className="text-gold-soft">npm run dev</code>.</li>
      </ol>
    </section>
  );
}
