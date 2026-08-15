# IMR Movie Portal

Web portal for the **Internet Movies Rental Company**. Anyone can browse the catalogue. Admins sign in to add, edit, and delete movies.

Assignment Full-Stack Web Applications — **Group 12**.

**Stack:** Next.js 16, TypeScript, Tailwind CSS 4, shadcn/ui, Supabase.

## Setup

```bash
npm install
cp .env.local.example .env.local
```

Fill `.env.local` with your Supabase **Project URL** and **anon key** (Project Settings → API). Do not use the service-role key.

Then in Supabase:

1. SQL Editor → paste and run `supabase/schema.sql`.
2. Authentication → Providers → Email → turn **Confirm email** off for classroom testing.

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Roles

New sign-ups are **viewers** (read-only). To make an admin, run this in the SQL Editor, then sign out and back in:

```sql
update public.profiles
   set role = 'admin'
 where email = 'YOUR_EMAIL';
```

Demo admin (must exist in Auth with `role = 'admin'`): `admin@gmail.com` / `Admin123`.

## Routes

| Path | Access |
| --- | --- |
| `/` | Landing |
| `/movies` | Public catalogue |
| `/login`, `/signup` | Auth |
| `/movies/new`, `/movies/[id]/edit` | Admins only |

## Deploy

Import the repo in [Vercel](https://vercel.com), set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and add your Vercel URL under Supabase → Authentication → URL configuration.
