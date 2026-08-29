"use client";

import { useEffect, useState } from "react";

// Adaptado de theglobaldelivery.com (IntroScreen.tsx): mismo timing y misma
// máquina de estados, pero con el wordmark de texto de Alberto en vez del
// logo-imagen de TGD (acá no hay archivo de logo), y paleta ámbar/neutral-950
// en vez del negro/amarillo de TGD.
type Phase = "idle" | "visible" | "sliding" | "gone";

export function IntroScreen() {
  const [phase, setPhase] = useState<Phase>("idle");

  useEffect(() => {
    if (sessionStorage.getItem("lamas_intro")) {
      setPhase("gone");
      return;
    }
    sessionStorage.setItem("lamas_intro", "1");
    setPhase("visible");

    const t1 = setTimeout(() => setPhase("sliding"), 2100);
    const t2 = setTimeout(() => setPhase("gone"), 2950);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (phase === "idle" || phase === "gone") return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-neutral-950 select-none"
      style={{
        transform: phase === "sliding" ? "translateY(-100%)" : "translateY(0)",
        transition:
          phase === "sliding" ? "transform 0.85s cubic-bezier(.76,0,.24,1)" : undefined,
        pointerEvents: phase === "sliding" ? "none" : "auto",
      }}
    >
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

      <span className="intro-logo text-2xl font-bold tracking-tight text-neutral-100">
        ALBERTO LAMAS
      </span>

      <div className="intro-tagline mt-2 text-[10px] uppercase tracking-[0.5em] text-neutral-500">
        Entrenador Personal
      </div>

      <div className="relative mt-10 h-[2px] w-44 overflow-hidden rounded-full bg-white/10">
        <div className="intro-line-bar h-full w-full bg-amber-400" />
      </div>

      <button
        onClick={() => setPhase("gone")}
        className="absolute bottom-8 right-8 text-[10px] tracking-[0.3em] text-white/30 hover:text-white/60 transition-colors uppercase"
      >
        Skip
      </button>
    </div>
  );
}
