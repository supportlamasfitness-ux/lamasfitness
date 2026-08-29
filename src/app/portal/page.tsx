"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getFoodVisual } from "@/data/foods";
import {
  EXERCISES_DB,
  CATEGORY_ICON,
  CATEGORY_LABEL,
  getExercise,
} from "@/data/exercises";

// ── Datos de ejemplo — maqueta visual del portal de cliente ─────────────────
// Sin backend ni login todavía. Estructura pensada para calzar con lo que
// Alberto le asigna a cada cliente: dieta por comidas con macros, avisos,
// suplementos y plan de entrenamiento por día. Reemplazar por datos reales
// una vez que se conecte a una base de datos por cliente.

type Meal = {
  name: string;
  items: { food: string; kcal: number; fat: number; carbs: number; protein: number }[];
};

const meals: Meal[] = [
  {
    name: "Comida #1 — Desayuno",
    items: [
      { food: "4 claras de huevo", kcal: 60, fat: 0, carbs: 1, protein: 13 },
      { food: "1 huevo entero", kcal: 68, fat: 5, carbs: 0, protein: 6 },
      { food: "40 g de avena", kcal: 155, fat: 3, carbs: 27, protein: 6 },
    ],
  },
  {
    name: "Comida #2 — Almuerzo",
    items: [
      { food: "6 oz pechuga de pollo", kcal: 211, fat: 8, carbs: 0, protein: 32 },
      { food: "5 oz arroz jazmín", kcal: 184, fat: 0, carbs: 40, protein: 4 },
      { food: "3 oz aguacate", kcal: 136, fat: 13, carbs: 7, protein: 2 },
    ],
  },
  {
    name: "Comida #3 — Cena",
    items: [
      { food: "5 oz salmón", kcal: 201, fat: 9, carbs: 0, protein: 28 },
      { food: "5 oz papas blancas", kcal: 137, fat: 0, carbs: 30, protein: 4 },
      { food: "4 oz vegetales mixtos", kcal: 73, fat: 0, carbs: 15, protein: 4 },
    ],
  },
];

const reminders = [
  "Las comidas se comen cada 3–4 horas.",
  "Las carnes, arroz, papas y boniatos se pesan ya cocidos.",
  "Tomar mínimo la mitad de tu peso corporal en onzas de agua al día.",
  "Sin dulces ni refrescos azucarados.",
  "Dormir 7–8 horas es parte del plan, no un extra.",
];

const supplements = [
  { name: "Multivitamínico", icon: "🌿", dose: "1 tableta", when: "Con el desayuno", purpose: "Previene déficit de nutrientes" },
  { name: "Omega-3", icon: "🐟", dose: "2 cápsulas", when: "Con cualquier comida", purpose: "Salud cardiovascular" },
  { name: "Proteína Whey", icon: "🥤", dose: "1 scoop", when: "Post-entreno o antes de dormir", purpose: "Recuperación muscular" },
  { name: "Creatina", icon: "⚡", dose: "1 scoop", when: "Diario, entrenes o no", purpose: "Energía muscular constante" },
];

type DayExercise = { exerciseId: string; sets: string };
type DayPlan = { day: string; focus: string; exercises: DayExercise[] };

