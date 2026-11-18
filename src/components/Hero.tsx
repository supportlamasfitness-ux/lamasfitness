import Image from "next/image";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative isolate flex min-h-[620px] items-center overflow-hidden bg-neutral-950 md:min-h-[780px]"
    >
      {/* Portada: foto principal de fondo, translúcida y fundida con el negro */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-y-0 right-0 w-full overflow-hidden md:w-[68%]">
          <Image
            src="/images/lamas-hero.jpg"
            alt="Lamas Fitness — Personal Trainer"
            fill
            priority
            sizes="(min-width: 768px) 68vw, 100vw"
            className="hero-cover object-cover object-[46%_0%] opacity-50 md:object-[50%_0%] md:opacity-80"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/85 to-transparent md:via-neutral-950/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/70" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,_rgba(229,9,20,0.25),_transparent_55%)]" />
        <div className="dot-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_60%_60%_at_20%_0%,black,transparent)]" />
      </div>
      <div className="relative mx-auto w-full max-w-6xl px-6 py-24 md:py-32">
      <div className="flex max-w-xl flex-col items-start gap-7">
        <ScrollReveal delay={100}>
          <span className="inline-flex max-w-full items-center whitespace-nowrap rounded-full border border-red-500/40 bg-red-500/10 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-red-500 sm:px-4 sm:text-xs sm:tracking-widest">
            Coaching y asesoría online
            <span className="hidden sm:inline">&nbsp;· Desde cualquier lugar</span>
          </span>
        </ScrollReveal>
        <ScrollReveal delay={220}>
          <h1 className="max-w-3xl text-5xl font-extrabold leading-[1.05] tracking-tight text-white md:text-6xl">
            Transforma tu cuerpo con un plan{" "}
            <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
              hecho a tu medida
            </span>
          </h1>
        </ScrollReveal>
        <ScrollReveal delay={380}>
          <p className="max-w-xl text-lg leading-relaxed text-neutral-400">
            En Lamas Fitness te acompañamos online con
            videollamadas, plan personalizado, seguimiento cercano y
            motivación real para que llegues a tu objetivo.
          </p>
        </ScrollReveal>
        <ScrollReveal delay={520}>
          <div className="flex flex-col gap-4 sm:flex-row">
            <a
              href="#servicios"
              className="rounded-full bg-red-500 px-8 py-3.5 text-center font-semibold text-white shadow-[0_8px_30px_-8px_rgba(229,9,20,0.6)] transition-all hover:-translate-y-0.5 hover:bg-red-400"
            >
              Ver planes
            </a>
            <a
              href="#contacto"
              className="rounded-full border border-white/15 px-8 py-3.5 text-center font-semibold text-neutral-100 transition-colors hover:border-red-500/60 hover:text-red-500"
            >
              Escríbeme para comenzar
            </a>
          </div>
        </ScrollReveal>
      </div>
      </div>
    </section>
  );
}
