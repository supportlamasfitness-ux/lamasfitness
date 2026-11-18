import Image from "next/image";
import { ScrollReveal } from "@/components/ScrollReveal";

const highlights = [
  { label: "Años de experiencia", value: "5" },
  { label: "Alumnos entrenados", value: "37+" },
  { label: "Entrenador certificado y nutricionista", value: "NASM" },
];

export default function About() {
  return (
    <section id="sobre-mi" className="bg-white">
      <div className="mx-auto grid max-w-6xl gap-14 px-6 py-24 md:grid-cols-2 md:items-center">
        <ScrollReveal from="left">
          <div className="relative aspect-square w-full overflow-hidden rounded-3xl shadow-2xl shadow-neutral-900/10 md:aspect-[4/5]">
            <Image
              src="/images/alberto-hero.jpg"
              alt="Lamas Fitness — Personal Trainer"
              fill
              sizes="(min-width: 768px) 40vw, 90vw"
              className="object-cover"
              priority
            />
          </div>
        </ScrollReveal>
        <ScrollReveal from="right">
          <div className="flex flex-col gap-6">
            <span className="eyebrow text-red-600">Sobre nosotros</span>
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">
              Disciplina hoy, resultados mañana
            </h2>
            <p className="text-neutral-600">
              En Lamas Fitness somos entrenadores personales certificados por NASM y nutricionistas, con 5 años de experiencia ayudando a
              más de 37 personas a mejorar su condición física con coaching online.
              Nuestro enfoque combina técnica, constancia y un acompañamiento
              cercano para que cada semana te acerque a tu objetivo, sin
              importar tu punto de partida.
            </p>
            <p className="text-neutral-600">
              Trabajamos contigo de forma individual o en grupos reducidos,
              adaptando cada plan a tu nivel, tus tiempos y tus metas.
            </p>
            <div className="mt-2 grid grid-cols-3 gap-4 border-t border-neutral-200 pt-6">
              {highlights.map((item, i) => (
                <ScrollReveal key={item.label} delay={i * 140} from="scale">
                  <div className="text-center">
                    <p className="text-3xl font-extrabold text-red-600">
                      {item.value}
                    </p>
                    <p className="mt-1 text-xs font-medium text-neutral-500">
                      {item.label}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
