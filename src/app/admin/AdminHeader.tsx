"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ChangePassword from "@/components/ChangePassword";

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
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 sm:px-6 sm:py-4">
        <div>
          <p className="text-sm font-bold tracking-tight">Panel de administración</p>
          <p className="text-xs text-neutral-500">Lamas Fitness — Personal Trainer</p>
        </div>
        <div className="flex items-center gap-3">
          <ChangePassword />
          <button
            onClick={handleLogout}
            className="rounded-full border border-white/15 px-4 py-1.5 text-sm font-medium text-neutral-300 transition-colors hover:border-red-500 hover:text-red-500"
          >
            Salir
          </button>
        </div>
      </div>
      <nav className="mx-auto flex max-w-5xl gap-5 overflow-x-auto whitespace-nowrap px-4 pb-3 text-sm sm:px-6">
        {[
          ["/admin/clientes", "Clientes"],
          ["/admin/catalogo", "Catálogo"],
          ["/admin/ejercicios", "Ejercicios"],
          ["/admin/testimonios", "Testimonios"],
          ["/admin/contactos", "Contactos"],
        ].map(([href, label]) => (
          <a key={href} href={href} className="text-neutral-300 hover:text-red-500">{label}</a>
        ))}
      </nav>
    </header>
  );
}
