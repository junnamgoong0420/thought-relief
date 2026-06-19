-- Track each successfully generated AI reflection for usage analytics

create table if not exists public.reflections (
  id         uuid        primary key default gen_random_uuid(),
  created_at timestamptz not null    default now(),
  user_id    uuid        references auth.users(id) on delete set null
);

alter table public.reflections enable row level security;

-- Index for admin count queries and per-user lookups
create index if not exists reflections_created_at_idx on public.reflections(created_at);
create index if not exists reflections_user_id_idx    on public.reflections(user_id);

-- Authenticated users may insert their own rows
create policy "authenticated_insert" on public.reflections
  for insert
  to authenticated
  with check (user_id = auth.uid());

-- Anonymous users may insert rows (user_id must be null)
create policy "anon_insert" on public.reflections
  for insert
  to anon
  with check (user_id is null);
