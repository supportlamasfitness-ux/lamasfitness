import Image from "next/image";

const highlights = [
  { label: "Años de experiencia", value: "X+" },
  { label: "Alumnos entrenados", value: "XX+" },
  { label: "Certificaciones", value: "X" },
];

export default function About() {
  return (
    <section id="sobre-mi" className="border-b border-white/10 bg-neutral-950">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 md:aspect-[4/5]">
          <Image
            src="/images/alberto-hero.jpg"
            alt="Alberto Lamas, entrenador personal"
            fill
            sizes="(min-width: 768px) 40vw, 90vw"
            className="object-cover"
            priority
          />
        </div>
        <div className="flex flex-col gap-6">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Sobre mí
          </h2>
          <p className="text-neutral-300">
            Soy entrenador personal certificado y llevo años ayudando a
            personas a mejorar su condición física en clases presenciales.
            Mi enfoque combina técnica, constancia y un acompañamiento
            cercano para que cada sesión te acerque a tu objetivo, sin
            importar tu punto de partida.
          </p>
          <p className="text-neutral-300">
            Trabajo contigo de forma individual o en grupos reducidos,
            adaptando cada clase a tu nivel, tus tiempos y tus metas.
          </p>
          <div className="mt-2 grid grid-cols-3 gap-4">
            {highlights.map((item) => (
              <div key={item.label} className="text-center">
                <p className="text-2xl font-bold text-amber-400">
                  {item.value}
                </p>
                <p className="text-xs text-neutral-400">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
