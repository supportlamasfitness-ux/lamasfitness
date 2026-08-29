import { ScrollReveal } from "@/components/ScrollReveal";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-white/10"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.15),_transparent_60%)]" />
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-6 py-24 md:py-32">
        <ScrollReveal delay={100}>
          <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-amber-400">
            Entrenamiento personal presencial
          </span>
        </ScrollReveal>
        <ScrollReveal delay={220}>
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
            Transforma tu cuerpo con un plan{" "}
            <span className="text-amber-400">hecho a tu medida</span>
          </h1>
        </ScrollReveal>
        <ScrollReveal delay={380}>
          <p className="max-w-xl text-lg text-neutral-300">
            Soy Alberto Lamas, entrenador personal en Austin. Te acompaño en
            cada clase presencial con seguimiento cercano, técnica correcta y
            motivación real para que llegues a tu objetivo.
          </p>
        </ScrollReveal>
        <ScrollReveal delay={520}>
          <div className="flex flex-col gap-4 sm:flex-row">
            <a
              href="#servicios"
              className="rounded-full bg-amber-400 px-8 py-3 text-center font-semibold text-neutral-950 transition-colors hover:bg-amber-300"
            >
              Ver planes de clases
            </a>
            <a
              href="#contacto"
              className="rounded-full border border-white/20 px-8 py-3 text-center font-semibold text-neutral-100 transition-colors hover:border-amber-400 hover:text-amber-400"
            >
              Agenda una clase de prueba
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
