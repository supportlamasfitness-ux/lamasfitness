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

export default function Testimonials() {
  return (
    <section id="testimonios" className="border-b border-white/10 bg-neutral-950">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Lo que dicen mis alumnos
          </h2>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <figure
              key={index}
              className="flex flex-col justify-between rounded-2xl border border-white/10 bg-neutral-900/40 p-6"
            >
              <blockquote className="text-neutral-300">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-neutral-800" />
                <span className="text-sm font-semibold text-neutral-100">
                  {testimonial.name}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
