import Image from "next/image";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-neutral-950"
    >
      <div className="dot-grid absolute inset-0 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(229,9,20,0.18),_transparent_55%)]" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
      <div className="flex flex-col items-start gap-7">
        <ScrollReveal delay={100}>
          <span className="inline-flex max-w-full items-center whitespace-nowrap rounded-full border border-red-500/40 bg-red-500/10 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-red-500 sm:px-4 sm:text-xs sm:tracking-widest">
            Coaching y asesoría online
            <span className="hidden sm:inline">&nbsp;· Desde cualquier lugar</span>
          </span>
        </ScrollReveal>
        <ScrollReveal delay={220}>
          <h1 className="max-w-3xl text-5xl font-extrabold leading-[1.05] tracking-tight text-white md:text-5xl lg:text-6xl">
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
        <ScrollReveal from="right" delay={300}>
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-red-500/30 shadow-2xl shadow-red-600/20">
            <Image
              src="/images/alberto-hero.jpg"
              alt="Lamas Fitness — Personal Trainer"
              fill
              priority
              sizes="(min-width: 768px) 45vw, 90vw"
              className="object-cover object-[50%_20%]"
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
