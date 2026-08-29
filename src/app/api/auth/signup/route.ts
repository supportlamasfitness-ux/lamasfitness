import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Registro público de clientes — sin aprobación del admin. A propósito NO
// verifica que quien llama sea admin (es el flujo de "creá tu cuenta" desde
// /login). Usa email_confirm:true para que la cuenta quede activa de
// inmediato, sin depender de que llegue un correo de confirmación. La fila
// en profiles la crea sola el trigger on_auth_user_created con role='client'
// fijo — este endpoint nunca puede hacer que alguien se registre como admin.
export async function POST(request: Request) {
  const body = await request.json();
  const full_name = String(body.full_name || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const phone = String(body.phone || "").trim() || null;
  const password = String(body.password || "");

  if (!full_name || !email || !password) {
    return NextResponse.json({ error: "Nombre, email y contraseña son obligatorios" }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "La contraseña debe tener al menos 8 caracteres" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name, phone },
  });

  if (createError || !created.user) {
    const msg = createError?.message?.includes("already been registered")
      ? "Ya existe una cuenta con ese email."
      : createError?.message || "No se pudo crear la cuenta";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
