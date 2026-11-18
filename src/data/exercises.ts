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
  /** Ilustración Inicio/Movimiento (de las guías de Lamas Fitness) */
  image?: string;
  /** Series y repeticiones sugeridas, para autocompletar al asignar */
  sets?: string;
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
  { id: "press-inclinado-mancuernas", name: "Press inclinado con mancuernas", category: "pecho", equipment: "Mancuernas", image: "/images/ejercicios/press-inclinado-mancuernas.jpg", sets: "4 x 8-12" },
  { id: "press-declinado-mancuernas", name: "Press declinado con mancuernas", category: "pecho", equipment: "Mancuernas" },
  { id: "aperturas-polea", name: "Aperturas en polea", category: "pecho", equipment: "Polea" },
  { id: "flexiones", name: "Flexiones de pecho", category: "pecho", equipment: "Peso corporal", image: "/images/ejercicios/flexiones.jpg", sets: "3 x al fallo" },

  // Espalda
  { id: "peso-muerto", name: "Peso muerto", category: "espalda", equipment: "Barra" },
  { id: "remo-polea-sentado", name: "Remo en polea sentado", category: "espalda", equipment: "Polea" },
  { id: "dominadas", name: "Dominadas", category: "espalda", equipment: "Barra fija", image: "/images/ejercicios/dominadas.jpg", sets: "4 x 8-12" },
  { id: "dominadas-asistidas", name: "Dominadas asistidas", category: "espalda", equipment: "Máquina asistida" },
  { id: "jalon-espalda-cuerda", name: "Jalón de espalda con cuerda", category: "espalda", equipment: "Polea" },
  { id: "jalon-cerrado", name: "Jalón cerrado", category: "espalda", equipment: "Polea" },

  // Pierna
  { id: "sentadilla", name: "Sentadilla", category: "pierna", equipment: "Barra", image: "/images/ejercicios/sentadilla.jpg", sets: "4 x 8-12" },
  { id: "prensa-piernas", name: "Prensa de piernas", category: "pierna", equipment: "Máquina", image: "/images/ejercicios/prensa-piernas.jpg", sets: "4 x 10-15" },
  { id: "extension-cuadriceps", name: "Extensión de cuádriceps", category: "pierna", equipment: "Máquina", image: "/images/ejercicios/extension-cuadriceps.jpg", sets: "3 x 12-15" },
  { id: "curl-femoral", name: "Curl femoral", category: "pierna", equipment: "Máquina", image: "/images/ejercicios/curl-femoral.jpg", sets: "3 x 10-15" },
  { id: "zancadas-mancuernas", name: "Zancadas caminando con mancuernas", category: "pierna", equipment: "Mancuernas", image: "/images/ejercicios/zancadas-mancuernas.jpg", sets: "3 x 10-12 por pierna" },
  { id: "peso-muerto-rumano", name: "Peso muerto rumano", category: "pierna", equipment: "Mancuernas", image: "/images/ejercicios/peso-muerto-rumano.jpg", sets: "4 x 8-12" },
  { id: "elevacion-talones", name: "Elevación de talones de pie", category: "pierna", equipment: "Máquina / peso corporal", image: "/images/ejercicios/elevacion-talones.jpg", sets: "4 x 15-20" },

  // Hombro
  { id: "press-militar", name: "Press militar", category: "hombro", equipment: "Barra" },
  { id: "elevaciones-frontales", name: "Elevaciones frontales", category: "hombro", equipment: "Mancuernas" },
  { id: "elevaciones-laterales", name: "Elevaciones laterales", category: "hombro", equipment: "Mancuernas", image: "/images/ejercicios/elevaciones-laterales.jpg", sets: "4 x 12-15" },
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
  { id: "crunch-polea", name: "Crunch con polea", category: "abs", equipment: "Polea", image: "/images/ejercicios/crunch-polea.jpg", sets: "3 x 12-15" },

  // Nuevos (guías de Lamas Fitness)
  { id: "sentadilla-bulgara", name: "Sentadilla búlgara", category: "pierna", equipment: "Mancuernas y banco", image: "/images/ejercicios/sentadilla-bulgara.jpg", sets: "3 x 10-12 por pierna" },
  { id: "press-militar-mancuernas", name: "Press militar con mancuernas", category: "hombro", equipment: "Mancuernas", image: "/images/ejercicios/press-militar-mancuernas.jpg", sets: "4 x 8-10" },
  { id: "press-hombros-maquina", name: "Press de hombros en máquina", category: "hombro", equipment: "Máquina", image: "/images/ejercicios/press-hombros-maquina.jpg", sets: "3 x 10-12" },
  { id: "pajaros", name: "Pájaros / Elevaciones posteriores", category: "hombro", equipment: "Mancuernas", image: "/images/ejercicios/pajaros.jpg", sets: "3 x 12-15" },
  { id: "elevacion-lateral-polea", name: "Elevación lateral en polea", category: "hombro", equipment: "Polea", image: "/images/ejercicios/elevacion-lateral-polea.jpg", sets: "3 x 12-15" },
  { id: "face-pulls", name: "Face pulls", category: "hombro", equipment: "Polea", image: "/images/ejercicios/face-pulls.jpg", sets: "3 x 15-20" },
  { id: "remo-barra", name: "Remo con barra", category: "espalda", equipment: "Barra", image: "/images/ejercicios/remo-barra.jpg", sets: "4 x 8-12" },
  { id: "remo-maquina", name: "Remo en máquina (sentado)", category: "espalda", equipment: "Máquina", image: "/images/ejercicios/remo-maquina.jpg", sets: "3 x 10-12" },
  { id: "jalon-pecho-polea", name: "Jalón al pecho en polea", category: "espalda", equipment: "Polea", image: "/images/ejercicios/jalon-pecho-polea.jpg", sets: "3 x 10-12" },
  { id: "pullover-polea", name: "Pullover en polea o mancuerna", category: "espalda", equipment: "Polea", image: "/images/ejercicios/pullover-polea.jpg", sets: "3 x 12-15" },
  { id: "remo-alto-polea", name: "Remo alto en polea", category: "espalda", equipment: "Polea", image: "/images/ejercicios/remo-alto-polea.jpg", sets: "3 x 10-12" },
  { id: "press-banca-barra", name: "Press de banca con barra", category: "pecho", equipment: "Barra", image: "/images/ejercicios/press-banca-barra.jpg", sets: "4 x 8-10" },
  { id: "aperturas-mancuernas", name: "Aperturas con mancuernas", category: "pecho", equipment: "Mancuernas", image: "/images/ejercicios/aperturas-mancuernas.jpg", sets: "3 x 10-12" },
  { id: "press-maquina-pec-deck", name: "Press en máquina (pec deck)", category: "pecho", equipment: "Máquina", image: "/images/ejercicios/press-maquina-pec-deck.jpg", sets: "3 x 10-12" },
  { id: "press-declinado-barra", name: "Press declinado con barra", category: "pecho", equipment: "Barra", image: "/images/ejercicios/press-declinado-barra.jpg", sets: "3 x 8-12" },
  { id: "fondos-paralelas", name: "Fondos en paralelas", category: "pecho", equipment: "Paralelas", image: "/images/ejercicios/fondos-paralelas.jpg", sets: "3 x 8-12" },
  { id: "cruce-poleas", name: "Cruce de poleas (cables)", category: "pecho", equipment: "Poleas", image: "/images/ejercicios/cruce-poleas.jpg", sets: "3 x 12-15" },
  { id: "crunch-maquina", name: "Crunch en máquina", category: "abs", equipment: "Máquina", image: "/images/ejercicios/crunch-maquina.jpg", sets: "3 x 12-15" },
  { id: "elevacion-piernas-maquina", name: "Elevación de piernas en máquina", category: "abs", equipment: "Máquina", image: "/images/ejercicios/elevacion-piernas-maquina.jpg", sets: "3 x 10-15" },
  { id: "twist-maquina", name: "Twist en máquina (rotación de tronco)", category: "abs", equipment: "Máquina", image: "/images/ejercicios/twist-maquina.jpg", sets: "3 x 12-15 por lado" },
  { id: "crunch-inverso-maquina", name: "Crunch inverso en máquina", category: "abs", equipment: "Máquina", image: "/images/ejercicios/crunch-inverso-maquina.jpg", sets: "3 x 12-15" },
  { id: "oblicuos-maquina", name: "Máquina de abdominales oblicuos", category: "abs", equipment: "Máquina", image: "/images/ejercicios/oblicuos-maquina.jpg", sets: "3 x 12-15 por lado" },
  { id: "elevacion-rodillas-asistido", name: "Elevación de rodillas en banco asistido", category: "abs", equipment: "Banco asistido", image: "/images/ejercicios/elevacion-rodillas-asistido.jpg", sets: "3 x 12-15" },
  { id: "plancha-maquina", name: "Plancha en máquina (abdominales)", category: "abs", equipment: "Máquina", image: "/images/ejercicios/plancha-maquina.jpg", sets: "3 x 30-45 seg" },
  { id: "crunch-maquina-peso", name: "Crunch en máquina con peso", category: "abs", equipment: "Máquina", image: "/images/ejercicios/crunch-maquina-peso.jpg", sets: "3 x 12-15" },

  // Cardio
  { id: "caminadora", name: "Caminadora — ritmo constante", category: "cardio", equipment: "Caminadora" },
  { id: "bicicleta", name: "Bicicleta estática", category: "cardio", equipment: "Bicicleta" },
  { id: "eliptica", name: "Elíptica", category: "cardio", equipment: "Elíptica" },
];

export function getExercise(id: string): ExerciseDef | undefined {
  return EXERCISES_DB.find((e) => e.id === id);
}
