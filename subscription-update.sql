-- ApaI: 1 айлық қолжетімділік жаңартуы
-- Supabase -> SQL Editor -> New query ішіне осы файлды толық қойып Run басыңыз.

-- 1 ай қосу: белсенді мерзім бар болса, сол мерзімнің үстіне 1 ай қосылады.
-- Мерзім өтіп кеткен болса, бүгіннен бастап 1 ай беріледі.
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

-- Қолданушыны админ бірден блоктай алады. paid_until сақталады.
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

-- Админ панель ашылған сайын мерзімі өткен барлық ақылы аккаунт blocked болады.
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

-- Қолданушы сайтқа кіргенде/бетті ашқанда мерзімі өтіп кетсе,
-- status автоматты түрде blocked болып, генераторға рұқсат берілмейді.
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
