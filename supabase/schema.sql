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

-- Cada usuario puede leer su propia fila. Es la base que hace que el check
-- de "soy admin" de abajo no caiga en recursión infinita (la subconsulta
-- resuelve por esta policy, no por la de admin).
drop policy if exists "profiles_select_own" on profiles;
create policy "profiles_select_own" on profiles for select
using (auth.uid() = id);

-- Un admin puede leer todas las filas (lista de clientes en /admin).
drop policy if exists "profiles_select_admin" on profiles;
create policy "profiles_select_admin" on profiles for select
using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- Un admin puede actualizar cualquier fila (editar cliente más adelante).
drop policy if exists "profiles_update_admin" on profiles;
create policy "profiles_update_admin" on profiles for update
using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- Nota: el INSERT de clientes nuevos se hace desde /api/admin/clients con la
-- service_role key (se salta RLS a propósito) — no hace falta policy de
-- INSERT para el flujo actual.

-- ── LISTO ─────────────────────────────────────────────────────
-- Verificar:
--   select policyname from pg_policies where tablename = 'profiles';
