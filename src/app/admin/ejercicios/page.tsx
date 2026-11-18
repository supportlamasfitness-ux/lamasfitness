"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CATEGORY_LABEL, type ExerciseCategory } from "@/data/exercises";
import { loadExercises, saveExercise, type Exercise } from "@/lib/exercise-store";
import GuideCropper from "@/components/admin/GuideCropper";
import ImagePick from "@/components/admin/ImagePick";
import VideoEmbed from "@/components/VideoEmbed";

const input = "rounded-lg border border-white/10 bg-neutral-950 px-3 py-2 text-sm outline-none focus:border-red-500";

function Card({ ex, onSaved, onRemoved }: { ex: Exercise; onSaved: (e: Exercise) => void; onRemoved: (id: string) => void }) {
  const [d, setD] = useState(ex);
  const [msg, setMsg] = useState("");
  const dirty = JSON.stringify(d) !== JSON.stringify(ex);
  const set = <K extends keyof Exercise>(k: K, v: Exercise[K]) => setD((x) => ({ ...x, [k]: v }));

  async function save() {
    setMsg("Guardando…");
    const err = await saveExercise(d);
    if (err && !err.startsWith("Guardado")) return setMsg(err);
    onSaved({ ...d, edited: true });
    setMsg(err || "Guardado ✓");
  }

  async function remove() {
    const txt = d.builtin ? "¿Restaurar este ejercicio a su versión original?" : `¿Eliminar "${d.name}"? Los clientes que lo tengan asignado dejarán de verlo.`;
    if (!confirm(txt)) return;
    const { error } = await createClient().from("exercises_custom").delete().eq("id", d.id);
    if (error) return setMsg(error.message);
    onRemoved(d.id);
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-neutral-900 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <ImagePick value={d.image} onChange={(u) => set("image", u || undefined)} />
        <input className={`${input} min-w-[200px] flex-1 font-semibold`} placeholder="Nombre del ejercicio" value={d.name} onChange={(e) => set("name", e.target.value)} />
      </div>
      {d.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={d.image} alt="" className="max-h-56 w-fit max-w-full rounded-lg bg-white object-contain" />
      )}
      <div className="grid gap-2 sm:grid-cols-3">
        <select className={input} value={d.category} onChange={(e) => set("category", e.target.value as ExerciseCategory)}>
          {Object.entries(CATEGORY_LABEL).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
        </select>
        <input className={input} placeholder="Equipo (Mancuernas, Polea…)" value={d.equipment} onChange={(e) => set("equipment", e.target.value)} />
        <input className={input} placeholder="Series sugeridas (4 x 12)" value={d.sets || ""} onChange={(e) => set("sets", e.target.value)} />
      </div>
      <textarea rows={5} className={input} placeholder="Descripción detallada: músculos, pasos y consejos" value={d.description} onChange={(e) => set("description", e.target.value)} />
      <div className="flex flex-col gap-2">
        <input className={input} placeholder="Enlace de video sugerido (YouTube, Vimeo o .mp4)" value={d.video_url} onChange={(e) => set("video_url", e.target.value)} />
        {d.video_url && <div className="max-w-md"><VideoEmbed url={d.video_url} /></div>}
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-xs font-bold uppercase tracking-wide text-neutral-500">Fotos extra</p>
        <div className="flex flex-wrap items-center gap-3">
          {d.extra_images.map((u, i) => (
            <div key={i} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={u} alt="" className="h-20 w-28 rounded-lg bg-white object-cover" />
              <button type="button" aria-label="Quitar foto" onClick={() => set("extra_images", d.extra_images.filter((_, k) => k !== i))}
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-neutral-950 text-xs text-neutral-300 ring-1 ring-white/20 hover:text-red-500">✕</button>
            </div>
          ))}
          <ImagePick key={d.extra_images.length} value="" onChange={(u) => u && set("extra_images", [...d.extra_images, u])} />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-xs font-bold uppercase tracking-wide text-neutral-500">Enlaces de referencia</p>
        {d.links.map((l, i) => (
          <div key={i} className="flex flex-wrap gap-2">
            <input className={`${input} w-44`} placeholder="Texto (ej. Técnica completa)" value={l.label} onChange={(e) => set("links", d.links.map((x, k) => (k === i ? { ...x, label: e.target.value } : x)))} />
            <input className={`${input} min-w-[200px] flex-1`} placeholder="https://…" value={l.url} onChange={(e) => set("links", d.links.map((x, k) => (k === i ? { ...x, url: e.target.value } : x)))} />
            <button type="button" aria-label="Quitar enlace" className="text-neutral-500 hover:text-red-500" onClick={() => set("links", d.links.filter((_, k) => k !== i))}>✕</button>
          </div>
        ))}
        <button type="button" onClick={() => set("links", [...d.links, { label: "", url: "" }])} className="w-fit rounded-full border border-white/15 px-3 py-1 text-xs text-neutral-300 hover:border-red-500 hover:text-red-500">+ Agregar enlace</button>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={save} disabled={!dirty || !d.name.trim()} className="rounded-full bg-red-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-red-500 disabled:opacity-40">Guardar</button>
        {(d.edited || !d.builtin) && (
          <button onClick={remove} className="text-xs text-neutral-500 hover:text-red-500">{d.builtin ? "Restaurar original" : "Eliminar"}</button>
        )}
        <span className="text-xs text-neutral-500">{msg}{!d.builtin ? " · ejercicio propio" : d.edited ? " · editado" : ""}</span>
      </div>
    </div>
  );
}