const workoutPlan: DayPlan[] = [
  {
    day: "Lunes",
    focus: "Pecho & Tríceps",
    exercises: [
      { exerciseId: "press-banca-mancuernas", sets: "4 x 12-15" },
      { exerciseId: "press-inclinado-mancuernas", sets: "4 x 12-15" },
      { exerciseId: "extension-triceps-polea", sets: "4 x 12-15" },
    ],
  },
  {
    day: "Martes",
    focus: "Espalda & Bíceps",
    exercises: [
      { exerciseId: "peso-muerto", sets: "4 x 12-15" },
      { exerciseId: "remo-polea-sentado", sets: "4 x 12-15" },
      { exerciseId: "curl-biceps-ez", sets: "4 x 12-15" },
    ],
  },
  {
    day: "Miércoles",
    focus: "Pierna & Hombro",
    exercises: [
      { exerciseId: "sentadilla", sets: "4 x 12-15" },
      { exerciseId: "prensa-piernas", sets: "4 x 12-15" },
      { exerciseId: "press-militar", sets: "4 x 12-15" },
    ],
  },
  { day: "Jueves", focus: "Descanso activo", exercises: [] },
  {
    day: "Viernes",
    focus: "Full body",
    exercises: [
      { exerciseId: "peso-muerto-rumano", sets: "3 x 12-15" },
      { exerciseId: "dominadas-asistidas", sets: "3 x 12-15" },
      { exerciseId: "elevaciones-laterales", sets: "3 x 12-15" },
    ],
  },
  { day: "Sábado", focus: "Cardio ligero", exercises: [{ exerciseId: "caminadora", sets: "30-45 min" }] },
  { day: "Domingo", focus: "Día libre", exercises: [] },
];

const groceryList: { category: string; items: string[] }[] = [
  { category: "Proteínas", items: ["Pechuga de pollo", "Salmón", "Huevos", "Picadillo de pavo"] },
  { category: "Carbohidratos", items: ["Arroz jazmín", "Avena", "Papas blancas", "Boniato"] },
  { category: "Vegetales", items: ["Espárragos", "Vegetales mixtos", "Aguacate"] },
  { category: "Extras", items: ["Leche de almendras", "Proteína en polvo", "Frutos rojos"] },
];

const weightTrend = [
  { label: "Sem 1", kg: 82.1 },
  { label: "Sem 2", kg: 81.4 },
  { label: "Sem 3", kg: 80.9 },
  { label: "Sem 4", kg: 80.2 },
];
const weightGoal = 78;

const tabs = ["Resumen", "Dieta", "Entrenamiento", "Suplementos", "Lista de mercado"] as const;
type Tab = (typeof tabs)[number];

function MacroPill({ label, value }: { label: string; value: number }) {
  return (
    <span className="rounded-full border border-white/10 bg-neutral-900 px-2.5 py-0.5 text-xs text-neutral-400">
      {label} <span className="text-neutral-200">{value}</span>
    </span>
  );
}

