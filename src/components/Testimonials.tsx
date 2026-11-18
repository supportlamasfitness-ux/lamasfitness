import { ScrollReveal } from "@/components/ScrollReveal";
import { getTestimonials, type Testimonial as T } from "@/lib/testimonials";

const avatarGradients = ["from-red-500 to-orange-500", "from-orange-400 to-rose-500", "from-red-600 to-yellow-300", "from-rose-500 to-red-700"];

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

// Carrusel continuo (se pausa al pasar el mouse). Si todavía no hay testimonios reales aprobados, la sección no se muestra.
export default async function Testimonials() {
  const real: T[] = await getTestimonials();
  if (real.length === 0) return null;
  const items = real.length < 6 ? Array.from({ length: Math.ceil(6 / real.length) }, () => real).flat() : real;
  const loop = [...items, ...items];
  const seconds = Math.max(30, items.length * 7);

  return (
    <section id="testimonios" className="overflow-hidden bg-white">
      <div className="mx-auto max-w-6xl px-6 pt-24">
        <ScrollReveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow text-red-600">Testimonios</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">Lo que dicen nuestros alumnos</h2>
          </div>
        </ScrollReveal>
      </div>
      <div className="group relative mt-14 pb-24 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="testi-track flex w-max gap-6 px-3" style={{ animationDuration: `${seconds}s` }}>
          {loop.map((t, i) => (
            <figure key={i} className="w-[320px] shrink-0 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 sm:w-[380px]">
              {t.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={t.image} alt={`Resultado de ${t.name}`} loading="lazy" className="h-56 w-full object-cover" />
              )}
              <div className="p-6">
                <p className="text-sm text-amber-500" aria-label={`${t.rating} de 5 estrellas`}>{"★".repeat(t.rating)}</p>
                {t.quote && <blockquote className="mt-2 text-neutral-700">“{t.quote}”</blockquote>}
                <figcaption className="mt-5 flex items-center gap-3">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white ${avatarGradients[i % avatarGradients.length]}`}>{initials(t.name)}</span>
                  <span className="text-sm font-semibold text-neutral-900">{t.name}</span>
                </figcaption>
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
