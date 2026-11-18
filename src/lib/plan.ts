// Plan que el admin asigna a cada cliente. Se guarda como un solo JSON en client_plans.data.
export type MealItem = { food: string; kcal: number; fat: number; carbs: number; protein: number };
export type Meal = { name: string; items: MealItem[] };
export type DayExercise = { exerciseId: string; sets: string };
export type DayPlan = { day: string; focus: string; exercises: DayExercise[] };
export type Supplement = { name: string; dose: string; when: string; purpose: string };
export type GroceryGroup = { category: string; items: string[] };

// Medición que registra el admin (en kg y cm). Con ellas se arman los datos y gráficas del resumen del cliente.
export type Medicion = {
  fecha: string; // YYYY-MM-DD
  peso: string; cintura: string; pecho: string; cadera: string; brazo: string; muslo: string; grasa: string;
};
export const MEDIDAS: { key: Exclude<keyof Medicion, "fecha">; label: string; unit: string }[] = [
  { key: "peso", label: "Peso", unit: "kg" },
  { key: "grasa", label: "Grasa corporal", unit: "%" },
  { key: "cintura", label: "Cintura", unit: "cm" },
  { key: "pecho", label: "Pecho", unit: "cm" },
  { key: "cadera", label: "Cadera", unit: "cm" },
  { key: "brazo", label: "Brazo", unit: "cm" },
  { key: "muslo", label: "Muslo", unit: "cm" },
];
export const emptyMedicion = (): Medicion => ({
  fecha: new Date().toISOString().slice(0, 10), peso: "", cintura: "", pecho: "", cadera: "", brazo: "", muslo: "", grasa: "",
});

export type Plan = {
  resumen: { plan: string; dias_entreno: string; proxima_revision: string; meta_peso: string };
  perfil: { estatura_cm: string; talla_ropa: string; edad: string; objetivo: string };
  mediciones: Medicion[];
  dieta: { meals: Meal[]; reminders: string[] };
  entrenamiento: DayPlan[];
  suplementos: Supplement[];
  mercado: GroceryGroup[];
};

export const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

export function emptyPlan(): Plan {
  return {
    resumen: { plan: "", dias_entreno: "", proxima_revision: "", meta_peso: "" },
    perfil: { estatura_cm: "", talla_ropa: "", edad: "", objetivo: "" },
    mediciones: [],
    dieta: { meals: [], reminders: [] },
    entrenamiento: DAYS.map((day) => ({ day, focus: "", exercises: [] })),
    suplementos: [],
    mercado: [],
  };
}

// Normaliza lo que viene de la base (puede estar vacío o incompleto) a un Plan completo.
export function normalizePlan(raw: unknown): Plan {
  const base = emptyPlan();
  const r = (raw && typeof raw === "object" ? raw : {}) as Partial<Plan>;
  const days = Array.isArray(r.entrenamiento) ? r.entrenamiento : [];
  return {
    resumen: { ...base.resumen, ...(r.resumen || {}) },
    perfil: { ...base.perfil, ...(r.perfil || {}) },
    mediciones: (Array.isArray(r.mediciones) ? r.mediciones : [])
      .map((m) => ({ ...emptyMedicion(), ...m }))
      .sort((a, b) => a.fecha.localeCompare(b.fecha)),
    dieta: {
      meals: Array.isArray(r.dieta?.meals) ? r.dieta!.meals : [],
      reminders: Array.isArray(r.dieta?.reminders) ? r.dieta!.reminders : [],
    },
    entrenamiento: DAYS.map((day) => {
      const d = days.find((x) => x?.day === day);
      return { day, focus: d?.focus || "", exercises: Array.isArray(d?.exercises) ? d!.exercises : [] };
    }),
    suplementos: Array.isArray(r.suplementos) ? r.suplementos : [],
    mercado: Array.isArray(r.mercado) ? r.mercado : [],
  };
}
