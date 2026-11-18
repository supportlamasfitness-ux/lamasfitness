"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { EXERCISES_DB, CATEGORY_LABEL } from "@/data/exercises";
import { DEFAULT_DESCRIPTIONS } from "@/data/exercise-descriptions";

export default function EjerciciosPage() {
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState("todos");
  const [tableMissing, setTableMissing] = useState(false);

  useEffect(() => {
    createClient()
      .from("exercise_notes")
      .select("exercise_id, description")
      .then(({ data, error }) => {
        if (error) setTableMissing(true);
        else setNotes(Object.fromEntries((data || []).map((r) => [r.exercise_id, r.description])));
      });
  }, []);

  const current = (id: string) => draft[id] ?? notes[id] ?? DEFAULT_DESCRIPTIONS[id] ?? "";

  async function save(id: string, text: string) {
    setStatus((s) => ({ ...s, [id]: "Guardando…" }));
    const r = await fetch(`/api/admin/exercises/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: text }),
    });
    const d = await r.json();
    if (!r.ok) {
      setStatus((s) => ({ ...s, [id]: d.tableMissing ? "Falta crear la tabla exercise_notes (schema_v5)" : d.error || "Error" }));
      return;
    }
    setNotes((n) => {
      const next = { ...n };
      if (text.trim()) next[id] = text.trim(); else delete next[id];
      return next;
    });
    setDraft((x) => { const c = { ...x }; delete c[id]; return c; });
    setStatus((s) => ({ ...s, [id]: text.trim() ? "Guardado ✓" : "Restaurada la descripción por defecto ✓" }));
  }

  const cats = ["todos", ...Object.keys(CATEGORY_LABEL)];
  const list = EXERCISES_DB.filter((e) => filter === "todos" || e.category === filter);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold">Ejercicios</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Escribe la descripción detallada de cada ejercicio. Cuando se lo asignes a un cliente, la verá automáticamente en su portal al abrir el ejercicio.
        </p>
        {tableMissing && (
          <p className="mt-3 rounded-xl border border-red-500/40 bg-red-500/5 p-3 text-sm text-red-400">
            Falta crear la tabla: ejecuta supabase/schema_v5_exercise_notes.sql en el SQL Editor de Supabase. Mientras tanto se muestran las descripciones por defecto.
          </p>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {cats.map((c) => (
          <button key={c} onClick={() => setFilter(c)}
            className={`rounded-full border px-3 py-1 text-xs font-medium ${filter === c ? "border-red-500 bg-red-500/10 text-red-500" : "border-white/10 text-neutral-400 hover:text-neutral-100"}`}>
            {c === "todos" ? "Todos" : CATEGORY_LABEL[c as keyof typeof CATEGORY_LABEL]}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-4">
        {list.map((e) => (
          <div key={e.id} className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-neutral-900 p-4 sm:flex-row">
            {e.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={e.image} alt={e.name} loading="lazy" className="h-32 w-full shrink-0 rounded-lg bg-white object-cover object-top sm:w-48" />
            ) : (
              <div className="flex h-32 w-full shrink-0 items-center justify-center rounded-lg bg-neutral-950 text-xs text-neutral-600 sm:w-48">Sin imagen</div>
            )}
            <div className="flex flex-1 flex-col gap-2">
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="font-bold">{e.name}</h3>
                <span className="text-xs text-neutral-500">{e.equipment}{notes[e.id] ? " · editada" : ""}</span>
              </div>
              <textarea rows={5} value={current(e.id)}
                onChange={(ev) => setDraft((d) => ({ ...d, [e.id]: ev.target.value }))}
                className="rounded-lg border border-white/10 bg-neutral-950 px-3 py-2 text-sm outline-none focus:border-red-500" />
              <div className="flex items-center gap-3">
                <button onClick={() => save(e.id, current(e.id))} disabled={draft[e.id] === undefined}
                  className="rounded-full bg-red-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-red-500 disabled:opacity-40">Guardar</button>
                {notes[e.id] && (
                  <button onClick={() => save(e.id, "")} className="text-xs text-neutral-500 hover:text-red-500">Restaurar por defecto</button>
                )}
                <span className="text-xs text-neutral-500">{status[e.id]}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
