"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getFoodVisual, getFoodImage } from "@/data/foods";
import { CATEGORY_ICON } from "@/data/exercises";
import { loadExercises, type Exercise } from "@/lib/exercise-store";
import VideoEmbed from "@/components/VideoEmbed";
import OpinionForm from "@/components/OpinionForm";
import ChangePassword from "@/components/ChangePassword";
import { normalizePlan, emptyPlan, MEDIDAS, linkLabel, type Plan } from "@/lib/plan";

const tabs = ["Resumen", "Dieta", "Entrenamiento", "Suplementos", "Lista de mercado"] as const;
type Tab = (typeof tabs)[number];

function BuyLink({ url }: { url: string }) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer sponsored"
      className="ml-1 inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-red-500/40 px-2.5 py-0.5 text-xs font-semibold text-red-500 hover:bg-red-500 hover:text-white">
      🛒 {linkLabel(url)}
    </a>
  );
}

function MacroPill({ label, value }: { label: string; value: number }) {
  return (
    <span className="rounded-full border border-white/10 bg-neutral-900 px-2.5 py-0.5 text-xs text-neutral-400">
      {label} <span className="text-neutral-200">{value}</span>
    </span>
  );
}

function FoodIcon({ name, image }: { name: string; image?: string }) {
  const img = image || getFoodImage(name);
  if (img) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={img} alt={name} loading="lazy" className="h-10 w-10 shrink-0 rounded-lg bg-neutral-100 object-contain p-0.5" />;
  }
  const visual = getFoodVisual(name);
  return (
    <span
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-base"
      style={{ backgroundColor: `${visual.color}22`, border: `1px solid ${visual.color}55` }}
    >
      {visual.icon}
    </span>
  );
}

// Genera valores con apariencia aleatoria pero deterministas (misma semilla
// siempre da el mismo resultado) — evita mismatch de hidratación entre el
// render del servidor y el del cliente.
function seededRandom(seed: number) {
  const x = Math.sin(seed * 999) * 10000;
  return x - Math.floor(x);
}

