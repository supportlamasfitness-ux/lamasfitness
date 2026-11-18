"use client";

import { useState } from "react";
import { ScrollReveal } from "@/components/ScrollReveal";

const WHATSAPP_NUMBER = "15123510364";
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hola, quiero más información sobre el coaching online."
);

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setStatus(res.ok ? "done" : "error");
  }

  if (status === "done") {
    return (
      <p className="text-sm text-emerald-400">
        ✓ Listo, revisá tu correo — te vas a mantener al tanto de tips y promociones.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-2 sm:flex-row">
      <input
        type="email"
        required
        placeholder="tu@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-neutral-100 outline-none placeholder:text-neutral-500 focus:border-red-500"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-neutral-100 transition-colors hover:border-red-500 hover:text-red-500 disabled:opacity-60"
      >
        {status === "loading" ? "..." : "Recibir tips"}
      </button>
      {status === "error" && (
        <p className="text-xs text-red-400 sm:absolute sm:mt-9">Algo falló, probá de nuevo.</p>
      )}
    </form>
  );
}

export default function Contact() {
  return (
    <section id="contacto" className="relative overflow-hidden bg-neutral-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(229,9,20,0.14),_transparent_55%)]" />
      <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 py-28 text-center">
        <ScrollReveal>
          <span className="eyebrow text-red-500">Contacto</span>
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <h2 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">
            Empieza hoy tu transformación
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={200}>
          <p className="max-w-lg text-lg text-neutral-400">
            Cuéntame tus objetivos y te responderé con disponibilidad de
            horarios y el plan que mejor se adapte a ti. Sin compromiso.
          </p>
        </ScrollReveal>
        <ScrollReveal delay={320}>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex items-center gap-2 rounded-full bg-red-500 px-9 py-4 font-semibold text-white shadow-[0_8px_30px_-8px_rgba(229,9,20,0.6)] transition-all hover:-translate-y-0.5 hover:bg-red-400"
          >
            Escríbeme por WhatsApp
          </a>
        </ScrollReveal>
        <ScrollReveal delay={420}>
          <div className="mt-4 flex flex-col items-center gap-1 text-sm text-neutral-500">
            <span>💻 Coaching online · Atiendo desde Austin, TX</span>
            <span>📞 +1 (512) 351-0364</span>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={520}>
          <div className="mt-10 flex w-full flex-col items-center gap-3 border-t border-white/10 pt-10">
            <p className="text-sm text-neutral-400">
              ¿Todavía no querés reservar? Recibí tips de entrenamiento y nutrición por email.
            </p>
            <NewsletterForm />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
