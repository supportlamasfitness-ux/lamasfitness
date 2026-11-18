-- Testimonios: los agrega el admin o los envía un cliente desde su portal (quedan pendientes hasta que el admin los apruebe).
-- Solo los aprobados son públicos (los lee la web sin iniciar sesión).
create table if not exists testimonials (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  quote      text not null default '',
  rating     int  not null default 5 check (rating between 1 and 5),
  image      text not null default '',
  status     text not null default 'pending' check (status in ('pending', 'approved')),
  source     text not null default 'admin' check (source in ('admin', 'client')),
  client_id  uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table testimonials enable row level security;

drop policy if exists "testimonials_public_read" on testimonials;
create policy "testimonials_public_read" on testimonials for select
using (status = 'approved');

drop policy if exists "testimonials_own_read" on testimonials;
create policy "testimonials_own_read" on testimonials for select
using (client_id = auth.uid());

drop policy if exists "testimonials_client_insert" on testimonials;
create policy "testimonials_client_insert" on testimonials for insert
with check (client_id = auth.uid() and status = 'pending' and source = 'client');

drop policy if exists "testimonials_admin_all" on testimonials;
create policy "testimonials_admin_all" on testimonials for all
using (is_admin()) with check (is_admin());
