// Mapeo de alimentos → ícono ilustrado + color, para darle una "foto" visual a
// cada item de la dieta y la lista de mercado sin depender de fotos externas
// (con licencia dudosa o links que se pueden romper). Match por palabra clave
// sobre el nombre del alimento, sin distinguir acentos ni mayúsculas.

export type FoodVisual = { icon: string; color: string };

const FOOD_KEYWORDS: { match: string; icon: string; color: string }[] = [
  { match: "huevo", icon: "🥚", color: "#fde68a" },
  { match: "pollo", icon: "🍗", color: "#fca5a5" },
  { match: "pavo", icon: "🍗", color: "#fdba74" },
  { match: "salmon", icon: "🐟", color: "#93c5fd" },
  { match: "atun", icon: "🐟", color: "#93c5fd" },
  { match: "tilapia", icon: "🐟", color: "#93c5fd" },
  { match: "res", icon: "🥩", color: "#fca5a5" },
  { match: "carne", icon: "🥩", color: "#fca5a5" },
  { match: "arroz", icon: "🍚", color: "#e5e7eb" },
  { match: "avena", icon: "🥣", color: "#fcd34d" },
  { match: "quinoa", icon: "🥣", color: "#fcd34d" },
  { match: "papa", icon: "🥔", color: "#d6b98c" },
  { match: "boniato", icon: "🍠", color: "#f97316" },
  { match: "sweet potato", icon: "🍠", color: "#f97316" },
  { match: "aguacate", icon: "🥑", color: "#86efac" },
  { match: "vegetal", icon: "🥦", color: "#4ade80" },
  { match: "esparrago", icon: "🥦", color: "#4ade80" },
  { match: "almendra", icon: "🌰", color: "#d6b98c" },
  { match: "leche", icon: "🥛", color: "#f8fafc" },
  { match: "proteina", icon: "🥤", color: "#c4b5fd" },
  { match: "whey", icon: "🥤", color: "#c4b5fd" },
  { match: "berr", icon: "🫐", color: "#a78bfa" },
  { match: "manzana", icon: "🍎", color: "#f87171" },
  { match: "banana", icon: "🍌", color: "#facc15" },
  { match: "pan", icon: "🍞", color: "#d6b98c" },
];

const DEFAULT_FOOD_VISUAL: FoodVisual = { icon: "🍽️", color: "#9ca3af" };

const DIACRITICS_RE = new RegExp("[\\u0300-\\u036f]", "g");

function normalize(s: string) {
  return s.toLowerCase().normalize("NFD").replace(DIACRITICS_RE, "");
}

export function getFoodVisual(name: string): FoodVisual {
  const n = normalize(name);
  const found = FOOD_KEYWORDS.find((k) => n.includes(k.match));
  return found ?? DEFAULT_FOOD_VISUAL;
}
