-- ============================================================
-- lamasfitness v3 — lista de contactos para email marketing
--
-- subscribers guarda a cualquiera que dejó su email (formulario de
-- "recibí tips por email" en la landing) sin necesariamente crear una
-- cuenta de cliente completa. Los clientes reales (profiles role='client')
-- también se consideran parte de la lista de contactos, pero viven en su
-- propia tabla — el admin ve ambas fuentes juntas en /admin/contactos.
-- ============================================================

create table if not exists subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  full_name text,
  source text not null default 'newsletter',
  created_at timestamptz not null default now()
);

alter table subscribers enable row level security;

-- Solo el admin puede leer la lista (misma función is_admin() de profiles).
drop policy if exists "subscribers_select_admin" on subscribers;
create policy "subscribers_select_admin" on subscribers for select
using (is_admin());

-- El insert lo hace /api/subscribe con la service_role key (se salta RLS a
-- propósito) — no hace falta policy de INSERT pública.

-- ── LISTO ─────────────────────────────────────────────────────
-- Verificar:
--   select policyname from pg_policies where tablename = 'subscribers';
