const navLinks = [
  { href: "#sobre-mi", label: "Sobre mí" },
  { href: "#servicios", label: "Servicios" },
  { href: "#testimonios", label: "Testimonios" },
  { href: "#contacto", label: "Contacto" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#top" className="text-lg font-bold tracking-tight">
          ALBERTO LAMAS
        </a>
        <nav className="hidden gap-8 text-sm font-medium text-neutral-300 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-amber-400"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a
            href="/portal"
            className="hidden rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-neutral-200 transition-colors hover:border-amber-400 hover:text-amber-400 sm:inline-block"
          >
            Portal de clientes
          </a>
          <a
            href="#contacto"
            className="rounded-full bg-amber-400 px-5 py-2 text-sm font-semibold text-neutral-950 transition-colors hover:bg-amber-300"
          >
            Reserva tu clase
          </a>
        </div>
      </div>
    </header>
  );
}
