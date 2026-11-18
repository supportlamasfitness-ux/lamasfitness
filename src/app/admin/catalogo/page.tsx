"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { loadCatalog, newItem, SEED_FOODS, type CatalogItem } from "@/lib/catalog";
import ImagePick from "@/components/admin/ImagePick";
import { getFoodImage } from "@/data/foods";

const input = "rounded-lg border border-white/10 bg-neutral-950 px-3 py-2 text-sm outline-none focus:border-red-500";
const small = "rounded-full border border-white/15 px-3 py-1 text-xs text-neutral-300 hover:border-red-500 hover:text-red-500";
const numOrNull = (v: string) => (v.trim() === "" ? null : Number(v.replace(",", ".")) || 0);

function Row({ item, onSaved, onDeleted }: { item: CatalogItem; onSaved: (i: CatalogItem) => void; onDeleted: (id: string) => void }) {
  const [d, setD] = useState(item);
  const [msg, setMsg] = useState("");
  const dirty = JSON.stringify(d) !== JSON.stringify(item);
  const set = <K extends keyof CatalogItem>(k: K, v: CatalogItem[K]) => setD((x) => ({ ...x, [k]: v }));

  async function save() {
    setMsg("Guardando…");
    const { id, ...rest } = d;
    const { error } = await createClient().from("catalog_items").update(rest).eq("id", id);
    if (error) return setMsg(error.message);
    onSaved(d);
    setMsg("Guardado ✓");
  }
  async function del() {
    if (!confirm(`¿Eliminar "${item.name}" del catálogo? (No cambia los planes ya asignados.)`)) return;
    const { error } = await createClient().from("catalog_items").delete().eq("id", item.id);
    if (error) return setMsg(error.message);
    onDeleted(item.id);
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-neutral-900 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <ImagePick value={d.image} auto={getFoodImage(d.name)} onChange={(u) => set("image", u)} />
        <input className={`${input} min-w-[180px] flex-1`} placeholder="Nombre" value={d.name} onChange={(e) => set("name", e.target.value)} />
        <input className={`${input} w-40`} placeholder="Categoría" value={d.category} onChange={(e) => set("category", e.target.value)} />
      </div>
      <input className={input} placeholder="Enlace de compra (Amazon, Walmart…)" value={d.url} onChange={(e) => set("url", e.target.value)} />
      {d.kind === "alimento" ? (
        <div className="grid grid-cols-4 gap-2">
          {([["kcal", "kcal"], ["protein", "Proteína g"], ["carbs", "Carbs g"], ["fat", "Grasa g"]] as const).map(([k, ph]) => (
            <input key={k} className={input} inputMode="decimal" placeholder={ph} value={d[k] ?? ""} onChange={(e) => set(k, numOrNull(e.target.value))} />
          ))}
        </div>
      ) : (
        <div className="grid gap-2 sm:grid-cols-3">
          <input className={input} placeholder="Dosis" value={d.dose} onChange={(e) => set("dose", e.target.value)} />
          <input className={input} placeholder="Cuándo tomarlo" value={d.when_text} onChange={(e) => set("when_text", e.target.value)} />
          <input className={input} placeholder="Para qué sirve" value={d.purpose} onChange={(e) => set("purpose", e.target.value)} />
        </div>
      )}
      <div className="flex items-center gap-3">
        <button onClick={save} disabled={!dirty || !d.name.trim()} className="rounded-full bg-red-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-red-500 disabled:opacity-40">Guardar</button>
        <button onClick={del} className="text-xs text-neutral-500 hover:text-red-500">Eliminar</button>
        <span className="text-xs text-neutral-500">{msg}</span>
      </div>
    </div>
  );
}

export default function CatalogoPage() {
  const [kind, setKind] = useState<CatalogItem["kind"]>("alimento");
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [missing, setMissing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [err, setErr] = useState("");

  async function reload() {
    const r = await loadCatalog();
    setItems(r.items);
    setMissing(r.missing);
    setLoading(false);
  }
  useEffect(() => { reload(); }, []);

  async function add() {
    setErr("");
    const { data, error } = await createClient().from("catalog_items").insert({ ...newItem(kind), name: "Nuevo artículo" }).select().single();
    if (error) return setErr(error.message);
    setItems((l) => [data as CatalogItem, ...l]);
  }

  async function seed() {
    setErr("");
    const have = new Set(items.map((i) => i.name.toLowerCase()));
    const rows = SEED_FOODS.filter((s) => !have.has(s.name.toLowerCase())).map((s) => ({
      ...newItem("alimento"), name: s.name, category: s.category, image: `/images/foods/${s.file}.jpg`,
    }));
    if (!rows.length) return setErr("Ya están todos cargados.");
    const { error } = await createClient().from("catalog_items").insert(rows);
    if (error) return setErr(error.message);
    reload();
  }

  const list = items.filter((i) => i.kind === kind && (i.name + " " + i.category).toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold">Catálogo</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Base común de alimentos y suplementos, con foto, enlace de compra y datos. Se llena una vez y luego eliges de aquí al armar el plan de cada cliente.
        </p>
        {missing && !loading && (
          <p className="mt-3 rounded-xl border border-red-500/40 bg-red-500/5 p-3 text-sm text-red-400">
            Falta crear la tabla: ejecuta supabase/schema_v6_catalog.sql en el SQL Editor de Supabase.
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {(["alimento", "suplemento"] as const).map((k) => (
          <button key={k} onClick={() => setKind(k)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${kind === k ? "bg-red-500 text-white" : "text-neutral-400 hover:text-neutral-100"}`}>
            {k === "alimento" ? "Alimentos y productos" : "Suplementos"}
          </button>
        ))}
        <input className={`${input} ml-auto w-48`} placeholder="Buscar…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={add} disabled={missing} className="rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-50">+ Nuevo artículo</button>
        {kind === "alimento" && (
          <button onClick={seed} disabled={missing} className={small}>Cargar los 25 productos de la Lista de Mercado</button>
        )}
      </div>
      {err && <p className="text-sm text-red-400">{err}</p>}

      <div className="flex flex-col gap-4">
        {loading ? <p className="text-sm text-neutral-500">Cargando…</p> : list.length === 0 && !missing ? (
          <p className="text-sm text-neutral-500">Nada aquí todavía.</p>
        ) : list.map((i) => (
          <Row key={i.id} item={i}
            onSaved={(n) => setItems((l) => l.map((x) => (x.id === n.id ? n : x)))}
            onDeleted={(id) => setItems((l) => l.filter((x) => x.id !== id))} />
        ))}
      </div>
    </div>
  );
}
