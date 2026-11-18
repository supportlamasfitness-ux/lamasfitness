"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
  const [estatura, setEstatura] = useState("");
  const [talla, setTalla] = useState("");
  const [peso, setPeso] = useState("");
  const [edad, setEdad] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [lastCreated, setLastCreated] = useState<{ id: string; email: string; tempPassword: string; warning: string | null } | null>(null);

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

  const [resetInfo, setResetInfo] = useState<{ email: string; tempPassword: string } | null>(null);

  async function resetPassword(c: Client) {
    if (!confirm(`¿Generar una contraseña temporal para ${c.full_name}? La actual dejará de funcionar.`)) return;
    const res = await fetch(`/api/admin/clients/${c.id}/reset-password`, { method: "POST" });
    const data = await res.json();
    if (!res.ok) return setError(data.error || "No se pudo restablecer");
    setResetInfo({ email: data.email, tempPassword: data.tempPassword });
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setLastCreated(null);

    const res = await fetch("/api/admin/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ full_name: fullName, email, phone, estatura_cm: estatura, talla_ropa: talla, peso, edad }),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Error al crear el cliente");
      return;
    }

    setLastCreated({ id: data.client.id, email: data.client.email, tempPassword: data.tempPassword, warning: data.planWarning });
    setFullName("");
    setEmail("");
    setPhone("");
    setEstatura(""); setTalla(""); setPeso(""); setEdad("");
    setShowForm(false);
    loadClients();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Clientes</h1>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="rounded-full bg-red-500 px-5 py-2 text-sm font-semibold text-white hover:bg-red-400"
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
          {lastCreated.warning && <p className="mt-2 text-xs text-red-400">{lastCreated.warning}</p>}
          <Link href={`/admin/clientes/${lastCreated.id}`} className="mt-3 inline-block rounded-full bg-red-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-red-500">
            Asignar su plan ahora
          </Link>
        </div>
      )}

      {resetInfo && (
        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/5 p-5 text-sm">
          <p className="font-semibold text-emerald-400">Contraseña temporal — compártela por WhatsApp:</p>
          <p className="mt-2 text-neutral-300">Email: <span className="font-mono text-neutral-100">{resetInfo.email}</span></p>
          <p className="text-neutral-300">Contraseña: <span className="font-mono text-neutral-100">{resetInfo.tempPassword}</span></p>
          <p className="mt-2 text-xs text-neutral-500">No se vuelve a mostrar. El cliente puede cambiarla después con "¿Olvidaste tu contraseña?".</p>
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
                className="rounded-lg border border-white/10 bg-neutral-950 px-4 py-2 text-sm outline-none focus:border-red-500"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-neutral-300">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-lg border border-white/10 bg-neutral-950 px-4 py-2 text-sm outline-none focus:border-red-500"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-neutral-300">Teléfono (opcional)</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="rounded-lg border border-white/10 bg-neutral-950 px-4 py-2 text-sm outline-none focus:border-red-500"
              />
            </div>
            {([
              ["Estatura (cm)", estatura, setEstatura],
              ["Talla de ropa (S, M, L…)", talla, setTalla],
              ["Peso inicial (kg)", peso, setPeso],
              ["Edad", edad, setEdad],
            ] as const).map(([label, val, set]) => (
              <div key={label} className="flex flex-col gap-1">
                <label className="text-sm text-neutral-300">{label}</label>
                <input
                  value={val}
                  onChange={(e) => set(e.target.value)}
                  className="rounded-lg border border-white/10 bg-neutral-950 px-4 py-2 text-sm outline-none focus:border-red-500"
                />
              </div>
            ))}
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={saving}
            className="w-fit rounded-full bg-red-500 px-6 py-2 text-sm font-semibold text-white hover:bg-red-400 disabled:opacity-60"
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
                <th className="px-5 py-3"></th>
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
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => resetPassword(c)} className="mr-2 rounded-full border border-white/15 px-3 py-1.5 text-xs text-neutral-300 hover:border-red-500 hover:text-red-500">
                      Restablecer contraseña
                    </button>
                    <Link href={`/admin/clientes/${c.id}`} className="rounded-full bg-red-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-red-500">
                      Asignar plan
                    </Link>
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
