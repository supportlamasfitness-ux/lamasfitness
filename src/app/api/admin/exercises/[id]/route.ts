import { NextResponse } from "next/server";
import { isCallerAdmin } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { getExercise } from "@/data/exercises";

type Ctx = { params: Promise<{ id: string }> };

// Guarda (o borra, si va vacía) la descripción de un ejercicio. Solo admin.
export async function PUT(request: Request, { params }: Ctx) {
  if (!(await isCallerAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  const { id } = await params;
  if (!getExercise(id)) return NextResponse.json({ error: "Ejercicio no encontrado" }, { status: 404 });
  const body = await request.json().catch(() => null);
  const description = String(body?.description ?? "").trim();
  const admin = createAdminClient();
  const { error } = description
    ? await admin.from("exercise_notes").upsert({ exercise_id: id, description, updated_at: new Date().toISOString() })
    : await admin.from("exercise_notes").delete().eq("exercise_id", id);
  if (error) return NextResponse.json({ error: error.message, tableMissing: /exercise_notes/.test(error.message) }, { status: 500 });
  return NextResponse.json({ ok: true });
}
