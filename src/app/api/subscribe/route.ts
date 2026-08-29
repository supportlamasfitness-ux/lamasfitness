import { NextResponse } from "next/server";
import { addContact } from "@/lib/marketing";

// Suscripción pública a la lista de contactos — sin crear cuenta de
// cliente, solo para recibir novedades por email.
export async function POST(request: Request) {
  const body = await request.json();
  const email = String(body.email || "").trim().toLowerCase();
  const full_name = String(body.full_name || "").trim() || null;

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Ingresá un email válido" }, { status: 400 });
  }

  await addContact({ email, full_name, source: "newsletter" });
  return NextResponse.json({ ok: true });
}
