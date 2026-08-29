-- ============================================================
-- lamasfitness — esquema inicial (v1: login + lista de clientes)
--
-- profiles extiende auth.users con rol (admin/client), nombre y teléfono.
-- El admin (Alberto) gestiona a los clientes desde /admin — cada cliente
-- creado ahí obtiene una cuenta real de Supabase Auth + una fila acá.
-- ============================================================

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'client' check (role in ('admin', 'client')),
  full_name text not null,
  email text not null,
  phone text,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

-- Chequea "¿el usuario logueado es admin?" sin volver a disparar las
-- policies de select sobre profiles — security definer corre con los
-- privilegios del dueño de la función (se salta RLS), así se evita la
-- recursión infinita que da un subquery directo a profiles dentro de su
-- propia policy (error real de Postgres: "infinite recursion detected in
-- policy for relation profiles", visto al probar el login del admin).
create or replace function is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin');
$$;

-- Cada usuario puede leer su propia fila.
drop policy if exists "profiles_select_own" on profiles;
create policy "profiles_select_own" on profiles for select
using (auth.uid() = id);

-- Un admin puede leer todas las filas (lista de clientes en /admin).
drop policy if exists "profiles_select_admin" on profiles;
create policy "profiles_select_admin" on profiles for select
using (is_admin());

-- Un admin puede actualizar cualquier fila (editar cliente más adelante).
drop policy if exists "profiles_update_admin" on profiles;
create policy "profiles_update_admin" on profiles for update
using (is_admin());

-- Nota: el INSERT de clientes nuevos se hace desde /api/admin/clients con la
-- service_role key (se salta RLS a propósito) — no hace falta policy de
-- INSERT para el flujo actual.

-- ── LISTO ─────────────────────────────────────────────────────
-- Verificar:
--   select policyname from pg_policies where tablename = 'profiles';
