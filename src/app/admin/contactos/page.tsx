"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Row = { email: string; full_name: string | null; kind: "Cliente" | "Suscriptor"; created_at: string };

export default function ContactosPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    Promise.all([
      supabase.from("profiles").select("email, full_name, created_at").eq("role", "client"),
      supabase.from("subscribers").select("email, full_name, created_at"),
    ]).then(([clients, subs]) => {
      const clientRows: Row[] = (clients.data || []).map((c) => ({ ...c, kind: "Cliente" as const }));
      const subEmails = new Set(clientRows.map((c) => c.email));
      const subRows: Row[] = (subs.data || [])
        .filter((s) => !subEmails.has(s.email))
        .map((s) => ({ ...s, kind: "Suscriptor" as const }));
      setRows(
        [...clientRows, ...subRows].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      );
      setLoading(false);
    });
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold">Contactos</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Clientes registrados + suscriptores del formulario de la web. Esta
          misma lista se sincroniza a tu Audience de Resend para mandar
          campañas de email marketing desde ahí.
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-neutral-900">
        {loading ? (
          <p className="p-6 text-sm text-neutral-500">Cargando...</p>
        ) : rows.length === 0 ? (
          <p className="p-6 text-sm text-neutral-500">Todavía no hay contactos.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 text-xs uppercase tracking-wide text-neutral-500">
              <tr>
                <th className="px-5 py-3">Nombre</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Tipo</th>
                <th className="px-5 py-3">Alta</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.email} className="border-b border-white/5 last:border-0">
                  <td className="px-5 py-3 font-medium">{r.full_name || "—"}</td>
                  <td className="px-5 py-3 text-neutral-300">{r.email}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        r.kind === "Cliente"
                          ? "bg-red-500/10 text-red-500"
                          : "bg-emerald-400/10 text-emerald-400"
                      }`}
                    >
                      {r.kind}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-neutral-500">
                    {new Date(r.created_at).toLocaleDateString("es")}
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
