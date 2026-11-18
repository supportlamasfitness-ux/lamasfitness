import "server-only";
import { Resend } from "resend";

// Server-only — nunca se importa desde un Client Component (el paquete
// "server-only" hace fallar el build si eso pasara por error).
export function getResend() {
  return new Resend(process.env.RESEND_API_KEY!);
}

// Remitente por defecto. "onboarding@resend.dev" funciona sin verificar
// dominio propio (solo para pruebas, Resend lo bloquea para uso real) —
// una vez que lamasfitness.com esté verificado en Resend, esto pasa a
// "Alberto Lamas <hola@lamasfitness.com>" (o el remitente que se prefiera).
export const FROM_ADDRESS =
  process.env.RESEND_FROM_ADDRESS || "Lamas Fitness <onboarding@resend.dev>";
