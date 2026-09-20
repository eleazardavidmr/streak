-- Backfill a default habit for any existing user who doesn't have one yet
-- (covers accounts created before this migration, with or without check-ins).
insert into public.habits (user_id, title, icon_name, accent, is_default, sort_order)
select p.id, 'Discipline', 'flame', 'primary', true, 0
from public.profiles p
where not exists (
  select 1 from public.habits h where h.user_id = p.id and h.is_default
);

-- Repoint existing 'abstinence' checkins at the real default-habit id.
-- The `habit` column already stores a custom habit's uuid-as-text today,
-- so no column/type change is needed here, only a value migration.
update public.checkins c
set habit = h.id::text
from public.habits h
where h.user_id = c.user_id
  and h.is_default
  and c.habit = 'abstinence';

-- Convert 'running' checkins into a regular (non-default) custom habit per
-- affected user, preserving history instead of deleting it.
with new_running as (
  insert into public.habits (user_id, title, icon_name, accent, is_default, sort_order)
  select distinct user_id, 'Running', 'run', 'secondary', false, 0
  from public.checkins
  where habit = 'running'
  returning id, user_id
)
update public.checkins c
set habit = nr.id::text
from new_running nr
where c.user_id = nr.user_id
  and c.habit = 'running';

-- Existing accounts already use the app (they have a profile predating this
-- migration) — onboarding is only for brand-new signups going forward, so
-- mark everyone who already exists as having completed it.
update public.profiles
set onboarding_completed_at = now()
where onboarding_completed_at is null;
