import { ScrollReveal } from "@/components/ScrollReveal";

const WHATSAPP_NUMBER = "15123510364";
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hola, quiero más información sobre las clases presenciales."
);

export default function Contact() {
  return (
    <section id="contacto" className="relative overflow-hidden bg-neutral-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(251,191,36,0.14),_transparent_55%)]" />
      <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 py-28 text-center">
        <ScrollReveal>
          <span className="eyebrow text-amber-400">Contacto</span>
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <h2 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">
            Empieza hoy tu primera clase
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={200}>
          <p className="max-w-lg text-lg text-neutral-400">
            Cuéntame tus objetivos y te responderé con disponibilidad de
            horarios y el plan que mejor se adapte a ti. Sin compromiso.
          </p>
        </ScrollReveal>
        <ScrollReveal delay={320}>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex items-center gap-2 rounded-full bg-amber-400 px-9 py-4 font-semibold text-neutral-950 shadow-[0_8px_30px_-8px_rgba(251,191,36,0.6)] transition-all hover:-translate-y-0.5 hover:bg-amber-300"
          >
            Escríbeme por WhatsApp
          </a>
        </ScrollReveal>
        <ScrollReveal delay={420}>
          <div className="mt-4 flex flex-col items-center gap-1 text-sm text-neutral-500">
            <span>📍 Austin, TX</span>
            <span>📞 +1 (512) 351-0364</span>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
