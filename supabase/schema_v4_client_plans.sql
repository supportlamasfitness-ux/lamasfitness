-- Plan asignado a cada cliente (dieta, entrenamiento, suplementos, lista de mercado y resumen).
-- SOLO el admin puede escribir; el cliente únicamente LEE su propio plan (no hay policy de
-- insert/update/delete para clientes, así que RLS se lo bloquea aunque llamen a la API directo).
create table if not exists client_plans (
  client_id  uuid primary key references profiles(id) on delete cascade,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table client_plans enable row level security;

drop policy if exists "client_plans_select_own" on client_plans;
create policy "client_plans_select_own" on client_plans for select
using (client_id = auth.uid());

drop policy if exists "client_plans_select_admin" on client_plans;
create policy "client_plans_select_admin" on client_plans for select
using (is_admin());

drop policy if exists "client_plans_write_admin" on client_plans;
create policy "client_plans_write_admin" on client_plans for all
using (is_admin()) with check (is_admin());
