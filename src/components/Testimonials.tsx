import { ScrollReveal } from "@/components/ScrollReveal";

const testimonials = [
  {
    name: "Nombre Apellido",
    quote:
      "En pocos meses noté un cambio real, tanto en fuerza como en confianza. Las clases están súper bien planteadas.",
  },
  {
    name: "Nombre Apellido",
    quote:
      "El seguimiento personalizado marca la diferencia. Siempre sabe adaptar la sesión a cómo llego ese día.",
  },
  {
    name: "Nombre Apellido",
    quote:
      "Recomendado 100%. Ambiente cercano y motivador, se nota la experiencia y el trato personalizado.",
  },
];

const avatarGradients = [
  "from-red-500 to-orange-500",
  "from-orange-400 to-rose-500",
  "from-red-600 to-yellow-300",
];

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Testimonials() {
  return (
    <section id="testimonios" className="bg-white">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <ScrollReveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow text-red-600">Testimonios</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">
              Lo que dicen mis alumnos
            </h2>
          </div>
        </ScrollReveal>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <ScrollReveal key={index} delay={index * 100} from="scale">
              <figure className="flex h-full flex-col justify-between rounded-2xl border border-neutral-200 bg-neutral-50 p-6 shadow-sm shadow-neutral-900/5">
                <blockquote className="text-neutral-700">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white ${avatarGradients[index % avatarGradients.length]}`}
                  >
                    {initials(testimonial.name)}
                  </div>
                  <span className="text-sm font-semibold text-neutral-900">
                    {testimonial.name}
                  </span>
                </figcaption>
              </figure>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
