import { createClient } from "@/lib/supabase/server";

// Devuelve true solo si quien llama está logueado y su profile tiene role=admin.
export async function isCallerAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { data } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  return data?.role === "admin";
}
