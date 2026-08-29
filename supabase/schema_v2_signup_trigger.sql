-- ============================================================
-- lamasfitness v2 — registro público de clientes (sin aprobación)
--
-- Antes, la fila de profiles solo se creaba a mano desde
-- /api/admin/clients (con service_role). Para permitir que un cliente se
-- registre solo desde /login sin intervención del admin, se agrega un
-- trigger en auth.users: cualquier cuenta nueva de Auth obtiene su fila en
-- profiles automáticamente, SIEMPRE con role='client' hardcodeado (nunca
-- confía en un valor que mande el cliente — evita que alguien se
-- autoasigne role=admin en el signup).
--
-- Esto es ahora la ÚNICA vía de creación de profiles — tanto el signup
-- público como /api/admin/clients (que ya pasaba a crear el admin de
-- Alberto) dependen de este trigger. Si se vuelve a correr el insert manual
-- de profiles en esos flujos, va a chocar con la fila que ya creó el
-- trigger (profiles.id es primary key) — por eso el código de esas rutas
-- se actualizó para pasar full_name/phone en el metadata de
-- auth.users en vez de insertar la fila ellos mismos.
-- ============================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name, email, phone)
  values (
    new.id,
    'client',
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    new.email,
    new.raw_user_meta_data->>'phone'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── LISTO ─────────────────────────────────────────────────────
-- Verificar:
--   select tgname from pg_trigger where tgname = 'on_auth_user_created';
