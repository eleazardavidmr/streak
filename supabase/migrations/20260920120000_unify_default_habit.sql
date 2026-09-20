alter table public.habits
  add column if not exists is_default boolean not null default false;

drop index if exists habits_one_default_per_user;
create unique index habits_one_default_per_user
  on public.habits (user_id)
  where is_default;

alter table public.profiles
  add column if not exists onboarding_completed_at timestamptz;

alter table public.profiles
  drop column if exists running_goal_date,
  drop column if exists running_goal_label;

create or replace function public.protect_default_habit()
returns trigger
language plpgsql
as $$
begin
  if old.is_default and (new.archived_at is not null or new.is_default = false) then
    raise exception 'The default habit cannot be archived or unset.';
  end if;
  return new;
end;
$$;

drop trigger if exists protect_default_habit on public.habits;
create trigger protect_default_habit
  before update on public.habits
  for each row execute procedure public.protect_default_habit();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;

  insert into public.habits (user_id, title, icon_name, accent, is_default, sort_order)
  values (new.id, 'Discipline', 'flame', 'primary', true, 0)
  on conflict do nothing;

  return new;
end;
$$;
