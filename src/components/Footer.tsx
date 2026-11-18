import { SOCIAL } from "@/lib/social";

const icon = "h-5 w-5 fill-current";

export default function Footer() {
  const link =
    "flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-neutral-300 transition-colors hover:border-red-500 hover:text-red-500";
  return (
    <footer className="border-t border-white/10 bg-neutral-950">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-6 py-8 text-sm text-neutral-500 md:flex-row">
        <span>© {new Date().getFullYear()} Lamas Fitness — Personal Trainer</span>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram de Lamas Fitness" className={link}>
            <svg viewBox="0 0 24 24" className={icon} aria-hidden="true">
              <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5Zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5Zm5.25-3.4a1.15 1.15 0 1 1-1.15 1.15 1.15 1.15 0 0 1 1.15-1.15Z" />
            </svg>
            Instagram
          </a>
          <a href={SOCIAL.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook de Lamas Fitness" className={link}>
            <svg viewBox="0 0 24 24" className={icon} aria-hidden="true">
              <path d="M13.5 22v-8.2h2.8l.5-3.3h-3.3V8.4c0-.95.4-1.7 1.8-1.7h1.6V3.8A20 20 0 0 0 14.6 3.7c-2.6 0-4.3 1.6-4.3 4.4v2.4H7.5v3.3h2.8V22h3.2Z" />
            </svg>
            Facebook
          </a>
        </div>
      </div>
    </footer>
  );
}
