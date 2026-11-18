// Script de arranque — crea la primera cuenta admin (chicken-and-egg: el
// panel /admin solo deja crear clientes si ya estás logueado como admin, así
// que la primera cuenta hay que crearla directo contra Supabase).
//
// Uso (nunca hardcodear la contraseña acá, siempre por variable de entorno):
//   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... ADMIN_EMAIL=... ADMIN_PASSWORD=... \
//     node scripts/create-admin.mjs

import { createClient } from "@supabase/supabase-js";

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME } = process.env;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("Faltan variables de entorno: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_EMAIL, ADMIN_PASSWORD");
  process.exit(1);
}

const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data: created, error: createError } = await admin.auth.admin.createUser({
  email: ADMIN_EMAIL,
  password: ADMIN_PASSWORD,
  email_confirm: true,
  user_metadata: { full_name: ADMIN_NAME || "Lamas Fitness" },
});

if (createError || !created.user) {
  console.error("Error creando el usuario:", createError?.message);
  process.exit(1);
}

// El trigger on_auth_user_created (schema_v2_signup_trigger.sql) ya creó la
// fila en profiles con role='client' por defecto — acá la subimos a admin.
const { error: profileError } = await admin
  .from("profiles")
  .update({ role: "admin" })
  .eq("id", created.user.id);

if (profileError) {
  console.error("Usuario creado pero falló el update de rol:", profileError.message);
  process.exit(1);
}

console.log(`✅ Admin creado: ${ADMIN_EMAIL}`);
