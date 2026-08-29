"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Client = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  created_at: string;
};

export default function ClientesPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [lastCreated, setLastCreated] = useState<{ email: string; tempPassword: string } | null>(null);

  async function loadClients() {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, email, phone, created_at")
      .eq("role", "client")
      .order("created_at", { ascending: false });
    setClients(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadClients();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setLastCreated(null);

    const res = await fetch("/api/admin/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ full_name: fullName, email, phone }),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Error al crear el cliente");
      return;
    }

    setLastCreated({ email: data.client.email, tempPassword: data.tempPassword });
    setFullName("");
    setEmail("");
    setPhone("");
    setShowForm(false);
    loadClients();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Clientes</h1>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="rounded-full bg-amber-400 px-5 py-2 text-sm font-semibold text-neutral-950 hover:bg-amber-300"
        >
          {showForm ? "Cancelar" : "+ Nuevo cliente"}
        </button>
      </div>

      {lastCreated && (
        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/5 p-5 text-sm">
          <p className="font-semibold text-emerald-400">
            Cliente creado — compartile estos datos por WhatsApp:
          </p>
          <p className="mt-2 text-neutral-300">
            Email: <span className="font-mono text-neutral-100">{lastCreated.email}</span>
          </p>
          <p className="text-neutral-300">
            Contraseña temporal:{" "}
            <span className="font-mono text-neutral-100">{lastCreated.tempPassword}</span>
          </p>
          <p className="mt-2 text-xs text-neutral-500">
            Esta contraseña no se vuelve a mostrar — anotala ahora.
          </p>
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-neutral-900 p-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-neutral-300">Nombre completo</label>
              <input
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="rounded-lg border border-white/10 bg-neutral-950 px-4 py-2 text-sm outline-none focus:border-amber-400"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-neutral-300">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-lg border border-white/10 bg-neutral-950 px-4 py-2 text-sm outline-none focus:border-amber-400"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-neutral-300">Teléfono (opcional)</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="rounded-lg border border-white/10 bg-neutral-950 px-4 py-2 text-sm outline-none focus:border-amber-400"
              />
            </div>
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={saving}
            className="w-fit rounded-full bg-amber-400 px-6 py-2 text-sm font-semibold text-neutral-950 hover:bg-amber-300 disabled:opacity-60"
          >
            {saving ? "Creando..." : "Crear cliente"}
          </button>
        </form>
      )}

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-neutral-900">
        {loading ? (
          <p className="p-6 text-sm text-neutral-500">Cargando...</p>
        ) : clients.length === 0 ? (
          <p className="p-6 text-sm text-neutral-500">Todavía no hay clientes.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 text-xs uppercase tracking-wide text-neutral-500">
              <tr>
                <th className="px-5 py-3">Nombre</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Teléfono</th>
                <th className="px-5 py-3">Alta</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id} className="border-b border-white/5 last:border-0">
                  <td className="px-5 py-3 font-medium">{c.full_name}</td>
                  <td className="px-5 py-3 text-neutral-300">{c.email}</td>
                  <td className="px-5 py-3 text-neutral-400">{c.phone || "—"}</td>
                  <td className="px-5 py-3 text-neutral-500">
                    {new Date(c.created_at).toLocaleDateString("es")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
