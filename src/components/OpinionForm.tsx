"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

// El cliente deja su opinión desde el portal. Queda pendiente hasta que el admin la aprueba.
export default function OpinionForm({ fullName }: { fullName: string }) {
  const parts = fullName.trim().split(/\s+/);
  const short = parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1][0]}.` : parts[0];
  const [name, setName] = useState(short);
  const [quote, setQuote] = useState("");
  const [rating, setRating] = useState(5);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!quote.trim() || !name.trim()) return;
    setState("sending");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return setState("error");
    const { error } = await supabase.from("testimonials").insert({
      name: name.trim(), quote: quote.trim(), rating, status: "pending", source: "client", client_id: user.id,
    });
    setState(error ? "error" : "done");
  }

  if (state === "done") {
    return <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/5 p-5 text-sm text-emerald-300">¡Gracias por tu opinión! La revisaremos y, si estás de acuerdo, aparecerá en la web con el nombre que escribiste.</div>;
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-neutral-900 p-5">
      <h3 className="text-sm font-bold uppercase tracking-wide text-neutral-400">¿Cómo te va con tu plan?</h3>
      <textarea required rows={3} value={quote} onChange={(e) => setQuote(e.target.value)} placeholder="Cuéntanos tu experiencia con Lamas Fitness…"
        className="rounded-lg border border-white/10 bg-neutral-950 px-3 py-2 text-sm outline-none focus:border-red-500" />
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <label className="flex items-center gap-2 text-neutral-400">Nombre a mostrar
          <input required value={name} onChange={(e) => setName(e.target.value)} className="rounded-lg border border-white/10 bg-neutral-950 px-3 py-1.5 outline-none focus:border-red-500" />
        </label>
        <span className="flex gap-1" role="radiogroup" aria-label="Calificación">
          {[1, 2, 3, 4, 5].map((n) => (
            <button type="button" key={n} onClick={() => setRating(n)} aria-label={`${n} estrellas`} className={`text-xl ${n <= rating ? "text-amber-400" : "text-neutral-700"}`}>★</button>
          ))}
        </span>
        <button type="submit" disabled={state === "sending"} className="ml-auto rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-60">
          {state === "sending" ? "Enviando…" : "Enviar opinión"}
        </button>
      </div>
      {state === "error" && <p className="text-xs text-red-400">No se pudo enviar. Inténtalo de nuevo.</p>}
      <p className="text-xs text-neutral-500">Se publica solo si el entrenador la aprueba.</p>
    </form>
  );
}
