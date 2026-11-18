-- Ejercicios editables: ajustes sobre los ejercicios incluidos (mismo id) y ejercicios nuevos del admin.
-- Cualquier usuario logueado los lee (el cliente los ve en su portal); solo el admin escribe.
create table if not exists exercises_custom (
  id          text primary key,
  name        text,
  category    text,
  equipment   text,
  image       text,
  video_url   text,
  description text,
  sets        text,
  is_custom   boolean not null default false,
  updated_at  timestamptz not null default now()
);

alter table exercises_custom enable row level security;

drop policy if exists "exercises_custom_read" on exercises_custom;
create policy "exercises_custom_read" on exercises_custom for select
using (auth.uid() is not null);

drop policy if exists "exercises_custom_write_admin" on exercises_custom;
create policy "exercises_custom_write_admin" on exercises_custom for all
using (is_admin()) with check (is_admin());
