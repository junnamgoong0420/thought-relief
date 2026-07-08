-- All feedback fields are independently optional, so relax the not-null
-- constraint and add the topic/email fields collected in the feedback form.

alter table public.plan_feedback
  add column if not exists topic text,
  add column if not exists email text;

alter table public.plan_feedback
  alter column feedback drop not null;
