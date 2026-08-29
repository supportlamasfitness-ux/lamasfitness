import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Cliente con la service_role key — se salta RLS por completo. SOLO se
// importa desde Route Handlers server-side (nunca desde un Client Component;
// el paquete "server-only" hace fallar el build si eso pasara por error).
// Se usa para crear cuentas de Auth de clientes nuevos desde el panel admin.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
