"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// Destino del enlace del correo de recuperación. El código se valida SOLO cuando la persona pulsa el botón:
// así los escáneres de correo que "abren" el enlace antes que ella no lo gastan, y funciona en cualquier navegador o celular.
function Confirm() {
  const router = useRouter();
  const params = useSearchParams();
  const tokenHash = params.get("token_hash");
  const type = params.get("type");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function go() {
    if (!tokenHash || type !== "recovery") return;
    setBusy(true);
    setError("");
    const { error: e } = await createClient().auth.verifyOtp({ type: "recovery", token_hash: tokenHash });
    if (e) {
      setBusy(false);
      return setError("Este enlace venció o ya se usó. Pide uno nuevo.");
    }
    router.push("/reset-password");
  }

  const invalid = !tokenHash || type !== "recovery";

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-6 text-neutral-100">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-lg font-bold tracking-tight">LAMAS FITNESS</p>
          <p className="mt-1 text-sm text-neutral-400">Recuperar contraseña</p>
        </div>
        <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-neutral-900 p-8 text-sm">
          {invalid ? (
            <>
              <p className="text-red-400">El enlace no es válido.</p>
              <a href="/login" className="rounded-full bg-red-500 px-6 py-3 text-center font-semibold text-white hover:bg-red-400">Pedir un enlace nuevo</a>
            </>
          ) : (
            <>
              <p className="text-neutral-300">Pulsa el botón para continuar y elegir tu contraseña nueva.</p>
              {error && <p className="text-red-400">{error}</p>}
              <button onClick={go} disabled={busy} className="rounded-full bg-red-500 px-6 py-3 font-semibold text-white hover:bg-red-400 disabled:opacity-60">
                {busy ? "Verificando..." : "Crear contraseña nueva"}
              </button>
              {error && <a href="/login" className="text-center text-neutral-400 hover:text-red-500">Pedir un enlace nuevo</a>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={null}>
      <Confirm />
    </Suspense>
  );
}
