alter table public.checkins
  add column if not exists habit text not null default 'abstinence';

alter table public.checkins
  drop constraint if exists checkins_user_id_checkin_date_key;

alter table public.checkins
  drop constraint if exists checkins_user_id_habit_checkin_date_key;

alter table public.checkins
  add constraint checkins_user_id_habit_checkin_date_key
  unique (user_id, habit, checkin_date);

alter table public.profiles
  add column if not exists running_goal_date date,
  add column if not exists running_goal_label text not null default '';
