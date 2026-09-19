create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id),
  title text not null,
  icon_name text not null default 'sparkles',
  accent text not null default 'primary' check (accent in ('primary', 'secondary')),
  sort_order integer not null default 0,
  archived_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.habits enable row level security;

drop policy if exists "Users can view own habits" on public.habits;
create policy "Users can view own habits"
  on public.habits
  for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own habits" on public.habits;
create policy "Users can insert own habits"
  on public.habits
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own habits" on public.habits;
create policy "Users can update own habits"
  on public.habits
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
