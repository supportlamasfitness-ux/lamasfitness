"use client";

import { useRef, useState } from "react";

// Reduce la foto a máx. 800 px y la devuelve como JPEG para que suba rápido.
async function shrink(file: File): Promise<Blob> {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, 800 / Math.max(bmp.width, bmp.height));
  const c = document.createElement("canvas");
  c.width = Math.round(bmp.width * scale);
  c.height = Math.round(bmp.height * scale);
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.drawImage(bmp, 0, 0, c.width, c.height);
  return new Promise((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error("No se pudo procesar"))), "image/jpeg", 0.85));
}

// Miniatura + botón para subir/quitar foto. `auto` es la foto de la biblioteca (si existe) que se usa cuando no se sube ninguna.
export default function ImagePick({ value, auto, onChange }: { value?: string; auto?: string | null; onChange: (url: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const shown = value || auto || null;

  async function pick(f: File | undefined) {
    if (!f) return;
    setBusy(true);
    setErr("");
    try {
      const blob = await shrink(f);
      const fd = new FormData();
      fd.append("file", new File([blob], "foto.jpg", { type: "image/jpeg" }));
      const r = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "No se pudo subir");
      onChange(d.url);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Error");
    } finally {
      setBusy(false);
      if (ref.current) ref.current.value = "";
    }
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-neutral-100 text-[10px] text-neutral-500">
        {shown ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={shown} alt="" className="h-full w-full object-contain" />
        ) : (
          "Sin foto"
        )}
      </div>
      <div className="flex flex-col items-start gap-0.5">
        <button type="button" disabled={busy} onClick={() => ref.current?.click()}
          className="rounded-full border border-white/15 px-3 py-1 text-xs text-neutral-300 hover:border-red-500 hover:text-red-500 disabled:opacity-50">
          {busy ? "Subiendo…" : value ? "Cambiar foto" : "Subir foto"}
        </button>
        {value && (
          <button type="button" onClick={() => onChange("")} className="text-[11px] text-neutral-500 hover:text-red-500">Quitar</button>
        )}
        {err && <span className="text-[11px] text-red-400">{err}</span>}
      </div>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
    </div>
  );
}
