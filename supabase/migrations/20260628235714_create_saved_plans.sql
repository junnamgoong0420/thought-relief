-- Store action plans that authenticated users choose to save after a session
create table if not exists public.saved_plans (
  id          uuid        primary key default gen_random_uuid(),
  created_at  timestamptz not null    default now(),
  user_id     uuid        not null    references auth.users(id) on delete cascade,
  title       text        not null,
  chosen_key  text        not null,
  chosen_step text        not null,
  steps       jsonb       not null
);

alter table public.saved_plans enable row level security;

-- Index for per-user lookups and date ordering
create index if not exists saved_plans_user_id_idx   on public.saved_plans(user_id);
create index if not exists saved_plans_created_at_idx on public.saved_plans(created_at desc);

-- Users may only read their own saved plans
create policy "users_select_own" on public.saved_plans
  for select
  to authenticated
  using (user_id = auth.uid());

-- Users may only insert their own saved plans
create policy "users_insert_own" on public.saved_plans
  for insert
  to authenticated
  with check (user_id = auth.uid());

-- Users may delete their own saved plans
create policy "users_delete_own" on public.saved_plans
  for delete
  to authenticated
  using (user_id = auth.uid());
