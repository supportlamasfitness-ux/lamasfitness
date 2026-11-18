export type Testimonial = { name: string; quote: string; rating: number; image: string };

// Testimonios aprobados desde el panel (tabla testimonials). Se refresca cada minuto.
export async function getTestimonials(): Promise<Testimonial[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];
  try {
    const r = await fetch(`${url}/rest/v1/testimonials?select=name,quote,rating,image&status=eq.approved&order=created_at.desc`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      next: { revalidate: 60 },
    });
    if (!r.ok) return [];
    return (await r.json()) as Testimonial[];
  } catch {
    return [];
  }
}

