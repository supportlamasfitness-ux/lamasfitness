"use client";

import { useEffect, useState } from "react";
import { loadCatalog, type CatalogItem } from "@/lib/catalog";

// Ventana para elegir un artículo del catálogo común. Devuelve el artículo elegido (se copia al plan del cliente).
export default function CatalogPicker({ kind, onPick, onClose }: { kind: CatalogItem["kind"]; onPick: (i: CatalogItem) => void; onClose: () => void }) {
  const [items, setItems] = useState<CatalogItem[] | null>(null);
  const [missing, setMissing] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    loadCatalog(kind).then((r) => { setItems(r.items); setMissing(r.missing); });
  }, [kind]);

  const list = (items || []).filter((i) => (i.name + " " + i.category).toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-6" onClick={onClose}>
      <div className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-t-2xl border border-white/10 bg-neutral-900 sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-white/10 p-4">
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Buscar ${kind === "alimento" ? "alimento" : "suplemento"}…`}
            className="flex-1 rounded-lg border border-white/10 bg-neutral-950 px-3 py-2 text-sm outline-none focus:border-red-500" />
          <button onClick={onClose} className="text-sm text-neutral-400 hover:text-red-500">Cerrar</button>
        </div>
        <div className="overflow-y-auto p-2">
          {missing && <p className="p-4 text-sm text-red-400">Falta crear la tabla catalog_items (supabase/schema_v6_catalog.sql).</p>}
          {!missing && items === null && <p className="p-4 text-sm text-neutral-500">Cargando…</p>}
          {!missing && items && list.length === 0 && (
            <p className="p-4 text-sm text-neutral-500">
              {items.length === 0 ? "El catálogo está vacío. Agrega artículos en Catálogo (menú de arriba)." : "Sin resultados."}
            </p>
          )}
          {list.map((i) => (
            <button key={i.id} onClick={() => { onPick(i); onClose(); }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left hover:bg-white/5">
              {i.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={i.image} alt="" className="h-12 w-12 shrink-0 rounded-lg bg-neutral-100 object-contain p-0.5" />
              ) : (
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-neutral-950 text-[10px] text-neutral-600">Sin foto</span>
              )}
              <span className="flex-1 text-sm">
                <span className="block font-medium">{i.name}</span>
                <span className="text-xs text-neutral-500">
                  {i.category}{i.kcal != null ? ` · ${i.kcal} kcal` : ""}{i.dose ? ` · ${i.dose}` : ""}{i.url ? " · 🛒" : ""}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
