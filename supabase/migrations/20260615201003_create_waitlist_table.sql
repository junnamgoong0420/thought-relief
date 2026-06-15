-- Create waitlist table for collecting early-access email signups

create table if not exists waitlist (
  id          uuid primary key default gen_random_uuid(),
  email       text not null unique,
  created_at  timestamptz not null default now()
);

alter table waitlist enable row level security;

-- Allow anyone to add their email (anon key is safe for inserts here)
create policy "anon can insert waitlist"
  on waitlist
  for insert
  to anon
  with check (true);

-- Only authenticated users (service role) can read the list
create policy "authenticated can select waitlist"
  on waitlist
  for select
  to authenticated
  using (true);

create index if not exists waitlist_email_idx on waitlist (email);
create index if not exists waitlist_created_at_idx on waitlist (created_at desc);
