"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { EXERCISES_DB, CATEGORY_LABEL, getExercise } from "@/data/exercises";
import { emptyPlan, emptyMedicion, MEDIDAS, type Plan } from "@/lib/plan";

const TABS = ["Resumen", "Dieta", "Entrenamiento", "Suplementos", "Lista de mercado"] as const;
type Tab = (typeof TABS)[number];

const input =
  "rounded-lg border border-white/10 bg-neutral-950 px-3 py-2 text-sm outline-none focus:border-red-500";
const card = "rounded-2xl border border-white/10 bg-neutral-900 p-5";
const small = "rounded-full border border-white/15 px-3 py-1 text-xs text-neutral-300 hover:border-red-500 hover:text-red-500";

export default function ClientePlanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [plan, setPlan] = useState<Plan>(emptyPlan());
  const [profile, setProfile] = useState<{ full_name: string; email: string; phone: string | null } | null>(null);
  const [tab, setTab] = useState<Tab>("Resumen");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/clients/${id}/plan`)
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) {
          setError(d.tableMissing
            ? "Falta crear la tabla client_plans: ejecuta supabase/schema_v4_client_plans.sql en el SQL Editor de Supabase."
            : d.error || "Error al cargar");
          return;
        }
        setProfile(d.profile);
        setPlan(d.plan);
        setSaved(d.updated_at);
      })
      .finally(() => setLoading(false));
  }, [id]);

  function edit(fn: (p: Plan) => void) {
    setPlan((prev) => {
      const next = structuredClone(prev);
      fn(next);
      return next;
    });
    setDirty(true);
  }

  async function save() {
    setSaving(true);
    setError("");
    const r = await fetch(`/api/admin/clients/${id}/plan`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const d = await r.json();
    setSaving(false);
    if (!r.ok) return setError(d.error || "No se pudo guardar");
    setSaved(new Date().toISOString());
    setDirty(false);
  }

  if (loading) return <p className="text-sm text-neutral-500">Cargando…</p>;
  if (!profile) return <p className="text-sm text-red-400">{error || "Cliente no encontrado"}</p>;

  const num = (v: string) => (v === "" ? 0 : Number(v) || 0);

  return (
    <div className="flex flex-col gap-6 pb-24">
      <div>
        <Link href="/admin/clientes" className="text-xs text-neutral-500 hover:text-red-500">← Clientes</Link>
        <h1 className="mt-1 text-xl font-bold">{profile.full_name}</h1>
        <p className="text-sm text-neutral-400">{profile.email}{profile.phone ? ` · ${profile.phone}` : ""}</p>
        <p className="mt-1 text-xs text-neutral-500">
          Lo que guardes aquí es lo que el cliente ve en su portal. El cliente solo puede verlo, no modificarlo.
        </p>
      </div>

      <nav className="flex gap-1 overflow-x-auto text-sm">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 font-medium ${tab === t ? "bg-red-500 text-white" : "text-neutral-400 hover:text-neutral-100"}`}>
            {t}
          </button>
        ))}
      </nav>

      {tab === "Resumen" && (
        <div className="flex flex-col gap-4">
          <div className={card}>
            <h3 className="mb-3 font-bold">Datos del cliente</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {([
                ["estatura_cm", "Estatura (cm)"],
                ["talla_ropa", "Talla de ropa (S, M, L…)"],
                ["edad", "Edad"],
                ["objetivo", "Objetivo (ej. perder grasa, ganar masa)"],
              ] as const).map(([k, label]) => (
                <label key={k} className="flex flex-col gap-1 text-sm text-neutral-300">
                  {label}
                  <input className={input} value={plan.perfil[k]} onChange={(e) => edit((p) => { p.perfil[k] = e.target.value; })} />
                </label>
              ))}
            </div>
          </div>
          <div className={`${card} grid gap-4 sm:grid-cols-2`}>
            {([
              ["plan", "Plan asignado (ej. Corte, Volumen)"],
              ["dias_entreno", "Días de entreno por semana"],
              ["proxima_revision", "Próxima revisión (ej. Lunes)"],
              ["meta_peso", "Meta de peso (kg)"],
            ] as const).map(([k, label]) => (
              <label key={k} className="flex flex-col gap-1 text-sm text-neutral-300">
                {label}
                <input className={input} value={plan.resumen[k]} onChange={(e) => edit((p) => { p.resumen[k] = e.target.value; })} />
              </label>
            ))}
          </div>
          <div className={card}>
            <h3 className="mb-1 font-bold">Mediciones</h3>
            <p className="mb-3 text-xs text-neutral-500">
              Cada fila es una revisión. La primera es el punto de partida; con las siguientes el cliente ve su progreso. Si no registras nada, no verá gráficas.
            </p>
            <div className="flex flex-col gap-3">
              {plan.mediciones.map((m, mi) => (
                <div key={mi} className="grid grid-cols-2 gap-2 rounded-xl border border-white/5 p-3 sm:grid-cols-4">
                  <label className="flex flex-col gap-1 text-xs text-neutral-500">
                    Fecha
                    <input type="date" className={input} value={m.fecha} onChange={(e) => edit((p) => { p.mediciones[mi].fecha = e.target.value; })} />
                  </label>
                  {MEDIDAS.map((d) => (
                    <label key={d.key} className="flex flex-col gap-1 text-xs text-neutral-500">
                      {d.label} ({d.unit})
                      <input className={input} inputMode="decimal" value={m[d.key]} onChange={(e) => edit((p) => { p.mediciones[mi][d.key] = e.target.value; })} />
                    </label>
                  ))}
                  <button className={`${small} self-end justify-self-start`} onClick={() => edit((p) => { p.mediciones.splice(mi, 1); })}>Quitar</button>
                </div>
              ))}
            </div>
            <button className={`${small} mt-3`} onClick={() => edit((p) => { p.mediciones.push(emptyMedicion()); })}>+ Agregar medición</button>
          </div>
        </div>
      )}

      {tab === "Dieta" && (
        <div className="flex flex-col gap-4">
          {plan.dieta.meals.map((m, mi) => (
            <div key={mi} className={card}>
              <div className="mb-3 flex gap-2">
                <input className={`${input} flex-1`} placeholder="Nombre (ej. Comida #1 — Desayuno)" value={m.name}
                  onChange={(e) => edit((p) => { p.dieta.meals[mi].name = e.target.value; })} />
                <button className={small} onClick={() => edit((p) => { p.dieta.meals.splice(mi, 1); })}>Quitar comida</button>
              </div>
              <div className="flex flex-col gap-2">
                {m.items.length > 0 && (
                  <div className="hidden grid-cols-[1fr_70px_70px_70px_70px_32px] gap-2 text-xs text-neutral-500 sm:grid">
                    <span>Alimento y cantidad</span><span>kcal</span><span>Prot</span><span>Carb</span><span>Grasa</span><span />
                  </div>
                )}
                {m.items.map((it, ii) => (
                  <div key={ii} className="grid grid-cols-2 gap-2 sm:grid-cols-[1fr_70px_70px_70px_70px_32px]">
                    <input className={`${input} col-span-2 sm:col-span-1`} placeholder="ej. 6 oz pechuga de pollo" value={it.food}
                      onChange={(e) => edit((p) => { p.dieta.meals[mi].items[ii].food = e.target.value; })} />
                    {(["kcal", "protein", "carbs", "fat"] as const).map((f) => (
                      <input key={f} className={input} inputMode="decimal" placeholder={f} value={it[f] || ""}
                        onChange={(e) => edit((p) => { p.dieta.meals[mi].items[ii][f] = num(e.target.value); })} />
                    ))}
                    <button className="text-neutral-500 hover:text-red-500" aria-label="Quitar alimento"
                      onClick={() => edit((p) => { p.dieta.meals[mi].items.splice(ii, 1); })}>✕</button>
                  </div>
                ))}
              </div>
              <button className={`${small} mt-3`}
                onClick={() => edit((p) => { p.dieta.meals[mi].items.push({ food: "", kcal: 0, protein: 0, carbs: 0, fat: 0 }); })}>
                + Alimento
              </button>
            </div>
          ))}
          <button className={`${small} w-fit`}
            onClick={() => edit((p) => { p.dieta.meals.push({ name: `Comida #${p.dieta.meals.length + 1}`, items: [] }); })}>
            + Agregar comida
          </button>
          <div className={card}>
            <label className="flex flex-col gap-1 text-sm text-neutral-300">
              Recordatorios para el cliente (uno por línea)
              <textarea rows={5} className={input} value={plan.dieta.reminders.join("\n")}
                onChange={(e) => edit((p) => { p.dieta.reminders = e.target.value.split("\n").filter((l) => l.trim()); })} />
            </label>
          </div>
        </div>
      )}

      {tab === "Entrenamiento" && (
        <div className="flex flex-col gap-4">
          {plan.entrenamiento.map((d, di) => (
            <div key={d.day} className={card}>
              <div className="mb-3 flex items-center gap-3">
                <h3 className="w-24 shrink-0 font-bold">{d.day}</h3>
                <input className={`${input} flex-1`} placeholder="Enfoque (ej. Pecho & Tríceps) — vacío = descanso" value={d.focus}
                  onChange={(e) => edit((p) => { p.entrenamiento[di].focus = e.target.value; })} />
              </div>
              <div className="flex flex-col gap-2">
                {d.exercises.map((ex, xi) => (
                  <div key={xi} className="flex flex-col gap-2">
                  <div className="grid grid-cols-[1fr_140px_32px] gap-2">
                    <select className={input} value={ex.exerciseId}
                      onChange={(e) => edit((p) => {
                        const row = p.entrenamiento[di].exercises[xi];
                        row.exerciseId = e.target.value;
                        const sug = getExercise(e.target.value)?.sets;
                        if (sug) row.sets = sug; // sugerencia de la guía; el admin puede cambiarla
                      })}>
                      <option value="">Elegir ejercicio…</option>
                      {Object.entries(CATEGORY_LABEL).map(([cat, label]) => (
                        <optgroup key={cat} label={label}>
                          {EXERCISES_DB.filter((e) => e.category === cat).map((e) => (
                            <option key={e.id} value={e.id}>{e.name}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                    <input className={input} placeholder="4 x 12" value={ex.sets}
                      onChange={(e) => edit((p) => { p.entrenamiento[di].exercises[xi].sets = e.target.value; })} />
                    <button className="text-neutral-500 hover:text-red-500" aria-label="Quitar ejercicio"
                      onClick={() => edit((p) => { p.entrenamiento[di].exercises.splice(xi, 1); })}>✕</button>
                  </div>
                  {getExercise(ex.exerciseId)?.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={getExercise(ex.exerciseId)!.image} alt="" className="h-28 w-fit rounded-lg bg-white object-cover object-top" />
                  )}
                  </div>
                ))}
              </div>
              <button className={`${small} mt-3`}
                onClick={() => edit((p) => { p.entrenamiento[di].exercises.push({ exerciseId: "", sets: "4 x 12" }); })}>
                + Ejercicio
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === "Suplementos" && (
        <div className="flex flex-col gap-4">
          {plan.suplementos.map((s, si) => (
            <div key={si} className={`${card} grid gap-2 sm:grid-cols-2`}>
              {([["name", "Suplemento"], ["dose", "Dosis"], ["when", "Cuándo tomarlo"], ["purpose", "Para qué sirve"]] as const).map(([k, ph]) => (
                <input key={k} className={input} placeholder={ph} value={s[k]}
                  onChange={(e) => edit((p) => { p.suplementos[si][k] = e.target.value; })} />
              ))}
              <button className={`${small} w-fit`} onClick={() => edit((p) => { p.suplementos.splice(si, 1); })}>Quitar</button>
            </div>
          ))}
          <button className={`${small} w-fit`}
            onClick={() => edit((p) => { p.suplementos.push({ name: "", dose: "", when: "", purpose: "" }); })}>
            + Agregar suplemento
          </button>
        </div>
      )}

      {tab === "Lista de mercado" && (
        <div className="flex flex-col gap-4">
          {plan.mercado.map((g, gi) => (
            <div key={gi} className={card}>
              <div className="mb-3 flex gap-2">
                <input className={`${input} flex-1`} placeholder="Categoría (ej. Proteínas)" value={g.category}
                  onChange={(e) => edit((p) => { p.mercado[gi].category = e.target.value; })} />
                <button className={small} onClick={() => edit((p) => { p.mercado.splice(gi, 1); })}>Quitar</button>
              </div>
              <textarea rows={4} className={`${input} w-full`} placeholder="Un producto por línea" value={g.items.join("\n")}
                onChange={(e) => edit((p) => { p.mercado[gi].items = e.target.value.split("\n"); })} />
            </div>
          ))}
          <button className={`${small} w-fit`}
            onClick={() => edit((p) => { p.mercado.push({ category: "", items: [] }); })}>
            + Agregar categoría
          </button>
        </div>
      )}

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-neutral-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-3">
          <span className="text-xs text-neutral-500">
            {error ? <span className="text-red-400">{error}</span>
              : dirty ? "Cambios sin guardar"
              : saved ? `Guardado ${new Date(saved).toLocaleString("es")}` : "Sin plan asignado todavía"}
          </span>
          <button onClick={save} disabled={saving || !dirty}
            className="rounded-full bg-red-600 px-6 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-50">
            {saving ? "Guardando…" : "Guardar y asignar"}
          </button>
        </div>
      </div>
    </div>
  );
}
