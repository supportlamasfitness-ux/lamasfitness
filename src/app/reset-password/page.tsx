"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// Destino del enlace del correo de recuperación: Supabase deja una sesión temporal y aquí se elige la contraseña nueva.
export default function ResetPasswordPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [expired, setExpired] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    // Enlace con el acceso en la dirección (#access_token=...&refresh_token=...): se activa la sesión a mano
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const at = hash.get("access_token");
    const rt = hash.get("refresh_token");
    if (at && rt) {
      supabase.auth.setSession({ access_token: at, refresh_token: rt }).then(({ data }) => {
        if (data.session) {
          window.history.replaceState(null, "", window.location.pathname);
          setReady(true);
        }
      });
    } else if (hash.get("error_code") === "otp_expired") {
      setExpired(true);
    }
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN" || event === "INITIAL_SESSION")) setReady(true);
    });
    // Si en unos segundos no hay sesión, el enlace venció o ya se usó
    const t = setTimeout(async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) setReady(true);
      else setExpired(true);
    }, 3500);
    return () => { sub.subscription.unsubscribe(); clearTimeout(t); };
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 8) return setError("La contraseña debe tener al menos 8 caracteres.");
    if (password !== confirm) return setError("Las contraseñas no coinciden.");
    setSaving(true);
    const supabase = createClient();
    const { error: upErr } = await supabase.auth.updateUser({ password });
    if (upErr) {
      setSaving(false);
      return setError(upErr.message.includes("same") ? "Elige una contraseña distinta a la anterior." : "No se pudo cambiar la contraseña. Pide un enlace nuevo.");
    }
    setDone(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = user ? await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle() : { data: null };
    setTimeout(() => { router.push(profile?.role === "admin" ? "/admin/clientes" : "/portal"); router.refresh(); }, 1500);
  }

  const field = "rounded-lg border border-white/10 bg-neutral-950 px-4 py-2 text-sm outline-none focus:border-red-500";

  return (
    <div className="flex min-h-dvh items-center justify-center bg-neutral-950 px-6 text-neutral-100">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-lg font-bold tracking-tight">LAMAS FITNESS</p>
          <p className="mt-1 text-sm text-neutral-400">Crear contraseña nueva</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-neutral-900 p-8">
          {done ? (
            <p className="text-sm text-emerald-300">¡Listo! Tu contraseña se cambió. Entrando a tu cuenta…</p>
          ) : expired && !ready ? (
            <div className="flex flex-col gap-4 text-sm">
              <p className="text-red-400">Este enlace venció o ya se usó.</p>
              <a href="/login" className="rounded-full bg-red-500 px-6 py-3 text-center font-semibold text-white hover:bg-red-400">Pedir un enlace nuevo</a>
            </div>
          ) : !ready ? (
            <p className="text-sm text-neutral-400">Verificando enlace…</p>
          ) : (
            <form onSubmit={submit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="np" className="text-sm text-neutral-300">Contraseña nueva</label>
                <input id="np" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className={field} />
                <span className="text-xs text-neutral-500">Mínimo 8 caracteres.</span>
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="cp" className="text-sm text-neutral-300">Repite la contraseña</label>
                <input id="cp" type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} className={field} />
              </div>
              {error && <p className="text-sm text-red-400">{error}</p>}
              <button type="submit" disabled={saving} className="mt-2 rounded-full bg-red-500 px-6 py-3 text-sm font-semibold text-white hover:bg-red-400 disabled:opacity-60">
                {saving ? "Guardando..." : "Guardar contraseña"}
              </button>
            </form>
          )}
        </div>
        <a href="/login" className="mt-6 block text-center text-sm text-neutral-500 hover:text-red-500">← Volver a iniciar sesión</a>
      </div>
    </div>
  );
}
