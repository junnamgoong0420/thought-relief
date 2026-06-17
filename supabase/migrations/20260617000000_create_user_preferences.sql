-- Store user preferences collected during onboarding

create table if not exists public.user_preferences (
  user_id       uuid primary key references auth.users(id) on delete cascade,
  support_style text not null check (support_style in ('practical', 'emotional', 'balanced')),
  response_tone text not null check (response_tone in ('gentle', 'balanced', 'direct')),
  created_at    timestamptz not null default now()
);

alter table public.user_preferences enable row level security;

create policy "authenticated can select own preferences"
  on public.user_preferences
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "authenticated can insert own preferences"
  on public.user_preferences
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "authenticated can update own preferences"
  on public.user_preferences
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
