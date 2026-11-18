import { NextResponse } from "next/server";
import { isCallerAdmin } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";

const BUCKET = "plan-images";

// Sube una foto de producto/suplemento (solo admin) al bucket público de Supabase Storage y devuelve su URL.
export async function POST(request: Request) {
  if (!(await isCallerAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Falta el archivo" }, { status: 400 });
  if (!file.type.startsWith("image/")) return NextResponse.json({ error: "Solo imágenes" }, { status: 400 });
  if (file.size > 3 * 1024 * 1024) return NextResponse.json({ error: "Máximo 3 MB" }, { status: 400 });

  const admin = createAdminClient();
  const { data: bucket } = await admin.storage.getBucket(BUCKET);
  if (!bucket) {
    const { error } = await admin.storage.createBucket(BUCKET, { public: true });
    if (error && !/already exists/i.test(error.message)) return NextResponse.json({ error: error.message }, { status: 500 });
  }
  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await admin.storage.from(BUCKET).upload(path, file, { contentType: file.type, cacheControl: "31536000" });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const { data } = admin.storage.from(BUCKET).getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}
