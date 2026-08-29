"use client";

import { createBrowserClient } from "@supabase/ssr";

// Cliente de Supabase para Client Components — usa las claves públicas
// (seguras de exponer al navegador, protegidas por RLS del lado de la BD).
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
