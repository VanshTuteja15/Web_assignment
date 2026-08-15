# IMR Movie Portal

Staff and public portal for the **Internet Movies Rental Company (IMR)**. Anyone can browse the movie catalogue. Administrators sign in to add, edit, and delete titles. Every movie row is stored in Supabase — the page never uses a hard-coded list as the database.

This is a SAIT Full-Stack Web Applications assignment by **Group 12**.

---

## Assignment purpose

IMR needs a web portal for its movie database with two authentication levels. The application is built with Next.js and Supabase, and includes a custom navbar, a company footer, a movie list (title, actors, release year), full CRUD for administrators, and Row Level Security so viewers cannot bypass the UI.

## Features

- Public catalogue: guests can browse without signing in
- Sign up, sign in, and sign out with Supabase Auth
- Viewers: read-only list (same as guests, with a signed-in session)
- Administrators: add, edit, and delete movies
- Movie cards show title, actors, and release year
- Client and server validation for every write
- Loading, empty, error, and confirmation states
- Responsive layout (mobile through desktop)

## Technology stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI | React 19, Tailwind CSS 4, shadcn/ui |
| Auth + database | Supabase (Postgres, Auth, RLS) |

## Project structure

```
imr-portal/
├── src/
│   ├── app/                 Pages and layouts (App Router)
│   ├── actions/             Server Actions (auth + movie CRUD)
│   ├── components/          Navbar, Footer, MovieList, forms, dialogs
│   ├── lib/                 Validation, types, Supabase clients, data access
│   └── proxy.ts             Session refresh and add/edit route protection
├── supabase/schema.sql      Tables, RLS, triggers, seed movies
├── .env.local.example       Public credential placeholders
└── README.md
```

## Environment variables

Copy `.env.local.example` to `.env.local`:

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Project URL from Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Anon / publishable key. Safe in the browser. RLS protects the data. |

`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` is an optional alias for the same key.

Never put the **service-role** key in this project. It is not used.

`.env.local` is git-ignored.

## Supabase setup

1. Create a free project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** → New query.
3. Paste the entire contents of `supabase/schema.sql` and run it.
4. Open **Authentication → Providers → Email**.
   - For classroom testing, turn **Confirm email** off so sign-up can sign you in immediately.
5. Copy the Project URL and the anon key into `.env.local`.

### Database structure

**`public.profiles`**

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid | Matches `auth.users.id` |
| `email` | text | Unique |
| `role` | text | `viewer` or `admin` |
| `created_at` | timestamptz | |

**`public.movies`**

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid | Primary key |
| `title` | text | 1–200 characters after trim |
| `actors` | text[] | 1–20 names |
| `release_year` | integer | 1888–2100 (app also caps at next calendar year) |
| `created_at` | timestamptz | |

A trigger on `auth.users` inserts a `profiles` row with `role = 'viewer'` on every sign-up.

### Row Level Security

- **Anyone** (`anon` and `authenticated`) may **select** movies.
- Only `public.is_admin()` may **insert, update, or delete** movies.
- Users may read their own profile; admins may read all profiles.
- Profile inserts must use `role = 'viewer'` — nobody can self-promote through the API.

Hiding buttons in the UI is not enough. A viewer who calls the Data API with their own session still cannot change rows.

### Authentication setup

Email/password through Supabase Auth. New accounts are viewers. The catalogue itself does not require a login.

### Admin setup

1. Sign up in the web app with your SAIT email.
2. In the SQL Editor run:

```sql
update public.profiles
   set role = 'admin'
 where email = 'YOUR_EMAIL';
```

3. Sign out and sign in again so the portal reloads your role.

## Local installation

```bash
npm install
cp .env.local.example .env.local
```

Fill `.env.local`, then run `supabase/schema.sql` in the Supabase SQL Editor.

## How to run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How to build

```bash
npm run build
npm start
```

## Deployment (Vercel)

The project is **deployment-ready**. Complete these steps to go live:

1. Push this repository to GitHub (this folder is the app root).
2. Import the repo in [Vercel](https://vercel.com).
3. Set these environment variables in the Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. In Supabase → Authentication → URL configuration, add `https://YOUR-PROJECT.vercel.app` to **Site URL** and **Redirect URLs**.
5. Deploy. Confirm `/movies` loads for guests and that admin CRUD still works after sign-in.

## Known limitations

- Email confirmation, if left enabled in Supabase, requires the visitor to confirm before a session exists. Disable it for local demos or tell testers to check their inbox.
- Administrator promotion is a one-line SQL update. There is no “make admin” button in the UI, on purpose.
- The anon key is public by design. Security comes from RLS, not from hiding that key.

## Main routes

| Path | Who |
| --- | --- |
| `/` | Everyone (landing) |
| `/movies` | Everyone (public catalogue) |
| `/login`, `/signup` | Visitors |
| `/movies/new`, `/movies/[id]/edit` | Administrators |
| `/forbidden` | Viewers who open an admin URL |
