// Base de datos interna de ejercicios, agrupados por grupo muscular. Pensada
// para que más adelante Alberto pueda elegir de esta lista al armar el plan
// de un cliente (en vez de escribir el nombre a mano cada vez). El ícono es
// por categoría, no por ejercicio individual — funciona como "foto" visual
// ligera sin depender de fotos reales con licencia.

export type ExerciseCategory =
  | "pecho"
  | "espalda"
  | "pierna"
  | "hombro"
  | "brazo"
  | "abs"
  | "cardio";

export type ExerciseDef = {
  id: string;
  name: string;
  category: ExerciseCategory;
  equipment: string;
};

export const CATEGORY_LABEL: Record<ExerciseCategory, string> = {
  pecho: "Pecho",
  espalda: "Espalda",
  pierna: "Pierna",
  hombro: "Hombro",
  brazo: "Brazo",
  abs: "Abdomen",
  cardio: "Cardio",
};

export const CATEGORY_ICON: Record<ExerciseCategory, string> = {
  pecho: "🏋️",
  espalda: "🚣",
  pierna: "🦵",
  hombro: "🤸",
  brazo: "💪",
  abs: "⚡",
  cardio: "🏃",
};

export const EXERCISES_DB: ExerciseDef[] = [
  // Pecho
  { id: "press-banca-mancuernas", name: "Press banca con mancuernas", category: "pecho", equipment: "Mancuernas" },
  { id: "press-inclinado-mancuernas", name: "Press inclinado con mancuernas", category: "pecho", equipment: "Mancuernas" },
  { id: "press-declinado-mancuernas", name: "Press declinado con mancuernas", category: "pecho", equipment: "Mancuernas" },
  { id: "aperturas-polea", name: "Aperturas en polea", category: "pecho", equipment: "Polea" },
  { id: "flexiones", name: "Flexiones de pecho", category: "pecho", equipment: "Peso corporal" },

  // Espalda
  { id: "peso-muerto", name: "Peso muerto", category: "espalda", equipment: "Barra" },
  { id: "remo-polea-sentado", name: "Remo en polea sentado", category: "espalda", equipment: "Polea" },
  { id: "dominadas", name: "Dominadas", category: "espalda", equipment: "Barra fija" },
  { id: "dominadas-asistidas", name: "Dominadas asistidas", category: "espalda", equipment: "Máquina asistida" },
  { id: "jalon-espalda-cuerda", name: "Jalón de espalda con cuerda", category: "espalda", equipment: "Polea" },
  { id: "jalon-cerrado", name: "Jalón cerrado", category: "espalda", equipment: "Polea" },

  // Pierna
  { id: "sentadilla", name: "Sentadilla", category: "pierna", equipment: "Barra" },
  { id: "prensa-piernas", name: "Prensa de piernas", category: "pierna", equipment: "Máquina" },
  { id: "extension-cuadriceps", name: "Extensión de cuádriceps", category: "pierna", equipment: "Máquina" },
  { id: "curl-femoral", name: "Curl femoral", category: "pierna", equipment: "Máquina" },
  { id: "zancadas-mancuernas", name: "Zancadas caminando con mancuernas", category: "pierna", equipment: "Mancuernas" },
  { id: "peso-muerto-rumano", name: "Peso muerto rumano", category: "pierna", equipment: "Mancuernas" },
  { id: "elevacion-talones", name: "Elevación de talones de pie", category: "pierna", equipment: "Máquina / peso corporal" },

  // Hombro
  { id: "press-militar", name: "Press militar", category: "hombro", equipment: "Barra" },
  { id: "elevaciones-frontales", name: "Elevaciones frontales", category: "hombro", equipment: "Mancuernas" },
  { id: "elevaciones-laterales", name: "Elevaciones laterales", category: "hombro", equipment: "Mancuernas" },
  { id: "remo-al-menton", name: "Remo al mentón con barra EZ", category: "hombro", equipment: "Barra EZ" },
  { id: "encogimientos", name: "Encogimientos de hombros", category: "hombro", equipment: "Mancuernas" },

  // Brazo
  { id: "curl-biceps-ez", name: "Curl de bíceps con barra EZ", category: "brazo", equipment: "Barra EZ" },
  { id: "curl-martillo", name: "Curl martillo", category: "brazo", equipment: "Mancuernas" },
  { id: "curl-biceps-mancuerna", name: "Curl de bíceps con mancuerna", category: "brazo", equipment: "Mancuernas" },
  { id: "extension-triceps-polea", name: "Extensión de tríceps en polea", category: "brazo", equipment: "Polea" },
  { id: "press-frances", name: "Press francés", category: "brazo", equipment: "Mancuernas" },

  // Abdomen
  { id: "crunch-banco", name: "Crunch en banco", category: "abs", equipment: "Peso corporal" },
  { id: "elevacion-piernas-banco", name: "Elevación de piernas en banco", category: "abs", equipment: "Peso corporal" },
  { id: "elevacion-piernas-colgado", name: "Elevación de piernas colgado", category: "abs", equipment: "Barra fija" },
  { id: "crunch-polea", name: "Crunch con polea", category: "abs", equipment: "Polea" },

  // Cardio
  { id: "caminadora", name: "Caminadora — ritmo constante", category: "cardio", equipment: "Caminadora" },
  { id: "bicicleta", name: "Bicicleta estática", category: "cardio", equipment: "Bicicleta" },
  { id: "eliptica", name: "Elíptica", category: "cardio", equipment: "Elíptica" },
];

export function getExercise(id: string): ExerciseDef | undefined {
  return EXERCISES_DB.find((e) => e.id === id);
}
