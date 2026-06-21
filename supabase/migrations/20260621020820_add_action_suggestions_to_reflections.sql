-- Add burn_it_off and reset_to_zero columns to track past suggestions per user
-- so the AI can avoid repeating the same actions across sessions
alter table reflections
  add column if not exists burn_it_off text,
  add column if not exists reset_to_zero text;
