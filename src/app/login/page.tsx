"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Mode = "login" | "signup" | "recover";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState("");

  function switchMode(next: Mode) {
    setMode(next);
    setError("");
    setInfo("");
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (authError || !data.user) {
      setError("Email o contraseña incorrectos.");
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .maybeSingle();

    router.push(profile?.role === "admin" ? "/admin/clientes" : "/portal");
    router.refresh();
  }

  async function handleRecover(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setInfo("");
    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (resetError && /rate|limit|seconds/i.test(resetError.message)) {
      setError("Demasiados intentos. Espera unos minutos y vuelve a probar.");
      return;
    }
    // Mensaje igual exista o no el correo, para no revelar qué emails tienen cuenta
    setInfo("Si ese email tiene una cuenta, te enviamos un enlace para crear una contraseña nueva. Revisa también la carpeta de spam.");
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ full_name: fullName, email, phone, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "No se pudo crear la cuenta");
      setLoading(false);
      return;
    }

    // La cuenta ya quedó creada y activa (sin aprobación) — logueamos acá
    // mismo con las credenciales que la persona acaba de elegir.
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (authError) {
      setError("Cuenta creada, pero falló el inicio de sesión automático. Probá iniciar sesión.");
      setLoading(false);
      switchMode("login");
      return;
    }

    router.push("/portal");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-6 text-neutral-100">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-lg font-bold tracking-tight">LAMAS FITNESS</p>
          <p className="mt-1 text-sm text-neutral-400">
            {mode === "login" ? "Iniciar sesión" : mode === "signup" ? "Crear tu cuenta de cliente" : "Recuperar contraseña"}
          </p>
        </div>

        {mode !== "recover" && (
        <div className="mb-6 flex w-full gap-1 rounded-full border border-white/10 bg-neutral-900 p-1">
          <button
            type="button"
            onClick={() => switchMode("login")}
            className={`flex-1 rounded-full py-2 text-sm font-semibold transition-colors ${
              mode === "login" ? "bg-red-500 text-white" : "text-neutral-400 hover:text-neutral-100"
            }`}
          >
            Iniciar sesión
          </button>
          <button
            type="button"
            onClick={() => switchMode("signup")}
            className={`flex-1 rounded-full py-2 text-sm font-semibold transition-colors ${
              mode === "signup" ? "bg-red-500 text-white" : "text-neutral-400 hover:text-neutral-100"
            }`}
          >
            Crear cuenta
          </button>
        </div>
        )}

        {mode === "recover" ? (
          <form onSubmit={handleRecover} className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-neutral-900 p-8">
            <p className="text-sm text-neutral-400">Escribe el email de tu cuenta y te enviaremos un enlace para crear una contraseña nueva.</p>
            <div className="flex flex-col gap-1">
              <label htmlFor="recover_email" className="text-sm text-neutral-300">Email</label>
              <input id="recover_email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="rounded-lg border border-white/10 bg-neutral-950 px-4 py-2 text-sm outline-none focus:border-red-500" />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            {info && <p className="rounded-lg border border-emerald-400/30 bg-emerald-400/5 p-3 text-sm text-emerald-300">{info}</p>}
            <button type="submit" disabled={loading} className="mt-2 rounded-full bg-red-500 px-6 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-red-400 disabled:opacity-60">
              {loading ? "Enviando..." : "Enviar enlace"}
            </button>
            <button type="button" onClick={() => switchMode("login")} className="text-center text-sm text-neutral-400 hover:text-red-500">← Volver a iniciar sesión</button>
          </form>
        ) : mode === "login" ? (
          <form
            onSubmit={handleLogin}
            className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-neutral-900 p-8"
          >
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-sm text-neutral-300">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-lg border border-white/10 bg-neutral-950 px-4 py-2 text-sm outline-none focus:border-red-500"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-sm text-neutral-300">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-lg border border-white/10 bg-neutral-950 px-4 py-2 text-sm outline-none focus:border-red-500"
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-full bg-red-500 px-6 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-red-400 disabled:opacity-60"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
            <button type="button" onClick={() => switchMode("recover")} className="text-center text-sm text-neutral-400 hover:text-red-500">
              ¿Olvidaste tu contraseña?
            </button>
          </form>
        ) : (
          <form
            onSubmit={handleSignup}
            className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-neutral-900 p-8"
          >
            <div className="flex flex-col gap-1">
              <label htmlFor="full_name" className="text-sm text-neutral-300">
                Nombre completo
              </label>
              <input
                id="full_name"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="rounded-lg border border-white/10 bg-neutral-950 px-4 py-2 text-sm outline-none focus:border-red-500"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="signup_email" className="text-sm text-neutral-300">
                Email
              </label>
              <input
                id="signup_email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-lg border border-white/10 bg-neutral-950 px-4 py-2 text-sm outline-none focus:border-red-500"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="phone" className="text-sm text-neutral-300">
                Teléfono (opcional)
              </label>
              <input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="rounded-lg border border-white/10 bg-neutral-950 px-4 py-2 text-sm outline-none focus:border-red-500"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="signup_password" className="text-sm text-neutral-300">
                Contraseña
              </label>
              <input
                id="signup_password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-lg border border-white/10 bg-neutral-950 px-4 py-2 text-sm outline-none focus:border-red-500"
              />
              <span className="text-xs text-neutral-500">Mínimo 8 caracteres.</span>
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-full bg-red-500 px-6 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-red-400 disabled:opacity-60"
            >
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>
        )}

        <a
          href="/"
          className="mt-6 block text-center text-sm text-neutral-500 hover:text-red-500"
        >
          ← Volver a la web
        </a>
      </div>
    </div>
  );
}
