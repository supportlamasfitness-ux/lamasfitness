"use client";

import { useState } from "react";
import { ScrollReveal } from "@/components/ScrollReveal";

// Precios reales del tarifario de Alberto (Tarifario de plan de entrenamiento.xlsx):
// sesiones de 1h, membresía de 3 o 6 meses, facturado mensual. El plan de 6 meses
// sale más barato por mes que el de 3 — se muestra como ahorro para que se note.
type Duration = 3 | 6;

const PLANS: Record<Duration, { sessions: number; pricePerMonth: number }[]> = {
  3: [
    { sessions: 2, pricePerMonth: 360 },
    { sessions: 3, pricePerMonth: 540 },
  ],
  6: [
    { sessions: 2, pricePerMonth: 320 },
    { sessions: 3, pricePerMonth: 500 },
  ],
};

function pricePerSession(pricePerMonth: number, sessions: number) {
  return Math.round(pricePerMonth / (sessions * 4));
}

export default function Services() {
  const [duration, setDuration] = useState<Duration>(3);

  return (
    <section id="servicios" className="bg-neutral-950">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <ScrollReveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow text-amber-400">Planes</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-4xl">
              Clases presenciales
            </h2>
            <p className="mt-4 text-neutral-400">
              Elige cuántas sesiones por semana necesitás y el tiempo de
              membresía. Todas las clases son presenciales, de 1 hora, con
              seguimiento personalizado.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={120} from="scale">
          <div className="mx-auto mt-10 flex w-fit gap-1 rounded-full border border-white/10 bg-white/5 p-1">
            {([3, 6] as Duration[]).map((d) => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className={`rounded-full px-6 py-2 text-sm font-semibold transition-colors ${
                  duration === d
                    ? "bg-amber-400 text-neutral-950"
                    : "text-neutral-400 hover:text-neutral-100"
                }`}
              >
                Membresía {d} meses
              </button>
            ))}
          </div>
        </ScrollReveal>

        <div className="mx-auto mt-10 grid max-w-3xl gap-8 sm:grid-cols-2">
          {PLANS[duration].map((plan, i) => {
            const savings =
              duration === 6
                ? PLANS[3][i].pricePerMonth - plan.pricePerMonth
                : 0;
            const highlighted = plan.sessions === 3;
            return (
              <ScrollReveal key={plan.sessions} delay={i * 100} from="scale">
                <div
                  className={`relative flex flex-col rounded-2xl border p-8 transition-transform hover:-translate-y-1 ${
                    highlighted
                      ? "border-amber-400/50 bg-gradient-to-b from-neutral-900 to-neutral-900/60 shadow-2xl shadow-amber-400/10"
                      : "border-white/10 bg-white/[0.03]"
                  }`}
                >
                  {highlighted && (
                    <span className="mb-4 w-fit rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold text-neutral-950">
                      Más elegido
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-white">
                    {plan.sessions} sesiones / semana
                  </h3>
                  <p className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white">
                      ${plan.pricePerMonth}
                    </span>
                    <span className="text-sm text-neutral-400">/ mes</span>
                  </p>
                  <p className="mt-1 text-xs text-neutral-500">
                    ≈ ${pricePerSession(plan.pricePerMonth, plan.sessions)} por
                    sesión · compromiso de {duration} meses
                  </p>
                  {savings > 0 && (
                    <span className="mt-2 w-fit rounded-full bg-emerald-400/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                      Ahorra ${savings}/mes vs. plan de 3 meses
                    </span>
                  )}
                  <ul className="mt-6 flex flex-1 flex-col gap-3 text-sm text-neutral-300">
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 text-amber-400">✓</span>
                      <span>
                        {plan.sessions} sesiones presenciales de 1 hora por
                        semana
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 text-amber-400">✓</span>
                      <span>Plan de entrenamiento personalizado</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 text-amber-400">✓</span>
                      <span>Seguimiento de progreso en tu portal</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 text-amber-400">✓</span>
                      <span>Contacto directo por WhatsApp</span>
                    </li>
                  </ul>
                  <a
                    href="#contacto"
                    className={`mt-8 rounded-full px-6 py-3 text-center text-sm font-semibold transition-colors ${
                      highlighted
                        ? "bg-amber-400 text-neutral-950 hover:bg-amber-300"
                        : "border border-white/20 text-neutral-100 hover:border-amber-400 hover:text-amber-400"
                    }`}
                  >
                    Quiero este plan
                  </a>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal delay={200}>
          <p className="mx-auto mt-8 max-w-md text-center text-sm text-neutral-500">
            ¿Querés probar una clase suelta antes de elegir plan?{" "}
            <a href="#contacto" className="text-amber-400 hover:underline">
              Escríbeme por WhatsApp
            </a>
            .
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
