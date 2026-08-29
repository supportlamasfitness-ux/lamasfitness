import { ScrollReveal } from "@/components/ScrollReveal";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-neutral-950"
    >
      <div className="dot-grid absolute inset-0 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.18),_transparent_55%)]" />
      <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-7 px-6 py-28 md:py-36">
        <ScrollReveal delay={100}>
          <span className="inline-flex max-w-full items-center whitespace-nowrap rounded-full border border-amber-400/40 bg-amber-400/10 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-amber-400 sm:px-4 sm:text-xs sm:tracking-widest">
            Entrenamiento personal presencial
            <span className="hidden sm:inline">&nbsp;· Austin, TX</span>
          </span>
        </ScrollReveal>
        <ScrollReveal delay={220}>
          <h1 className="max-w-3xl text-5xl font-extrabold leading-[1.05] tracking-tight text-white md:text-7xl">
            Transforma tu cuerpo con un plan{" "}
            <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
              hecho a tu medida
            </span>
          </h1>
        </ScrollReveal>
        <ScrollReveal delay={380}>
          <p className="max-w-xl text-lg leading-relaxed text-neutral-400">
            Soy Alberto Lamas, entrenador personal en Austin. Te acompaño en
            cada clase presencial con seguimiento cercano, técnica correcta y
            motivación real para que llegues a tu objetivo.
          </p>
        </ScrollReveal>
        <ScrollReveal delay={520}>
          <div className="flex flex-col gap-4 sm:flex-row">
            <a
              href="#servicios"
              className="rounded-full bg-amber-400 px-8 py-3.5 text-center font-semibold text-neutral-950 shadow-[0_8px_30px_-8px_rgba(251,191,36,0.6)] transition-all hover:-translate-y-0.5 hover:bg-amber-300"
            >
              Ver planes de clases
            </a>
            <a
              href="#contacto"
              className="rounded-full border border-white/15 px-8 py-3.5 text-center font-semibold text-neutral-100 transition-colors hover:border-amber-400/60 hover:text-amber-400"
            >
              Agenda una clase de prueba
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
