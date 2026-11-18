"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import ImagePick from "@/components/admin/ImagePick";

type T = { id: string; name: string; quote: string; rating: number; image: string; status: "pending" | "approved"; source: "admin" | "client"; created_at: string };

const input = "rounded-lg border border-white/10 bg-neutral-950 px-3 py-2 text-sm outline-none focus:border-red-500";
const small = "rounded-full border border-white/15 px-3 py-1 text-xs text-neutral-300 hover:border-red-500 hover:text-red-500";

export default function TestimoniosPage() {
  const [list, setList] = useState<T[]>([]);
  const [missing, setMissing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [quote, setQuote] = useState("");
  const [rating, setRating] = useState(5);
  const [image, setImage] = useState("");
  const [err, setErr] = useState("");

  async function reload() {
    const { data, error } = await createClient().from("testimonials").select("*").order("created_at", { ascending: false });
    setList((data as T[]) || []);
    setMissing(!!error);
    setLoading(false);
  }
  useEffect(() => { reload(); }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    if (!name.trim() || (!quote.trim() && !image)) return setErr("Pon el nombre y un comentario o una imagen.");
    const { error } = await createClient().from("testimonials").insert({ name: name.trim(), quote: quote.trim(), rating, image, status: "approved", source: "admin" });
    if (error) return setErr(error.message);
    setName(""); setQuote(""); setRating(5); setImage("");
    reload();
  }

  async function setStatus(id: string, status: T["status"]) {
    await createClient().from("testimonials").update({ status }).eq("id", id);
    reload();
  }
  async function del(id: string) {
    if (!confirm("¿Eliminar este testimonio?")) return;
    await createClient().from("testimonials").delete().eq("id", id);
    reload();
  }

  const pending = list.filter((t) => t.status === "pending");
  const approved = list.filter((t) => t.status === "approved");

  const Card = ({ t }: { t: T }) => (
    <div className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-neutral-900 p-4 sm:flex-row">
      {t.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={t.image} alt="" className="h-24 w-24 shrink-0 rounded-lg bg-neutral-950 object-cover" />
      )}
      <div className="flex-1 text-sm">
        <p className="font-semibold">{t.name} <span className="text-amber-400">{"★".repeat(t.rating)}</span>
          <span className="ml-2 text-xs font-normal text-neutral-500">{t.source === "client" ? "enviado por cliente" : "agregado por ti"}</span></p>
        {t.quote && <p className="mt-1 text-neutral-300">“{t.quote}”</p>}
        <div className="mt-3 flex gap-2">
          {t.status === "pending"
            ? <button className="rounded-full bg-red-600 px-4 py-1 text-xs font-semibold text-white hover:bg-red-500" onClick={() => setStatus(t.id, "approved")}>Aprobar y publicar</button>
            : <button className={small} onClick={() => setStatus(t.id, "pending")}>Ocultar</button>}
          <button className={small} onClick={() => del(t.id)}>Eliminar</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold">Testimonios</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Agrega comentarios o capturas de resultados de tus alumnos, y aprueba los que envíen desde su portal. Solo los aprobados aparecen en la web.
          Usa solo opiniones reales y con permiso del alumno.
        </p>
        {missing && !loading && (
          <p className="mt-3 rounded-xl border border-red-500/40 bg-red-500/5 p-3 text-sm text-red-400">
            Falta crear la tabla: ejecuta supabase/schema_v8_testimonials.sql en el SQL Editor de Supabase.
          </p>
        )}
      </div>

      <form onSubmit={add} className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-neutral-900 p-5">
        <h3 className="font-bold">Agregar testimonio</h3>
        <input className={input} placeholder="Nombre que el alumno autoriza mostrar (ej. María G.)" value={name} onChange={(e) => setName(e.target.value)} />
        <textarea rows={3} className={input} placeholder="Comentario (déjalo vacío si solo subes una captura o foto de resultados)" value={quote} onChange={(e) => setQuote(e.target.value)} />
        <div className="flex flex-wrap items-center gap-4">
          <ImagePick value={image} onChange={setImage} />
          <label className="flex items-center gap-2 text-sm text-neutral-300">
            Estrellas
            <select className={input} value={rating} onChange={(e) => setRating(Number(e.target.value))}>
              {[5, 4, 3].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
        </div>
        {err && <p className="text-sm text-red-400">{err}</p>}
        <button type="submit" disabled={missing} className="w-fit rounded-full bg-red-600 px-6 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-50">Publicar</button>
      </form>

      {pending.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="font-bold text-red-500">Pendientes de aprobar ({pending.length})</h3>
          {pending.map((t) => <Card key={t.id} t={t} />)}
        </div>
      )}
      <div className="flex flex-col gap-3">
        <h3 className="font-bold">Publicados ({approved.length})</h3>
        {loading ? <p className="text-sm text-neutral-500">Cargando…</p> : approved.length === 0 ? <p className="text-sm text-neutral-500">Todavía no hay testimonios publicados: la sección no se muestra en la web.</p> : approved.map((t) => <Card key={t.id} t={t} />)}
      </div>
    </div>
  );
}
