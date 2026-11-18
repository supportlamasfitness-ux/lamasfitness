"use client";

import { useEffect, useState } from "react";

const navLinks = [
  { href: "#sobre-mi", label: "Nosotros" },
  { href: "#servicios", label: "Servicios" },
  { href: "#testimonios", label: "Testimonios" },
  { href: "#contacto", label: "Contacto" },
];

function Logo() {
  return (
    <a href="#top" className="flex items-center gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/logo-lamas.png" alt="Lamas Fitness" className="h-11 w-auto" />
      <span className="hidden whitespace-nowrap text-lg font-extrabold tracking-tight text-white sm:inline">
        LAMAS <span className="text-red-500">FITNESS</span>
      </span>
    </a>
  );
}

export default function Header({ showTestimonials = true }: { showTestimonials?: boolean }) {
  const links = navLinks.filter((l) => showTestimonials || l.href !== "#testimonios");
  const [open, setOpen] = useState(false);
  // Igual que theglobaldelivery.com: transparente arriba, fondo sólido al bajar 40px
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled || open
          ? "border-white/10 bg-neutral-950/90 shadow-lg shadow-black/30 backdrop-blur"
          : "border-transparent bg-transparent"
      }`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Logo />

        <nav className="hidden gap-8 text-sm font-medium text-neutral-300 lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-red-500"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href="/login"
            className="whitespace-nowrap rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-neutral-200 transition-colors hover:border-red-500 hover:text-red-500"
          >
            Portal de clientes
          </a>
          <a
            href="#contacto"
            className="whitespace-nowrap rounded-full bg-red-500 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-400"
          >
            Empieza ahora
          </a>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-neutral-200 lg:hidden"
        >
          {open ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-neutral-950 px-6 py-5 lg:hidden">
          <nav className="flex flex-col gap-1 text-base font-medium text-neutral-300">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 transition-colors hover:bg-white/5 hover:text-red-500"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4">
            <a
              href="/login"
              onClick={() => setOpen(false)}
              className="rounded-full border border-white/15 px-4 py-2.5 text-center text-sm font-semibold text-neutral-200 transition-colors hover:border-red-500 hover:text-red-500"
            >
              Portal de clientes
            </a>
            <a
              href="#contacto"
              onClick={() => setOpen(false)}
              className="rounded-full bg-red-500 px-5 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-red-400"
            >
              Empieza ahora
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
