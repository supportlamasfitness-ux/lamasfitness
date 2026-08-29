"use client";

import { useState } from "react";

const navLinks = [
  { href: "#sobre-mi", label: "Sobre mí" },
  { href: "#servicios", label: "Servicios" },
  { href: "#testimonios", label: "Testimonios" },
  { href: "#contacto", label: "Contacto" },
];

function Logo() {
  return (
    <a href="#top" className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-300 to-amber-500 text-sm font-black text-neutral-950 shadow-[0_4px_16px_-4px_rgba(251,191,36,0.7)]">
        AL
      </span>
      <span className="text-lg font-bold tracking-tight text-white">
        ALBERTO LAMAS
      </span>
    </a>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Logo />

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

        <div className="hidden items-center gap-3 md:flex">
          <a
            href="/login"
            className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-neutral-200 transition-colors hover:border-amber-400 hover:text-amber-400"
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

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-neutral-200 md:hidden"
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
        <div className="border-t border-white/10 bg-neutral-950 px-6 py-5 md:hidden">
          <nav className="flex flex-col gap-1 text-base font-medium text-neutral-300">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 transition-colors hover:bg-white/5 hover:text-amber-400"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4">
            <a
              href="/login"
              onClick={() => setOpen(false)}
              className="rounded-full border border-white/15 px-4 py-2.5 text-center text-sm font-semibold text-neutral-200 transition-colors hover:border-amber-400 hover:text-amber-400"
            >
              Portal de clientes
            </a>
            <a
              href="#contacto"
              onClick={() => setOpen(false)}
              className="rounded-full bg-amber-400 px-5 py-2.5 text-center text-sm font-semibold text-neutral-950 transition-colors hover:bg-amber-300"
            >
              Reserva tu clase
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