export default function EjerciciosPage() {
  const [list, setList] = useState<Exercise[]>([]);
  const [missing, setMissing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("todos");
  const [q, setQ] = useState("");
  const [err, setErr] = useState("");

  async function reload() {
    const r = await loadExercises();
    setList(r.exercises);
    setMissing(r.missing);
    setLoading(false);
  }
  useEffect(() => { reload(); }, []);

  async function add() {
    setErr("");
    const id = `custom-${Date.now().toString(36)}`;
    const cat = (filter !== "todos" ? filter : "pecho") as ExerciseCategory;
    const { error } = await createClient().from("exercises_custom").insert({ id, name: "Nuevo ejercicio", category: cat, equipment: "", is_custom: true });
    if (error) return setErr(error.message);
    await reload();
    setQ("");
  }

  const cats = ["todos", ...Object.keys(CATEGORY_LABEL)];
  const shown = list.filter((e) => (filter === "todos" || e.category === filter) && e.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold">Ejercicios</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Crea ejercicios nuevos o ajusta cualquiera: nombre, foto, descripción y video sugerido. Todo lo que cambies lo verá cada cliente automáticamente al asignarle el ejercicio.
        </p>
        {missing && !loading && (
          <p className="mt-3 rounded-xl border border-red-500/40 bg-red-500/5 p-3 text-sm text-red-400">
            Falta crear la tabla: ejecuta supabase/schema_v7_exercises.sql en el SQL Editor de Supabase.
          </p>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {cats.map((c) => (
          <button key={c} onClick={() => setFilter(c)}
            className={`rounded-full border px-3 py-1 text-xs font-medium ${filter === c ? "border-red-500 bg-red-500/10 text-red-500" : "border-white/10 text-neutral-400 hover:text-neutral-100"}`}>
            {c === "todos" ? "Todos" : CATEGORY_LABEL[c as ExerciseCategory]}
          </button>
        ))}
        <input className={`${input} ml-auto w-44`} placeholder="Buscar…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div>
        <button onClick={add} disabled={missing} className="rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-50">+ Nuevo ejercicio</button>
        {err && <span className="ml-3 text-sm text-red-400">{err}</span>}
      </div>
      <GuideCropper exercises={list} onApplied={() => reload()} />

      <div className="flex flex-col gap-4">
        {loading ? <p className="text-sm text-neutral-500">Cargando…</p> : shown.map((e) => (
          <Card key={e.id + (e.edited ? "e" : "")} ex={e}
            onSaved={(n) => setList((l) => l.map((x) => (x.id === n.id ? n : x)))}
            onRemoved={() => reload()} />
        ))}
      </div>
    </div>
  );
}