function GoldParticles({ count = 24 }: { count?: number }) {
  const particles = Array.from({ length: count }, (_, i) => ({
    left: seededRandom(i) * 100,
    size: 3 + seededRandom(i + 50) * 4,
    duration: 7 + seededRandom(i + 100) * 7,
    delay: seededRandom(i + 150) * 9,
  }));
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p, i) => (
        <span
          key={i}
          className="gold-particle"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

function MacroDonut({ protein, carbs, fat }: { protein: number; carbs: number; fat: number }) {
  const pKcal = protein * 4;
  const cKcal = carbs * 4;
  const fKcal = fat * 9;
  const total = pKcal + cKcal + fKcal || 1;
  const pPct = (pKcal / total) * 100;
  const cPct = (cKcal / total) * 100;
  const gradient = `conic-gradient(#f59e0b 0% ${pPct}%, #34d399 ${pPct}% ${pPct + cPct}%, #60a5fa ${pPct + cPct}% 100%)`;

  return (
    <div className="flex items-center gap-6">
      <div
        className="relative h-28 w-28 shrink-0 rounded-full"
        style={{ background: gradient }}
      >
        <div className="absolute inset-2.5 flex flex-col items-center justify-center rounded-full bg-neutral-900">
          <span className="text-lg font-bold">{Math.round(total)}</span>
          <span className="text-[10px] text-neutral-500">kcal</span>
        </div>
      </div>
      <div className="flex flex-col gap-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
          Proteína <span className="text-neutral-400">{protein}g</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          Carbohidratos <span className="text-neutral-400">{carbs}g</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-blue-400" />
          Grasas <span className="text-neutral-400">{fat}g</span>
        </div>
      </div>
    </div>
  );
}

function WeightChart({ weightTrend, weightGoal }: { weightTrend: { label: string; kg: number }[]; weightGoal: number }) {
  const values = weightTrend.map((w) => w.kg);
  const min = Math.min(...values, weightGoal) - 1;
  const max = Math.max(...values) + 1;
  const range = max - min || 1;
  const w = 300;
  const h = 110;
  const pad = 12;

  const xFor = (i: number) => pad + (i / (weightTrend.length - 1)) * (w - pad * 2);
  const yFor = (kg: number) => h - pad - ((kg - min) / range) * (h - pad * 2);
  const points = weightTrend.map((wt, i) => `${xFor(i)},${yFor(wt.kg)}`).join(" ");
  const goalY = yFor(weightGoal);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img" aria-label="Tendencia de peso semanal">
      <line x1={pad} y1={goalY} x2={w - pad} y2={goalY} stroke="#f59e0b" strokeOpacity={0.4} strokeDasharray="4 4" />
      <polyline points={points} fill="none" stroke="#fbbf24" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      {weightTrend.map((wt, i) => (
        <g key={wt.label}>
          <circle cx={xFor(i)} cy={yFor(wt.kg)} r={3.5} fill="#fbbf24" />
          <text x={xFor(i)} y={h - 1} fontSize={8} fill="#737373" textAnchor="middle">
            {wt.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function PortalPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("Resumen");
  const [plan, setPlan] = useState<Plan>(emptyPlan());
  const [planLoaded, setPlanLoaded] = useState(false);
  const [activeDay, setActiveDay] = useState("Lunes");
  const [openEx, setOpenEx] = useState<string | null>(null);
  const [exList, setExList] = useState<Exercise[]>([]);
  const getExercise = (id: string) => exList.find((e) => e.id === id);
  const [clientName, setClientName] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle();
      setClientName(profile?.full_name || user.email || "Cliente");
      // Solo lectura: RLS deja leer únicamente el plan propio; escribir solo puede el admin.
      const { data: row } = await supabase
        .from("client_plans")
        .select("data")
        .eq("client_id", user.id)
        .maybeSingle();
      const p = normalizePlan(row?.data);
      setPlan(p);
      setActiveDay((p.entrenamiento.find((d) => d.focus || d.exercises.length)?.day) || "Lunes");
      // Ejercicios con los ajustes del admin (nombre, foto, descripción y video)
      setExList((await loadExercises()).exercises);
      setPlanLoaded(true);
    });
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const meals = plan.dieta.meals;
  const reminders = plan.dieta.reminders;
  const workoutPlan = plan.entrenamiento;
  const supplements = plan.suplementos;
  const groceryList = plan.mercado.filter((g) => g.category || g.items.some((i) => i.name || i.url));
  const num = (v: string) => parseFloat((v || "").replace(",", "."));
  const withWeight = plan.mediciones.filter((m) => !Number.isNaN(num(m.peso)));
  const weightTrend = withWeight.map((m) => ({ label: m.fecha.slice(8, 10) + "/" + m.fecha.slice(5, 7), kg: num(m.peso) }));
  const first = plan.mediciones[0];
  const last = plan.mediciones[plan.mediciones.length - 1];
  const perfilItems = [
    ["Estatura", plan.perfil.estatura_cm && `${plan.perfil.estatura_cm} cm`],
    ["Talla", plan.perfil.talla_ropa],
    ["Edad", plan.perfil.edad && `${plan.perfil.edad} años`],
    ["Objetivo", plan.perfil.objetivo],
  ].filter(([, v]) => v) as [string, string][];
  const weightGoal = parseFloat(plan.resumen.meta_peso.replace(",", ".")) || 0;
  const hasPlan = plan.mediciones.length > 0 || meals.length > 0 || workoutPlan.some((d) => d.focus || d.exercises.length) || supplements.length > 0 || groceryList.length > 0;
  const empty = (what: string) => (
    <p className="rounded-2xl border border-white/10 bg-neutral-900 p-6 text-sm text-neutral-400">
      {planLoaded ? `Lamas Fitness todavía no te asignó ${what}. Aparecerá aquí en cuanto lo cargue.` : "Cargando…"}
    </p>
  );

  const macroTotals = meals.reduce(
    (acc, m) =>
      m.items.reduce(
        (s, i) => ({
          kcal: s.kcal + i.kcal,
          fat: s.fat + i.fat,
          carbs: s.carbs + i.carbs,
          protein: s.protein + i.protein,
        }),
        acc
      ),
    { kcal: 0, fat: 0, carbs: 0, protein: 0 }
  );


  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="border-b border-white/10 bg-neutral-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-sm font-bold tracking-tight">Portal de Lamas Fitness</p>
            <p className="text-xs text-neutral-500">Tu plan, asignado por tu entrenador</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-neutral-300 sm:inline">
              {clientName || "Cargando…"}
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500 text-sm font-bold text-white">
              {clientName
                ? clientName
                    .split(" ")
                    .map((p) => p[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()
                : "…"}
            </div>
            <ChangePassword />
            <button
              onClick={handleLogout}
              className="rounded-full border border-white/15 px-4 py-1.5 text-sm font-medium text-neutral-300 transition-colors hover:border-red-500 hover:text-red-500"
            >
              Salir
            </button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-6 pb-2 text-sm">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 font-medium transition-colors ${
                tab === t
                  ? "bg-red-500 text-white"
                  : "text-neutral-400 hover:text-neutral-100"
              }`}
            >
              {t}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        {tab === "Resumen" && (
          <div className="relative overflow-hidden rounded-3xl">
            <GoldParticles />
            <div className="relative flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: "Calorías objetivo/día", value: meals.length ? `${macroTotals.kcal}` : "—" },
                  { label: "Días de entreno/semana", value: plan.resumen.dias_entreno || "—" },
                  { label: "Próxima revisión", value: plan.resumen.proxima_revision || "—" },
                  { label: "Plan asignado", value: plan.resumen.plan || "—" },
                ].map((c) => (
                  <div
                    key={c.label}
                    className="rounded-2xl border border-white/10 bg-neutral-900 p-5"
                  >
                    <p className="text-2xl font-bold text-red-500">{c.value}</p>
                    <p className="mt-1 text-xs text-neutral-400">{c.label}</p>
                  </div>
                ))}
              </div>

              {(perfilItems.length > 0 || last) && (
                <div className="rounded-2xl border border-white/10 bg-neutral-900 p-5">
                  <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-neutral-400">Mis datos</h3>
                  {perfilItems.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-x-8 gap-y-2 text-sm">
                      {perfilItems.map(([k, v]) => (
                        <p key={k}><span className="text-neutral-500">{k}: </span><span className="font-semibold">{v}</span></p>
                      ))}
                    </div>
                  )}
                  {last && (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {MEDIDAS.filter((d) => last[d.key]).map((d) => {
                        const delta = first && first !== last && first[d.key] ? num(last[d.key]) - num(first[d.key]) : null;
                        return (
                          <div key={d.key} className="rounded-xl border border-white/5 bg-neutral-950 p-3">
                            <p className="text-xl font-bold text-red-500">{last[d.key]}<span className="ml-1 text-xs font-normal text-neutral-500">{d.unit}</span></p>
                            <p className="text-xs text-neutral-400">{d.label}</p>
                            {delta !== null && !Number.isNaN(delta) && (
                              <p className={`mt-1 text-xs ${delta <= 0 ? "text-emerald-400" : "text-neutral-400"}`}>
                                {delta > 0 ? "+" : ""}{Math.round(delta * 10) / 10} {d.unit} desde el inicio
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {last && <p className="mt-3 text-xs text-neutral-500">Última medición: {last.fecha}</p>}
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                {meals.length > 0 && (
                <div className="rounded-2xl border border-white/10 bg-neutral-900 p-5">
                  <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-neutral-400">
                    Macros de hoy
                  </h3>
                  <MacroDonut
                    protein={macroTotals.protein}
                    carbs={macroTotals.carbs}
                    fat={macroTotals.fat}
                  />
                </div>
                )}
                {weightTrend.length >= 2 && (
                <div className="rounded-2xl border border-white/10 bg-neutral-900 p-5">
                  <div className="mb-2 flex items-baseline justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-neutral-400">
                      Evolución de peso
                    </h3>
                    <span className="text-xs text-neutral-500">
                      {weightGoal > 0 && <>Meta: <span className="text-red-500">{weightGoal} kg</span></>}
                    </span>
                  </div>
                  <WeightChart weightTrend={weightTrend} weightGoal={weightGoal || weightTrend[0].kg} />
                </div>
                )}
              </div>

              <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-5 text-sm text-neutral-300">
                👋 Bienvenido a tu portal. Acá vas a encontrar el plan de dieta,
                entrenamiento y suplementos que Lamas Fitness te asignó, siempre
                actualizado.{planLoaded && !hasPlan && " Estamos preparando tu plan: lo verás aquí en cuanto lo asigne."}
              </div>

              {clientName && <OpinionForm fullName={clientName} />}
            </div>
          </div>
        )}

        {tab === "Dieta" && (meals.length === 0 ? empty("una dieta") : (
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              {meals.map((meal) => {
                const totals = meal.items.reduce(
                  (acc, i) => ({
                    kcal: acc.kcal + i.kcal,
                    fat: acc.fat + i.fat,
                    carbs: acc.carbs + i.carbs,
                    protein: acc.protein + i.protein,
                  }),
                  { kcal: 0, fat: 0, carbs: 0, protein: 0 }
                );
                return (
                  <div
                    key={meal.name}
                    className="rounded-2xl border border-white/10 bg-neutral-900 p-5"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-bold">{meal.name}</h3>
                      <span className="text-sm font-semibold text-red-500">
                        {totals.kcal} kcal
                      </span>
                    </div>
                    <ul className="flex flex-col gap-3 text-sm text-neutral-300">
                      {meal.items.map((i) => (
                        <li
                          key={i.food}
                          className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-3 last:border-0 last:pb-0"
                        >
                          <span className="flex items-center gap-3">
                            <FoodIcon name={i.food} image={i.image} />
                            <span>
                              {i.food}
                              {i.url && <span className="mt-1 block"><BuyLink url={i.url} /></span>}
                            </span>
                          </span>
                          <span className="flex gap-1.5">
                            <MacroPill label="P" value={i.protein} />
                            <MacroPill label="C" value={i.carbs} />
                            <MacroPill label="G" value={i.fat} />
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
            <div className="rounded-2xl border border-white/10 bg-neutral-900/50 p-5">
              <h3 className="mb-3 font-bold text-red-500">Recordatorios</h3>
              <ul className="flex flex-col gap-2 text-sm text-neutral-300">
                {reminders.map((r) => (
                  <li key={r} className="flex gap-2">
                    <span className="text-red-500">•</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}

        {tab === "Entrenamiento" && (!workoutPlan.some((d) => d.focus || d.exercises.length) ? empty("un plan de entrenamiento") : (
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-6">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {workoutPlan.map((d) => (
                  <button
                    key={d.day}
                    onClick={() => setActiveDay(d.day)}
                    className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                      activeDay === d.day
                        ? "border-red-500 bg-red-500/10 text-red-500"
                        : "border-white/10 text-neutral-400 hover:text-neutral-100"
                    }`}
                  >
                    {d.day}
                  </button>
                ))}
              </div>
              {workoutPlan
                .filter((d) => d.day === activeDay)
                .map((d) => (
                  <div key={d.day}>
                    <h3 className="mb-4 text-lg font-bold">
                      {d.day} <span className="text-neutral-400">— {d.focus}</span>
                    </h3>
                    {d.exercises.length === 0 ? (
                      <p className="text-sm text-neutral-400">
                        Sin ejercicios asignados para este día.
                      </p>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {d.exercises.map((de) => {
                          const ex = getExercise(de.exerciseId);
                          if (!ex) return null;
                          const key = `${d.day}-${de.exerciseId}`;
                          const open = openEx === key;
                          return (
                            <div key={key} className="overflow-hidden rounded-xl border border-white/10 bg-neutral-900 text-sm">
                              <button
                                type="button"
                                onClick={() => setOpenEx(open ? null : key)}
                                className="flex w-full items-center gap-4 px-4 py-3 text-left"
                                aria-expanded={open}
                              >
                                {ex.image ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={ex.image} alt="" loading="lazy" className="h-14 w-20 shrink-0 rounded-lg bg-white object-cover object-top" />
                                ) : (
                                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-lg">
                                    {CATEGORY_ICON[ex.category]}
                                  </span>
                                )}
                                <span className="flex-1">
                                  <span className="block">{ex.name}</span>
                                  <span className="text-xs text-neutral-500">
                                    {ex.equipment}<span className="text-red-500"> · {open ? "ocultar" : "ver cómo se hace"}</span>
                                  </span>
                                </span>
                                <span className="font-semibold text-red-500">{de.sets}</span>
                              </button>
                              {open && (
                                <div className="border-t border-white/10">
                                  {ex.image && (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={ex.image} alt={`Cómo hacer ${ex.name}`} className="w-full bg-white" />
                                  )}
                                  {ex.description && (
                                    <p className="whitespace-pre-line px-4 py-4 text-sm leading-relaxed text-neutral-300">
                                      {ex.description}
                                    </p>
                                  )}
                                  {ex.video_url && (
                                    <div className="px-4 pb-4">
                                      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-neutral-400">Video sugerido</p>
                                      <VideoEmbed url={ex.video_url} />
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
            </div>

          </div>
        ))}

        {tab === "Suplementos" && (supplements.length === 0 ? empty("suplementos") : (
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-neutral-900">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/10 text-xs uppercase tracking-wide text-neutral-500">
                <tr>
                  <th className="px-5 py-3">Suplemento</th>
                  <th className="px-5 py-3">Dosis</th>
                  <th className="px-5 py-3">Cuándo</th>
                  <th className="px-5 py-3">Para qué sirve</th>
                </tr>
              </thead>
              <tbody>
                {supplements.map((s) => (
                  <tr key={s.name} className="border-b border-white/5 last:border-0">
                    <td className="px-5 py-3 font-medium">
                      <span className="flex items-center gap-3">
                        {s.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={s.image} alt={s.name} loading="lazy" className="h-12 w-12 shrink-0 rounded-lg bg-neutral-100 object-contain p-0.5" />
                        ) : (
                          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-base">💊</span>
                        )}
                        <span>
                          {s.name}
                          {s.url && <span className="mt-1 block"><BuyLink url={s.url} /></span>}
                        </span>
                      </span>
                    </td>
                    <td className="px-5 py-3 text-neutral-300">{s.dose}</td>
                    <td className="px-5 py-3 text-neutral-300">{s.when}</td>
                    <td className="px-5 py-3 text-neutral-400">{s.purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

        {tab === "Lista de mercado" && (
          <div className="flex flex-col gap-8">
            {groceryList.length === 0 ? empty("una lista de mercado") : (
              <div className="grid gap-4 sm:grid-cols-2">
                {groceryList.map((g) => (
                  <div key={g.category} className="rounded-2xl border border-white/10 bg-neutral-900 p-5">
                    <h3 className="mb-3 font-bold text-red-500">{g.category}</h3>
                    <ul className="flex flex-col gap-2 text-sm text-neutral-300">
                      {g.items.filter((i) => i.name || i.url).map((i, k) => (
                        <li key={k} className="flex items-center gap-3">
                          <FoodIcon name={i.name} image={i.image} />
                          <span>
                            {i.name || (i.url ? linkLabel(i.url).replace("Comprar en ", "Producto en ") : "")}
                            {i.url && <span className="mt-1 block"><BuyLink url={i.url} /></span>}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
            <div>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-neutral-400">Guías de Lamas Fitness</h3>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  ["lista-mercado", "Lista de mercado"],
                  ["proteinas-gasolinera", "Mejores proteínas de gasolinera"],
                  ["productos-para-cocinar", "Productos bajos en calorías para cocinar"],
                ].map(([f, t]) => (
                  <a key={f} href={`/images/guias/${f}.jpg`} target="_blank" rel="noopener noreferrer"
                    className="group overflow-hidden rounded-2xl border border-white/10 bg-neutral-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/images/guias/${f}.jpg`} alt={t} loading="lazy" className="w-full transition-transform group-hover:scale-[1.02]" />
                    <p className="px-4 py-3 text-sm text-neutral-300">{t} <span className="text-neutral-500">· toca para ampliar</span></p>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
