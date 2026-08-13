-- =============================================================================
-- File: supabase/schema.sql
-- Student: Vansh Tuteja
-- Date: August 12, 2026
-- Course: Full-Stack Web Applications — SAIT
-- Project: Internet Movies Rental Company (IMR) portal
--
-- Description:
-- This script creates the complete database for the IMR movie portal. It
-- defines the movies catalogue, the profiles table used for access levels,
-- Row Level Security policies, helper functions, and a small set of seed
-- movies for demonstration. Run the entire file in the Supabase SQL Editor
-- after creating a new project. The script is idempotent enough to re-run
-- on a fresh project; drop statements are included for classroom resets.
--
-- Inputs:  A Supabase project with Auth enabled (email/password).
-- Processing: Creates tables, constraints, triggers, RLS policies, and seed rows.
-- Outputs: A secured movies database that the Next.js application can use.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Reset (safe for a classroom project that has no production data)
-- -----------------------------------------------------------------------------
drop trigger if exists on_auth_user_created on auth.users;
drop trigger if exists on_auth_user_auto_confirm on auth.users;
drop trigger if exists movies_set_updated_at on public.movies;
drop function if exists public.handle_new_user();
drop function if exists public.auto_confirm_auth_user();
drop function if exists public.set_updated_at();
drop function if exists public.is_admin();
drop table if exists public.movies;
drop table if exists public.profiles;

-- -----------------------------------------------------------------------------
-- 2. Profiles — one row per Auth user, stores the access level
--    role = 'user'  → can view the catalogue only
--    role = 'admin' → can add, edit, and delete movies
-- -----------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

comment on table public.profiles is 'Application profile and access level for each authenticated user.';
comment on column public.profiles.role is 'Access level: user (read-only) or admin (full movie CRUD).';

-- -----------------------------------------------------------------------------
-- 3. Movies — the IMR catalogue
--    actors is a text array so a list of names is easy to store, display, and edit
-- -----------------------------------------------------------------------------
create table public.movies (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  actors text[] not null,
  release_year integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint movies_title_length check (char_length(btrim(title)) between 1 and 200),
  constraint movies_actors_count check (cardinality(actors) between 1 and 20),
  constraint movies_release_year_range check (release_year between 1888 and 2100)
);

comment on table public.movies is 'IMR movie catalogue. Source of truth for the web application.';
comment on column public.movies.actors is 'Ordered list of principal actors displayed on the catalogue page.';
comment on column public.movies.release_year is 'Four-digit theatrical release year. 1888 is the earliest practical film year.';

create index movies_title_idx on public.movies (title);
create index movies_release_year_idx on public.movies (release_year desc);

-- -----------------------------------------------------------------------------
-- 4. updated_at trigger — keeps the timestamp honest on every edit
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger movies_set_updated_at
before update on public.movies
for each row
execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- 5. Auto-create a regular-user profile when someone signs up
--    Also confirm the email so testers can sign in with their password
--    immediately (same as turning Confirm email off in the Auth dashboard).
-- -----------------------------------------------------------------------------
create or replace function public.auto_confirm_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email_confirmed_at is null then
    new.email_confirmed_at = now();
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_auto_confirm on auth.users;
create trigger on_auth_user_auto_confirm
before insert on auth.users
for each row
execute function public.auto_confirm_auth_user();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, coalesce(new.email, ''), 'user')
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

-- Confirm existing Auth users so they can sign in with email and password now.
update auth.users
   set email_confirmed_at = coalesce(email_confirmed_at, now())
 where email_confirmed_at is null;

-- -----------------------------------------------------------------------------
-- 6. is_admin() — used by RLS so policies stay readable
--    SECURITY DEFINER is required so the function can read profiles even when
--    the calling user only has permission to see their own row.
-- -----------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- -----------------------------------------------------------------------------
-- 7. Row Level Security
--    Default deny. Authenticated users may read movies. Only admins may write.
--    Regular users cannot bypass the UI by calling the API directly.
-- -----------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.movies enable row level security;

create policy "Users can read their own profile"
  on public.profiles
  for select
  to authenticated
  using (id = auth.uid() or public.is_admin());

create policy "Users can insert their own profile"
  on public.profiles
  for insert
  to authenticated
  with check (id = auth.uid() and role = 'user');

create policy "Authenticated users can view movies"
  on public.movies
  for select
  to authenticated
  using (true);

create policy "Admins can insert movies"
  on public.movies
  for insert
  to authenticated
  with check (public.is_admin());

create policy "Admins can update movies"
  on public.movies
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can delete movies"
  on public.movies
  for delete
  to authenticated
  using (public.is_admin());

-- -----------------------------------------------------------------------------
-- 8. Seed catalogue — small, realistic set for classroom demonstration
-- -----------------------------------------------------------------------------
insert into public.movies (title, actors, release_year) values
  ('The Shawshank Redemption', array['Tim Robbins', 'Morgan Freeman'], 1994),
  ('Spirited Away', array['Rumi Hiiragi', 'Miyu Irino'], 2001),
  ('Mad Max: Fury Road', array['Tom Hardy', 'Charlize Theron'], 2015),
  ('Everything Everywhere All at Once', array['Michelle Yeoh', 'Ke Huy Quan', 'Stephanie Hsu'], 2022),
  ('The Grand Budapest Hotel', array['Ralph Fiennes', 'Tony Revolori', 'Saoirse Ronan'], 2014);

-- -----------------------------------------------------------------------------
-- 9. Promote an administrator
--    1. Sign up through the web app with your SAIT email.
--    2. Replace the email below and run this statement in the SQL Editor.
-- -----------------------------------------------------------------------------
-- update public.profiles
--    set role = 'admin'
--  where email = 'vansh.tuteja@edu.sait.ca';
