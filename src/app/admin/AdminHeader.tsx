"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminHeader() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="border-b border-white/10 bg-neutral-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <div>
          <p className="text-sm font-bold tracking-tight">Panel de administración</p>
          <p className="text-xs text-neutral-500">Lamas Fitness — Personal Trainer</p>
        </div>
        <div className="flex items-center gap-3">
          <a href="/admin/clientes" className="text-sm text-neutral-300 hover:text-red-500">
            Clientes
          </a>
          <a href="/admin/catalogo" className="text-sm text-neutral-300 hover:text-red-500">
            Catálogo
          </a>
          <a href="/admin/ejercicios" className="text-sm text-neutral-300 hover:text-red-500">
            Ejercicios
          </a>
          <a href="/admin/testimonios" className="text-sm text-neutral-300 hover:text-red-500">
            Testimonios
          </a>
          <a href="/admin/contactos" className="text-sm text-neutral-300 hover:text-red-500">
            Contactos
          </a>
          <button
            onClick={handleLogout}
            className="rounded-full border border-white/15 px-4 py-1.5 text-sm font-medium text-neutral-300 transition-colors hover:border-red-500 hover:text-red-500"
          >
            Salir
          </button>
        </div>
      </div>
    </header>
  );
}
