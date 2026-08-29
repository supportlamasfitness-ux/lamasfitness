import { ScrollReveal } from "@/components/ScrollReveal";

const WHATSAPP_NUMBER = "15123510364";
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hola, quiero más información sobre las clases presenciales."
);

export default function Contact() {
  return (
    <section id="contacto" className="bg-neutral-900/40">
      <div className="mx-auto flex max-w-3xl flex-col items-start gap-6 px-6 py-20 text-left">
        <ScrollReveal>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Empieza hoy tu primera clase
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <p className="text-neutral-300">
            Cuéntame tus objetivos y te responderé con disponibilidad de
            horarios y el plan que mejor se adapte a ti. Sin compromiso.
          </p>
        </ScrollReveal>
        <ScrollReveal delay={220}>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-fit items-center gap-2 rounded-full bg-amber-400 px-8 py-3 font-semibold text-neutral-950 transition-colors hover:bg-amber-300"
          >
            Escríbeme por WhatsApp
          </a>
        </ScrollReveal>
        <ScrollReveal delay={320}>
          <div className="mt-2 flex flex-col gap-1 text-sm text-neutral-400">
            <span>📍 Austin, TX</span>
            <span>📞 +1 (512) 351-0364</span>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
