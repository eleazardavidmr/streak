create table if not exists public.relapses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id),
  relapse_date date not null default current_date,
  action_taken text,
  time_of_day text,
  note text,
  created_at timestamptz not null default now()
);

alter table public.relapses enable row level security;

drop policy if exists "Users can view own relapses" on public.relapses;
create policy "Users can view own relapses"
  on public.relapses
  for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own relapses" on public.relapses;
create policy "Users can insert own relapses"
  on public.relapses
  for insert
  with check (auth.uid() = user_id);