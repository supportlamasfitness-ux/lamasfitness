import { createClient } from "@/lib/supabase/client";

export type CatalogItem = {
  id: string;
  kind: "alimento" | "suplemento";
  name: string;
  category: string;
  image: string;
  url: string;
  kcal: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  dose: string;
  when_text: string;
  purpose: string;
};

export const newItem = (kind: CatalogItem["kind"]): Omit<CatalogItem, "id"> => ({
  kind, name: "", category: "", image: "", url: "", kcal: null, protein: null, carbs: null, fat: null, dose: "", when_text: "", purpose: "",
});

export async function loadCatalog(kind?: CatalogItem["kind"]): Promise<{ items: CatalogItem[]; missing: boolean }> {
  let q = createClient().from("catalog_items").select("*").order("category").order("name");
  if (kind) q = q.eq("kind", kind);
  const { data, error } = await q;
  return { items: (data as CatalogItem[]) || [], missing: !!error };
}

// Productos de la Lista de Mercado de Lamas Fitness (fotos ya incluidas en /public/images/foods).
export const SEED_FOODS: { name: string; category: string; file: string }[] = [
  { name: "Tilapia", category: "Proteínas", file: "tilapia" },
  { name: "Bacalao (COD)", category: "Proteínas", file: "bacalao" },
  { name: "Mahi Mahi", category: "Proteínas", file: "mahi-mahi" },
  { name: "Salmón", category: "Proteínas", file: "salmon" },
  { name: "Camarón", category: "Proteínas", file: "camaron" },
  { name: "Atún", category: "Proteínas", file: "atun" },
  { name: "Pavo molido", category: "Proteínas", file: "pavo-molido" },
  { name: "Carne molida de res", category: "Proteínas", file: "carne-molida" },
  { name: "Pechuga de pollo", category: "Proteínas", file: "pechuga" },
  { name: "Muslos de pollo", category: "Proteínas", file: "muslos" },
  { name: "Huevos", category: "Proteínas", file: "huevos" },
  { name: "Yogur griego", category: "Proteínas", file: "yogur" },
  { name: "Papas", category: "Carbohidratos", file: "papas" },
  { name: "Avena", category: "Carbohidratos", file: "avena" },
  { name: "Crema de trigo", category: "Carbohidratos", file: "crema-trigo" },
  { name: "Crema de arroz", category: "Carbohidratos", file: "crema-arroz" },
  { name: "Galletas de arroz", category: "Carbohidratos", file: "galletas-arroz" },
  { name: "Camote (batata)", category: "Carbohidratos", file: "camote" },
  { name: "Pan integral", category: "Carbohidratos", file: "pan" },
  { name: "Pasta integral", category: "Carbohidratos", file: "pasta" },
  { name: "Vegetales mixtos", category: "Vegetales", file: "vegetales" },
  { name: "Leche de almendra", category: "Extras", file: "leche-almendra" },
  { name: "Barras de proteína", category: "Extras", file: "barras" },
  { name: "Mix de nueces", category: "Extras", file: "nueces" },
  { name: "Mantequilla de maní (PB2)", category: "Extras", file: "pb2" },
];
