"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erreur, setErreur] = useState("");
  const [envoi, setEnvoi] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnvoi(true);
    setErreur("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setEnvoi(false);
    if (res?.error) {
      setErreur("Email ou mot de passe incorrect.");
      return;
    }
    router.push("/admin/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted px-6">
      <div className="w-full max-w-sm rounded-xl border border-ink/10 bg-paper p-8">
        <h1 className="mb-1 text-xl font-semibold text-ink">Connexion admin</h1>
        <p className="mb-6 text-sm text-ink/50">Accède à ton espace de gestion</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-ink">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
            />
          </div>
          {erreur && <p className="text-sm text-red-500">{erreur}</p>}
          <button type="submit" disabled={envoi} className="btn-primary w-full disabled:opacity-50">
            {envoi ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </main>
  );
}
