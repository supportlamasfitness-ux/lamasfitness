import { createClient } from "@/lib/supabase/client";
import { EXERCISES_DB, type ExerciseDef } from "@/data/exercises";
import { DEFAULT_DESCRIPTIONS } from "@/data/exercise-descriptions";

export type Exercise = ExerciseDef & {
  video_url: string;
  description: string;
  extra_images: string[]; // fotos adicionales (guías, variantes)
  links: { label: string; url: string }[]; // enlaces de referencia
  builtin: boolean; // viene incluido en la app
  edited: boolean; // tiene ajustes guardados por el admin
};

type Row = {
  id: string; name: string | null; category: string | null; equipment: string | null; image: string | null;
  video_url: string | null; description: string | null; sets: string | null; is_custom: boolean;
  extra_images?: string[] | null; links?: { label: string; url: string }[] | null;
};

// Une los ejercicios incluidos con los ajustes y los ejercicios nuevos del admin (tabla exercises_custom).
export async function loadExercises(): Promise<{ exercises: Exercise[]; missing: boolean }> {
  const supabase = createClient();
  const [{ data: rows, error }, { data: notes }] = await Promise.all([
    supabase.from("exercises_custom").select("*"),
    supabase.from("exercise_notes").select("exercise_id, description"),
  ]);
  const byId = new Map<string, Row>(((rows as Row[]) || []).map((r) => [r.id, r]));
  const oldNotes = new Map<string, string>((notes || []).map((n) => [n.exercise_id, n.description]));

  const out: Exercise[] = EXERCISES_DB.map((b) => {
    const r = byId.get(b.id);
    return {
      id: b.id,
      name: r?.name || b.name,
      category: (r?.category as Exercise["category"]) || b.category,
      equipment: r?.equipment ?? b.equipment,
      image: r?.image || b.image,
      sets: r?.sets || b.sets,
      video_url: r?.video_url || "",
      extra_images: r?.extra_images || [],
      links: r?.links || [],
      description: r?.description || oldNotes.get(b.id) || DEFAULT_DESCRIPTIONS[b.id] || "",
      builtin: true,
      edited: !!r,
    };
  });
  for (const r of (rows as Row[]) || []) {
    if (!r.is_custom) continue;
    out.push({
      id: r.id, name: r.name || "Ejercicio", category: (r.category as Exercise["category"]) || "pecho",
      equipment: r.equipment || "", image: r.image || undefined, sets: r.sets || undefined,
      video_url: r.video_url || "", description: r.description || "", builtin: false, edited: true,
      extra_images: r.extra_images || [], links: r.links || [],
    });
  }
  return { exercises: out, missing: !!error };
}

// Convierte un enlace de YouTube/Vimeo en URL para incrustar; null si no se reconoce.
export function videoEmbed(url: string): { kind: "iframe" | "file"; src: string } | null {
  const u = url.trim();
  if (!u) return null;
  const yt = u.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return { kind: "iframe", src: `https://www.youtube.com/embed/${yt[1]}` };
  const vm = u.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return { kind: "iframe", src: `https://player.vimeo.com/video/${vm[1]}` };
  if (/\.(mp4|webm|mov)(\?|$)/i.test(u)) return { kind: "file", src: u };
  return null;
}

// Guarda (crea o actualiza) un ejercicio completo en exercises_custom.
export async function saveExercise(d: Exercise): Promise<string | null> {
  const full = {
    id: d.id, name: d.name, category: d.category, equipment: d.equipment, image: d.image || "",
    video_url: d.video_url, description: d.description, sets: d.sets || "", is_custom: !d.builtin,
    extra_images: d.extra_images, links: d.links.filter((l) => l.url.trim()), updated_at: new Date().toISOString(),
  };
  const supabase = createClient();
  let { error } = await supabase.from("exercises_custom").upsert(full);
  if (error && /extra_images|links/.test(error.message)) {
    // Falta el schema_v9: se guarda sin los campos nuevos y se avisa
    const { extra_images: _a, links: _b, ...base } = full; // eslint-disable-line @typescript-eslint/no-unused-vars
    ({ error } = await supabase.from("exercises_custom").upsert(base));
    return error ? error.message : "Guardado, pero las fotos extra y enlaces necesitan ejecutar supabase/schema_v9_exercise_extras.sql";
  }
  return error ? error.message : null;
}
