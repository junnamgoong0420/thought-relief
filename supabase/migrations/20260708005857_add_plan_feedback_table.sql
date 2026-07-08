-- Optional feedback submitted after a user exhausts action-plan regenerations

create table if not exists public.plan_feedback (
  id           uuid        primary key default gen_random_uuid(),
  created_at   timestamptz not null    default now(),
  user_id      uuid        references auth.users(id) on delete set null,
  chosen_key   text,
  chosen_step  text,
  feedback     text        not null
);

alter table public.plan_feedback enable row level security;

create index if not exists plan_feedback_user_id_idx on public.plan_feedback(user_id);

-- Authenticated users may insert their own feedback
create policy "authenticated_insert" on public.plan_feedback
  for insert
  to authenticated
  with check (user_id = auth.uid());
