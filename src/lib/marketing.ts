import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { getResend, FROM_ADDRESS } from "@/lib/resend";

type AddContactInput = {
  email: string;
  full_name?: string | null;
  source: "newsletter" | "client_signup";
};

// Punto único donde entra cualquier contacto nuevo (suscriptor de
// newsletter o cliente que se registró en el portal): queda en la tabla
// subscribers (nuestra copia, siempre disponible) y en la Audience de
// Resend (para que Alberto mande campañas desde el dashboard de Resend
// directamente, sin que tengamos que construir un editor de campañas
// propio). Todo lo de Resend es best-effort — si RESEND_API_KEY todavía no
// está configurada, no rompe el signup/subscribe, solo no manda el correo.
export async function addContact({ email, full_name, source }: AddContactInput) {
  const admin = createAdminClient();
  await admin
    .from("subscribers")
    .upsert({ email, full_name: full_name || null, source }, { onConflict: "email", ignoreDuplicates: true });

  if (!process.env.RESEND_API_KEY) return;

  try {
    const resend = getResend();
    if (process.env.RESEND_AUDIENCE_ID) {
      const [firstName, ...rest] = (full_name || "").split(" ");
      await resend.contacts.create({
        email,
        firstName: firstName || undefined,
        lastName: rest.join(" ") || undefined,
        audienceId: process.env.RESEND_AUDIENCE_ID,
      });
    }

    await resend.emails.send({
      from: FROM_ADDRESS,
      to: email,
      subject:
        source === "client_signup"
          ? "¡Bienvenido/a a tu portal, Alberto Lamas Fitness!"
          : "Gracias por sumarte — Alberto Lamas Fitness",
      html:
        source === "client_signup"
          ? `<p>Hola${full_name ? " " + full_name.split(" ")[0] : ""},</p>
             <p>Tu cuenta ya está activa. Entrá a tu portal cuando quieras para ver tu plan asignado.</p>
             <p>— Alberto Lamas</p>`
          : `<p>Hola${full_name ? " " + full_name.split(" ")[0] : ""},</p>
             <p>Gracias por sumarte. De acá en más vas a recibir tips de entrenamiento, nutrición y promociones de clases presenciales en Austin.</p>
             <p>— Alberto Lamas</p>`,
    });
  } catch (e) {
    console.error("[marketing] Resend falló (no bloquea el flujo):", (e as Error).message);
  }
}
