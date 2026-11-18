import { ScrollReveal } from "@/components/ScrollReveal";

// Planes de coaching online de Lamas Fitness (precios del flyer oficial).
type Plan = {
  name: string;
  tag?: string;
  price: number;
  unit: string;
  note?: string;
  features: string[];
  highlighted?: boolean;
};

const PLANS: Plan[] = [
  {
    name: "Plan Básico",
    price: 99,
    unit: "/ mes",
    features: [
      "Rutina de entrenamiento personalizada",
      "Acceso por app",
      "Actualización mensual",
    ],
  },
  {
    name: "Plan Completo",
    tag: "Más popular",
    price: 179,
    unit: "/ mes",
    highlighted: true,
    features: [
      "Entrenamiento personalizado",
      "Plan de nutrición personalizado",
      "Seguimiento semanal",
      "Revisión de progreso (peso, medidas y fotos)",
      "Ajustes continuos",
    ],
  },
  {
    name: "Plan Premium 1 a 1",
    price: 299,
    unit: "/ mes",
    features: [
      "Entrenamiento y nutrición personalizados",
      "Seguimiento directo y frecuente",
      "Videollamada 1 vez al mes",
      "Ajustes semanales",
      "Máxima atención y acompañamiento",
    ],
  },
  {
    name: "Plan de 3 meses",
    tag: "Mejor valor",
    price: 450,
    unit: "total",
    note: "Equivale a $150 / mes · paquete de compromiso",
    highlighted: true,
    features: [
      "3 meses de coaching continuo",
      "Ahorro frente al pago mensual",
      "Seguimiento y ajustes durante todo el programa",
    ],
  },
];

export default function Services() {
  return (
    <section id="servicios" className="bg-neutral-950">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <ScrollReveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow text-red-500">Planes</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-4xl">
              Coaching online
            </h2>
            <p className="mt-4 text-neutral-400">
              Elige el plan que mejor se adapte a tus objetivos. Entrenas desde
              donde estés, con programa personalizado y seguimiento directo.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((plan, i) => (
            <ScrollReveal key={plan.name} delay={i * 100} from="scale">
              <div
                className={`relative flex h-full flex-col rounded-2xl border p-7 transition-transform hover:-translate-y-1 ${
                  plan.highlighted
                    ? "border-red-500/60 bg-gradient-to-b from-neutral-900 to-neutral-900/60 shadow-2xl shadow-red-600/10"
                    : "border-white/10 bg-white/[0.03]"
                }`}
              >
                {plan.tag ? (
                  <span className="mb-4 w-fit rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
                    {plan.tag}
                  </span>
                ) : (
                  <span className="mb-4 h-[26px]" />
                )}
                <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                <p className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">
                    ${plan.price}
                  </span>
                  <span className="text-sm text-neutral-400">{plan.unit}</span>
                </p>
                {plan.note && (
                  <p className="mt-1 text-xs text-neutral-500">{plan.note}</p>
                )}
                <ul className="mt-6 flex flex-1 flex-col gap-3 text-sm text-neutral-300">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="mt-0.5 text-red-500">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#contacto"
                  className={`mt-8 rounded-full px-6 py-3 text-center text-sm font-semibold transition-colors ${
                    plan.highlighted
                      ? "bg-red-600 text-white hover:bg-red-500"
                      : "border border-white/20 text-neutral-100 hover:border-red-500 hover:text-red-500"
                  }`}
                >
                  Quiero este plan
                </a>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={200}>
          <p className="mx-auto mt-8 max-w-md text-center text-sm text-neutral-500">
            ¿Dudas sobre qué plan elegir?{" "}
            <a href="#contacto" className="text-red-500 hover:underline">
              Escríbeme por WhatsApp
            </a>
            .
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
