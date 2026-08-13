# IMR Movie Portal

Staff portal for the **Internet Movies Rental Company (IMR)**. Members sign in to browse the catalogue. Administrators add, edit, and delete titles. Every movie row is stored in Supabase — the page never uses a hard-coded list as the database.

This is a solo SAIT Full-Stack Web Applications assignment by **Vansh Tuteja**.

---

## Assignment purpose

IMR needs a web portal for its movie database with two authentication levels. The application is built with Node.js, Next.js, and Supabase, and includes a custom navbar, a company footer, a movie list (title, actors, release year), full CRUD for administrators, and Row Level Security so members cannot bypass the UI.

## Features

- Sign up, sign in, and sign out with Supabase Auth
- Regular members: view the catalogue only
- Administrators: add, edit, and delete movies
- Movie cards show title, actors, and release year
- Client and server validation for every write
- Search and sort on the catalogue page
- Loading, empty, error, and confirmation states
- Responsive layout (mobile through desktop)

## Technology stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI | React 19, Tailwind CSS 4 |
| Auth + database | Supabase (Postgres, Auth, RLS) |
| Tests | Vitest |

## Project structure

```
imr-portal/
├── src/
│   ├── app/                 Pages and layouts (App Router)
│   ├── actions/             Server Actions (auth + movie CRUD)
│   ├── components/          Navbar, Footer, MovieList, forms, dialogs
│   ├── lib/                 Validation, types, Supabase clients, data access
│   └── proxy.ts             Session refresh and coarse route protection
├── supabase/schema.sql      Tables, RLS, triggers, seed movies
├── tests/                   Validation and error-mapping specs
├── .env.example             Public credential placeholders
└── README.md
```

## Environment variables

Copy `.env.example` to `.env.local` (already done on this machine):

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Project URL from Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Anon / publishable key. Safe in the browser. RLS protects the data. |

Never put the **service-role** key in this project. It is not used.

`.env.local` is git-ignored.

## Supabase setup

1. Create a free project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** → New query.
3. Paste the entire contents of `supabase/schema.sql` and run it.
4. Open **Authentication → Providers → Email**.
   - For classroom testing, turn **Confirm email** off so sign-up can sign you in immediately.
5. Copy the Project URL and the anon/publishable key into `.env.local`.

### Database structure

**`public.profiles`**

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid | Matches `auth.users.id` |
| `email` | text | Unique |
| `role` | text | `user` or `admin` |
| `created_at` | timestamptz | |

**`public.movies`**

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid | Primary key |
| `title` | text | 1–200 characters after trim |
| `actors` | text[] | 1–20 names |
| `release_year` | integer | 1888–2100 (app also caps at next calendar year) |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | Maintained by a trigger |

A trigger on `auth.users` inserts a `profiles` row with `role = 'user'` on every sign-up.

### Row Level Security

- Authenticated users may **select** movies.
- Only `public.is_admin()` may **insert, update, or delete** movies.
- Users may read their own profile; admins may read all profiles.

Hiding buttons in the UI is not enough. A member who calls the Data API with their own session still cannot change rows.

### Authentication setup

Email/password through Supabase Auth. New accounts are regular members.

### Admin setup

1. Sign up in the web app with your SAIT email.
2. In the SQL Editor run:

```sql
update public.profiles
   set role = 'admin'
 where email = 'vansh.tuteja@edu.sait.ca';
```

3. Sign out and sign in again so the portal reloads your role.

## Local installation

```bash
cd imr-portal
npm install
cp .env.example .env.local
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

## Testing

```bash
npm test
npm run lint
```

`npm test` runs Vitest against validation and error mapping (empty fields, invalid years, permission messages, and valid payloads).

Manual checks after Supabase is connected:

1. Sign up as a regular member → catalogue visible, no Add/Edit/Delete.
2. Open `/movies/new` as that member → redirected to `/forbidden`.
3. Promote the account to admin in SQL, sign in again → Add/Edit/Delete work and persist in the Table Editor.
4. Submit empty title, comma-only actors, and year `3000` → form refuses the save.
5. Delete a title → confirmation dialog, then the row disappears from Supabase.

## Deployment (Vercel)

The project is **deployment-ready**. It is not claimed as live until you complete these steps:

1. Push `imr-portal` to GitHub (this folder is the app root).
2. Import the repo in [Vercel](https://vercel.com).
3. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in the Vercel project environment.
4. In Supabase → Authentication → URL configuration, add `https://YOUR-PROJECT.vercel.app` to **Site URL** and **Redirect URLs**.
5. Deploy. Confirm `/movies` loads after sign-in.

## Known limitations

- Email confirmation, if left enabled in Supabase, requires the visitor to confirm before a session exists. Disable it for local demos or tell testers to check their inbox.
- Administrator promotion is a one-line SQL update. There is no “make admin” button in the UI, on purpose.
- The publishable/anon key is public by design. Security comes from RLS, not from hiding that key.

## Main routes

| Path | Who |
| --- | --- |
| `/` | Everyone (landing) |
| `/login`, `/signup` | Visitors |
| `/movies` | Signed-in members and admins |
| `/movies/new`, `/movies/[id]/edit`, `/admin` | Administrators |
| `/forbidden` | Members who open an admin URL |
