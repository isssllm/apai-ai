-- ApaI production database for Supabase.
-- Run this in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  access_status text not null default 'pending' check (access_status in ('pending','approved','rejected','blocked')),
  plan text not null default 'free' check (plan in ('free','paid','admin')),
  paid_until timestamptz,
  created_at timestamptz not null default now()
);

alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists access_status text not null default 'pending';
alter table public.profiles add column if not exists plan text not null default 'free';
alter table public.profiles add column if not exists paid_until timestamptz;

create table if not exists public.prompts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  material text not null,
  prompt text not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.prompts enable row level security;

-- Helper: current user is an admin.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and plan = 'admin' and access_status = 'approved'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- Profiles: users can only read themselves; admins can read all.
drop policy if exists "Users read own profile" on public.profiles;
drop policy if exists "Users update own profile" on public.profiles;
drop policy if exists "Admins read all profiles" on public.profiles;
create policy "Users read own profile" on public.profiles
  for select to authenticated using (auth.uid() = id or public.is_admin());

-- The browser must never be allowed to update access_status/plan directly.
-- Only the protected admin RPC below can do it.

-- Prompts are private to their owner. Admins may inspect them if needed.
drop policy if exists "Users read own prompts" on public.prompts;
drop policy if exists "Users insert own prompts" on public.prompts;
drop policy if exists "Users delete own prompts" on public.prompts;
drop policy if exists "Admins read all prompts" on public.prompts;
create policy "Users read own prompts" on public.prompts
  for select to authenticated using (auth.uid() = user_id or public.is_admin());
create policy "Users insert own prompts" on public.prompts
  for insert to authenticated with check (auth.uid() = user_id);
create policy "Users delete own prompts" on public.prompts
  for delete to authenticated using (auth.uid() = user_id or public.is_admin());

-- New users automatically receive a pending/free profile.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''), new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Admin-only access control RPC.
create or replace function public.admin_set_user_access(
  target_user_id uuid,
  new_access_status text,
  new_plan text,
  new_paid_until timestamptz default null
)
returns public.profiles
language plpgsql
security definer
set search_path = public
as $$
declare result public.profiles;
begin
  if not public.is_admin() then
    raise exception 'Not authorized';
  end if;

  if new_access_status not in ('pending','approved','rejected','blocked') then
    raise exception 'Invalid access status';
  end if;

  if new_plan not in ('free','paid','admin') then
    raise exception 'Invalid plan';
  end if;

  update public.profiles
  set access_status = new_access_status,
      plan = new_plan,
      paid_until = new_paid_until
  where id = target_user_id
  returning * into result;

  if result.id is null then
    raise exception 'User profile not found';
  end if;

  return result;
end;
$$;

revoke all on function public.admin_set_user_access(uuid,text,text,timestamptz) from public;
grant execute on function public.admin_set_user_access(uuid,text,text,timestamptz) to authenticated;

-- ------------------------------------------------------------
-- ONE-MONTH SUBSCRIPTION ACCESS
-- ------------------------------------------------------------

-- Admin: add exactly one calendar month. If the user still has active
-- time, the new month is added after the current paid_until date.
-- If access has already expired (or no expiry exists), it starts from now().
create or replace function public.admin_add_one_month(target_user_id uuid)
returns public.profiles
language plpgsql
security definer
set search_path = public
as $$
declare result public.profiles;
begin
  if not public.is_admin() then
    raise exception 'Not authorized';
  end if;

  update public.profiles
  set access_status = 'approved',
      plan = 'paid',
      paid_until = (
        case
          when paid_until is not null and paid_until > now() then paid_until
          else now()
        end
      ) + interval '1 month'
  where id = target_user_id
    and plan <> 'admin'
  returning * into result;

  if result.id is null then
    raise exception 'User profile not found or target is admin';
  end if;

  return result;
end;
$$;

revoke all on function public.admin_add_one_month(uuid) from public;
grant execute on function public.admin_add_one_month(uuid) to authenticated;

-- Admin: block a user immediately. The paid_until value is preserved so
-- the admin can still see the subscription history / remaining time.
create or replace function public.admin_block_user(target_user_id uuid)
returns public.profiles
language plpgsql
security definer
set search_path = public
as $$
declare result public.profiles;
begin
  if not public.is_admin() then
    raise exception 'Not authorized';
  end if;

  update public.profiles
  set access_status = 'blocked'
  where id = target_user_id
    and plan <> 'admin'
  returning * into result;

  if result.id is null then
    raise exception 'User profile not found or target is admin';
  end if;

  return result;
end;
$$;

revoke all on function public.admin_block_user(uuid) from public;
grant execute on function public.admin_block_user(uuid) to authenticated;

-- Admin dashboard helper: mark every expired paid account as blocked.
create or replace function public.admin_expire_paid_users()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare affected integer;
begin
  if not public.is_admin() then
    raise exception 'Not authorized';
  end if;

  update public.profiles
  set access_status = 'blocked'
  where plan = 'paid'
    and (paid_until is null or paid_until <= now())
    and access_status <> 'blocked';

  get diagnostics affected = row_count;
  return affected;
end;
$$;

revoke all on function public.admin_expire_paid_users() from public;
grant execute on function public.admin_expire_paid_users() to authenticated;

-- Client access check. On every login/page load this also automatically
-- moves the current user's expired paid subscription to blocked status.
create or replace function public.can_generate()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
  set access_status = 'blocked'
  where id = auth.uid()
    and plan = 'paid'
    and (paid_until is null or paid_until <= now())
    and access_status <> 'blocked';

  return exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and access_status = 'approved'
      and (
        plan = 'admin'
        or (plan = 'paid' and paid_until > now())
      )
  );
end;
$$;

revoke all on function public.can_generate() from public;
grant execute on function public.can_generate() to authenticated;

-- ------------------------------------------------------------
-- OPTIONAL: EXACT-TIME AUTOMATIC EXPIRY WITH pg_cron
-- ------------------------------------------------------------
-- The website already blocks an expired user automatically on their next
-- page load/login, and the admin dashboard expires all overdue users when
-- it is opened/refreshed. If you want the database status to flip even when
-- nobody opens the site, enable the pg_cron extension in Supabase and add a
-- scheduled job that runs an admin/service-side expiry function.
-- ------------------------------------------------------------

-- ------------------------------------------------------------
-- ONE-TIME ADMIN SETUP
-- After you register your own account, run this once in SQL Editor,
-- replacing YOUR_EMAIL with the email of your admin account:
--
-- update public.profiles
-- set access_status = 'approved', plan = 'admin', paid_until = null
-- where id = (select id from auth.users where email = 'YOUR_EMAIL');
-- ------------------------------------------------------------
