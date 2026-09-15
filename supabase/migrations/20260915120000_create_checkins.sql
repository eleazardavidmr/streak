create table if not exists public.checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id),
  checkin_date date not null default current_date,
  created_at timestamptz not null default now(),
  unique (user_id, checkin_date)
);

alter table public.checkins enable row level security;

drop policy if exists "Users can view own checkins" on public.checkins;
create policy "Users can view own checkins"
  on public.checkins
  for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own checkins" on public.checkins;
create policy "Users can insert own checkins"
  on public.checkins
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own checkins" on public.checkins;
create policy "Users can delete own checkins"
  on public.checkins
  for delete
  using (auth.uid() = user_id);
