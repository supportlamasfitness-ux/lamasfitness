"use client";

import { useRef, useState } from "react";
import { CATEGORY_LABEL, type ExerciseCategory } from "@/data/exercises";
import { saveExercise, type Exercise } from "@/lib/exercise-store";

type Rect = { x: number; y: number; w: number; h: number };

// Sube una guía completa (infografía), arrastra para seleccionar el recuadro de un ejercicio y asígnalo como su foto.
export default function GuideCropper({ exercises, onApplied }: { exercises: Exercise[]; onApplied: () => void }) {
  const [src, setSrc] = useState<string | null>(null);
  const [rect, setRect] = useState<Rect | null>(null);
  const [target, setTarget] = useState("__new__");
  const [newName, setNewName] = useState("");
  const [newCat, setNewCat] = useState<ExerciseCategory>("brazo");
  const [asExtra, setAsExtra] = useState(false);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const start = useRef<{ x: number; y: number } | null>(null);

  function pos(e: React.PointerEvent) {
    const b = (e.currentTarget as HTMLElement).getBoundingClientRect();
    return { x: Math.min(Math.max(e.clientX - b.left, 0), b.width), y: Math.min(Math.max(e.clientY - b.top, 0), b.height) };
  }
  function down(e: React.PointerEvent) {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    start.current = pos(e);
    setRect(null);
  }
  function move(e: React.PointerEvent) {
    if (!start.current) return;
    const p = pos(e);
    setRect({ x: Math.min(start.current.x, p.x), y: Math.min(start.current.y, p.y), w: Math.abs(p.x - start.current.x), h: Math.abs(p.y - start.current.y) });
  }
  function up() { start.current = null; }

  async function apply() {
    const img = imgRef.current;
    if (!img || !rect || rect.w < 20 || rect.h < 20) return setMsg("Arrastra sobre la guía para seleccionar el recuadro del ejercicio.");
    if (target === "__new__" && !newName.trim()) return setMsg("Escribe el nombre del ejercicio nuevo.");
    setBusy(true);
    setMsg("Subiendo…");
    try {
      const k = img.naturalWidth / img.getBoundingClientRect().width;
      const sw = rect.w * k, sh = rect.h * k;
      const scale = Math.min(1, 900 / sw);
      const c = document.createElement("canvas");
      c.width = Math.round(sw * scale); c.height = Math.round(sh * scale);
      c.getContext("2d")!.drawImage(img, rect.x * k, rect.y * k, sw, sh, 0, 0, c.width, c.height);
      const blob: Blob = await new Promise((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error("No se pudo recortar"))), "image/jpeg", 0.88));
      const fd = new FormData();
      fd.append("file", new File([blob], "recorte.jpg", { type: "image/jpeg" }));
      const up = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await up.json();
      if (!up.ok) throw new Error(data.error || "No se pudo subir");
      const url: string = data.url;

      let ex: Exercise;
      if (target === "__new__") {
        ex = { id: `custom-${Date.now().toString(36)}`, name: newName.trim(), category: newCat, equipment: "", video_url: "", description: "", extra_images: [], links: [], builtin: false, edited: true };
      } else {
        const found = exercises.find((e) => e.id === target)!;
        ex = { ...found };
      }
      if (asExtra && target !== "__new__") ex.extra_images = [...ex.extra_images, url];
      else ex.image = url;
      const err = await saveExercise(ex);
      if (err) throw new Error(err);
      setMsg(`✓ Guardado en «${ex.name}». Puedes seleccionar otro recuadro.`);
      setRect(null);
      setNewName("");
      onApplied();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Error");
    } finally {
      setBusy(false);
    }
  }

  const field = "rounded-lg border border-white/10 bg-neutral-950 px-3 py-2 text-sm outline-none focus:border-red-500";

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-neutral-900 p-4">
      <div>
        <h3 className="font-bold">Recortar desde una guía</h3>
        <p className="mt-1 text-sm text-neutral-400">Sube la guía completa (la imagen con varios ejercicios), arrastra para encerrar el ejercicio que quieres y asígnalo.</p>
      </div>
      <input type="file" accept="image/*" className="text-sm text-neutral-300"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) { setSrc(URL.createObjectURL(f)); setRect(null); setMsg(""); } }} />
      {src && (
        <>
          <div className="relative max-h-[70vh] w-fit max-w-full touch-none select-none overflow-auto rounded-lg border border-white/10"
            onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img ref={imgRef} src={src} alt="Guía" draggable={false} className="block max-w-full" />
            {rect && <div className="pointer-events-none absolute border-2 border-red-500 bg-red-500/15" style={{ left: rect.x, top: rect.y, width: rect.w, height: rect.h }} />}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select className={field} value={target} onChange={(e) => setTarget(e.target.value)}>
              <option value="__new__">➕ Ejercicio nuevo…</option>
              {exercises.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
            {target === "__new__" ? (
              <>
                <input className={`${field} min-w-[180px] flex-1`} placeholder="Nombre del ejercicio nuevo" value={newName} onChange={(e) => setNewName(e.target.value)} />
                <select className={field} value={newCat} onChange={(e) => setNewCat(e.target.value as ExerciseCategory)}>
                  {Object.entries(CATEGORY_LABEL).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                </select>
              </>
            ) : (
              <label className="flex items-center gap-2 text-sm text-neutral-300">
                <input type="checkbox" checked={asExtra} onChange={(e) => setAsExtra(e.target.checked)} /> Como foto extra (sin reemplazar la principal)
              </label>
            )}
            <button onClick={apply} disabled={busy} className="rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-60">
              {busy ? "Guardando…" : "Usar este recuadro"}
            </button>
          </div>
        </>
      )}
      {msg && <p className="text-sm text-neutral-300">{msg}</p>}
    </div>
  );
}