function FoodIcon({ name }: { name: string }) {
  const visual = getFoodVisual(name);
  return (
    <span
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base"
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
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
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

function WeightChart() {
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
  const [activeDay, setActiveDay] = useState(workoutPlan[0].day);
  const [exerciseCategory, setExerciseCategory] = useState<string>("todos");
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
    });
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

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

  const categories = ["todos", ...new Set(EXERCISES_DB.map((e) => e.category))];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="border-b border-white/10 bg-neutral-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-sm font-bold tracking-tight">Portal de Alberto Lamas</p>
            <p className="text-xs text-neutral-500">Plan asignado — contenido de ejemplo, pendiente de asignación real</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-neutral-300 sm:inline">
              {clientName || "Cargando…"}
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-400 text-sm font-bold text-neutral-950">
              {clientName
                ? clientName
                    .split(" ")
                    .map((p) => p[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()
                : "…"}
            </div>
            <button
              onClick={handleLogout}
              className="rounded-full border border-white/15 px-4 py-1.5 text-sm font-medium text-neutral-300 transition-colors hover:border-amber-400 hover:text-amber-400"
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
                  ? "bg-amber-400 text-neutral-950"
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
                  { label: "Calorías objetivo/día", value: `${macroTotals.kcal}+` },
                  { label: "Días de entreno/semana", value: "5" },
                  { label: "Próxima revisión", value: "Lunes" },
                  { label: "Plan asignado", value: "Corte" },
                ].map((c) => (
                  <div
                    key={c.label}
                    className="rounded-2xl border border-white/10 bg-neutral-900 p-5"
                  >
                    <p className="text-2xl font-bold text-amber-400">{c.value}</p>
                    <p className="mt-1 text-xs text-neutral-400">{c.label}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
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
                <div className="rounded-2xl border border-white/10 bg-neutral-900 p-5">
                  <div className="mb-2 flex items-baseline justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-neutral-400">
                      Peso semanal
                    </h3>
                    <span className="text-xs text-neutral-500">
                      Meta: <span className="text-amber-400">{weightGoal} kg</span>
                    </span>
                  </div>
                  <WeightChart />
                </div>
              </div>

              <div className="rounded-2xl border border-amber-400/30 bg-amber-400/5 p-5 text-sm text-neutral-300">
                👋 Bienvenido a tu portal. Acá vas a encontrar el plan de dieta,
                entrenamiento y suplementos que Alberto te asignó, siempre
                actualizado.
              </div>
            </div>
          </div>
        )}

        {tab === "Dieta" && (
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
                      <span className="text-sm font-semibold text-amber-400">
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
                            <FoodIcon name={i.food} />
                            {i.food}
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
              <h3 className="mb-3 font-bold text-amber-400">Recordatorios</h3>
              <ul className="flex flex-col gap-2 text-sm text-neutral-300">
                {reminders.map((r) => (
                  <li key={r} className="flex gap-2">
                    <span className="text-amber-400">•</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {tab === "Entrenamiento" && (
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-6">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {workoutPlan.map((d) => (
                  <button
                    key={d.day}
                    onClick={() => setActiveDay(d.day)}
                    className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                      activeDay === d.day
                        ? "border-amber-400 bg-amber-400/10 text-amber-400"
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
                          return (
                            <div
                              key={de.exerciseId}
                              className="flex items-center gap-4 rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm"
                            >
                              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-400/10 text-lg">
                                {CATEGORY_ICON[ex.category]}
                              </span>
                              <span className="flex-1">
                                <span className="block">{ex.name}</span>
                                <span className="text-xs text-neutral-500">{ex.equipment}</span>
                              </span>
                              <span className="font-semibold text-amber-400">{de.sets}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
            </div>

            <div className="rounded-2xl border border-white/10 bg-neutral-900/50 p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-bold text-amber-400">
                  Base de ejercicios (para asignar)
                </h3>
                <span className="text-xs text-neutral-500">
                  {EXERCISES_DB.length} ejercicios disponibles
                </span>
              </div>
              <div className="mb-4 flex flex-wrap gap-2">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setExerciseCategory(c)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      exerciseCategory === c
                        ? "border-amber-400 bg-amber-400/10 text-amber-400"
                        : "border-white/10 text-neutral-400 hover:text-neutral-100"
                    }`}
                  >
                    {c === "todos" ? "Todos" : CATEGORY_LABEL[c as keyof typeof CATEGORY_LABEL]}
                  </button>
                ))}
              </div>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {EXERCISES_DB.filter(
                  (e) => exerciseCategory === "todos" || e.category === exerciseCategory
                ).map((e) => (
                  <div
                    key={e.id}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-neutral-900 px-3 py-2 text-sm"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-400/10">
                      {CATEGORY_ICON[e.category]}
                    </span>
                    <span className="flex-1 truncate">{e.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "Suplementos" && (
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
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-400/10 text-base">
                          {s.icon}
                        </span>
                        {s.name}
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
        )}

        {tab === "Lista de mercado" && (
          <div className="grid gap-4 sm:grid-cols-2">
            {groceryList.map((g) => (
              <div
                key={g.category}
                className="rounded-2xl border border-white/10 bg-neutral-900 p-5"
              >
                <h3 className="mb-3 font-bold text-amber-400">{g.category}</h3>
                <ul className="flex flex-col gap-2 text-sm text-neutral-300">
                  {g.items.map((i) => (
                    <li key={i} className="flex items-center gap-3">
                      <FoodIcon name={i} />
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
