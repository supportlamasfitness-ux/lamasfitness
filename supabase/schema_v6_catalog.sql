-- Catálogo común de alimentos y suplementos (con foto, enlace de compra y datos). Solo el admin lo gestiona.
-- Al armar el plan de un cliente se elige de aquí, en vez de volver a escribir lo mismo cada vez.
create table if not exists catalog_items (
  id         uuid primary key default gen_random_uuid(),
  kind       text not null check (kind in ('alimento', 'suplemento')),
  name       text not null,
  category   text not null default '',
  image      text not null default '',
  url        text not null default '',
  kcal       numeric,
  protein    numeric,
  carbs      numeric,
  fat        numeric,
  dose       text not null default '',
  when_text  text not null default '',
  purpose    text not null default '',
  created_at timestamptz not null default now()
);

alter table catalog_items enable row level security;

drop policy if exists "catalog_items_admin" on catalog_items;
create policy "catalog_items_admin" on catalog_items for all
using (is_admin()) with check (is_admin());
