import { NextResponse } from "next/server";
import { isCallerAdmin } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { normalizePlan } from "@/lib/plan";

type Ctx = { params: Promise<{ id: string }> };

// Solo el admin lee/escribe el plan de un cliente. El cliente lo lee desde el portal (RLS, solo lectura).
export async function GET(_req: Request, { params }: Ctx) {
  if (!(await isCallerAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  const { id } = await params;
  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles").select("id, full_name, email, phone, role").eq("id", id).maybeSingle();
  if (!profile || profile.role !== "client") return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });
  const { data, error } = await admin.from("client_plans").select("data, updated_at").eq("client_id", id).maybeSingle();
  if (error) return NextResponse.json({ error: error.message, tableMissing: /client_plans/.test(error.message) }, { status: 500 });
  return NextResponse.json({ profile, plan: normalizePlan(data?.data), updated_at: data?.updated_at ?? null });
}

export async function PUT(request: Request, { params }: Ctx) {
  if (!(await isCallerAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body?.plan) return NextResponse.json({ error: "Falta el plan" }, { status: 400 });
  const admin = createAdminClient();
  const { data: profile } = await admin.from("profiles").select("role").eq("id", id).maybeSingle();
  if (!profile || profile.role !== "client") return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });
  const plan = normalizePlan(body.plan);
  const { error } = await admin
    .from("client_plans")
    .upsert({ client_id: id, data: plan, updated_at: new Date().toISOString() });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
