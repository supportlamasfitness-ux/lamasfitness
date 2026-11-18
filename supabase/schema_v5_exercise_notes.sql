-- Descripciones de ejercicios editables por el admin (sobrescriben las de por defecto del código).
-- Cualquier usuario logueado puede leerlas (el cliente las ve en su portal); solo el admin escribe.
create table if not exists exercise_notes (
  exercise_id text primary key,
  description text not null default '',
  updated_at  timestamptz not null default now()
);

alter table exercise_notes enable row level security;

drop policy if exists "exercise_notes_read" on exercise_notes;
create policy "exercise_notes_read" on exercise_notes for select
using (auth.uid() is not null);

drop policy if exists "exercise_notes_write_admin" on exercise_notes;
create policy "exercise_notes_write_admin" on exercise_notes for all
using (is_admin()) with check (is_admin());
