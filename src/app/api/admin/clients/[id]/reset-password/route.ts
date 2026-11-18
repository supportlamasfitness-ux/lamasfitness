import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { isCallerAdmin } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";

type Ctx = { params: Promise<{ id: string }> };

// El admin genera una contraseña temporal para un cliente (por si no le llega el correo). Se muestra una sola vez.
export async function POST(_req: Request, { params }: Ctx) {
  if (!(await isCallerAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  const { id } = await params;
  const admin = createAdminClient();
  const { data: profile } = await admin.from("profiles").select("role, email").eq("id", id).maybeSingle();
  if (!profile || profile.role !== "client") return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });
  const tempPassword = randomBytes(9).toString("base64url"); // 12 caracteres, criptográficamente aleatorio
  const { error } = await admin.auth.admin.updateUserById(id, { password: tempPassword });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ email: profile.email, tempPassword });
}
