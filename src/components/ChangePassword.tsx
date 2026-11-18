"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

// Botón + ventana para que la persona (cliente o admin) cambie su propia contraseña pidiendo la actual.
export default function ChangePassword() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  function close() {
    setOpen(false); setCurrent(""); setNext(""); setConfirm(""); setError(""); setDone(false);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (next.length < 8) return setError("La contraseña nueva debe tener al menos 8 caracteres.");
    if (next !== confirm) return setError("Las contraseñas nuevas no coinciden.");
    if (next === current) return setError("La contraseña nueva debe ser distinta a la actual.");
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) { setSaving(false); return setError("Sesión no válida. Vuelve a iniciar sesión."); }
    const { error: authError } = await supabase.auth.signInWithPassword({ email: user.email, password: current });
    if (authError) { setSaving(false); return setError("La contraseña actual no es correcta."); }
    const { error: upError } = await supabase.auth.updateUser({ password: next });
    setSaving(false);
    if (upError) return setError("No se pudo cambiar la contraseña. Inténtalo de nuevo.");
    setDone(true);
  }

  const field = "rounded-lg border border-white/10 bg-neutral-950 px-3 py-2 text-sm outline-none focus:border-red-500";

  return (
    <>
      <button onClick={() => setOpen(true)} className="text-sm text-neutral-300 hover:text-red-500">Contraseña</button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6" onClick={close}>
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-neutral-900 p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold">Cambiar contraseña</h2>
            {done ? (
              <div className="mt-4 flex flex-col gap-4 text-sm">
                <p className="text-emerald-300">¡Listo! Tu contraseña se cambió.</p>
                <button onClick={close} className="rounded-full bg-red-500 px-5 py-2 font-semibold text-white hover:bg-red-400">Cerrar</button>
              </div>
            ) : (
              <form onSubmit={submit} className="mt-4 flex flex-col gap-3">
                <label className="flex flex-col gap-1 text-sm text-neutral-300">Contraseña actual
                  <input type="password" required autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} className={field} />
                </label>
                <label className="flex flex-col gap-1 text-sm text-neutral-300">Contraseña nueva
                  <input type="password" required minLength={8} autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} className={field} />
                  <span className="text-xs text-neutral-500">Mínimo 8 caracteres; mejor larga y que no uses en otro sitio.</span>
                </label>
                <label className="flex flex-col gap-1 text-sm text-neutral-300">Repite la contraseña nueva
                  <input type="password" required autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={field} />
                </label>
                {error && <p className="text-sm text-red-400">{error}</p>}
                <div className="mt-2 flex gap-3">
                  <button type="submit" disabled={saving} className="flex-1 rounded-full bg-red-500 px-5 py-2 text-sm font-semibold text-white hover:bg-red-400 disabled:opacity-60">{saving ? "Guardando..." : "Guardar"}</button>
                  <button type="button" onClick={close} className="rounded-full border border-white/15 px-5 py-2 text-sm text-neutral-300 hover:border-red-500">Cancelar</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
