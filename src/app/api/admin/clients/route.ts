import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { emptyPlan, emptyMedicion } from "@/lib/plan";

function randomPassword() {
  // 12 caracteres, suficiente para una contraseña temporal que el cliente
  // cambia después — no se guarda en ningún lado, solo se devuelve una vez.
  return Math.random().toString(36).slice(-6) + Math.random().toString(36).slice(-6);
}

// Crea un cliente nuevo: cuenta real de Supabase Auth + fila en profiles.
// Solo un admin autenticado puede llamar esto — se verifica el rol leyendo
// su propio profile con el cliente normal (respeta RLS) ANTES de tocar el
// cliente con service_role (que se salta RLS a propósito).
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { data: callerProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (callerProfile?.role !== "admin") {
    return NextResponse.json({ error: "Solo un admin puede crear clientes" }, { status: 403 });
  }

  const body = await request.json();
  const full_name = String(body.full_name || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const phone = String(body.phone || "").trim() || null;
  if (!full_name || !email) {
    return NextResponse.json({ error: "Nombre y email son obligatorios" }, { status: 400 });
  }

  const admin = createAdminClient();
  const tempPassword = randomPassword();

  // profiles ya no se inserta acá — el trigger on_auth_user_created (ver
  // schema_v2_signup_trigger.sql) crea la fila solo, con role='client'
  // fijo, leyendo full_name/phone del metadata que mandamos abajo.
  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password: tempPassword,
    email_confirm: true,
    user_metadata: { full_name, phone },
  });
  if (createError || !created.user) {
    return NextResponse.json(
      { error: createError?.message || "No se pudo crear la cuenta" },
      { status: 400 }
    );
  }

  // Datos iniciales que carga el admin al crear la cuenta (estatura, talla, peso): son el punto de
  // partida real del resumen del cliente. Si la tabla client_plans aún no existe, no se rompe el alta.
  const t = (v: unknown) => String(v ?? "").trim();
  const estatura = t(body.estatura_cm), talla = t(body.talla_ropa), peso = t(body.peso), edad = t(body.edad);
  let planWarning: string | null = null;
  if (estatura || talla || peso || edad) {
    const plan = emptyPlan();
    plan.perfil.estatura_cm = estatura;
    plan.perfil.talla_ropa = talla;
    plan.perfil.edad = edad;
    if (peso) plan.mediciones.push({ ...emptyMedicion(), peso });
    const { error: planError } = await admin
      .from("client_plans")
      .upsert({ client_id: created.user.id, data: plan, updated_at: new Date().toISOString() });
    if (planError) planWarning = "Cuenta creada, pero no se guardaron los datos iniciales: " + planError.message;
  }

  return NextResponse.json({
    client: { id: created.user.id, full_name, email, phone },
    tempPassword,
    planWarning,
  });
}
