"use client";

import { useState } from "react";

interface Utilisateur {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
}

export function UtilisateursManager({ utilisateursInitiaux, idConnecte }: { utilisateursInitiaux: Utilisateur[]; idConnecte: string }) {
  const [utilisateurs, setUtilisateurs] = useState(utilisateursInitiaux);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState("");

  async function handleAjouter(e: React.FormEvent) {
    e.preventDefault();
    setErreur("");
    setEnvoi(true);

    const res = await fetch("/api/admins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name: name || undefined }),
    });

    if (res.ok) {
      const nouvelUtilisateur = await res.json();
      setUtilisateurs([...utilisateurs, nouvelUtilisateur]);
      setEmail("");
      setPassword("");
      setName("");
    } else {
      const data = await res.json();
      setErreur(data.error ?? "Une erreur est survenue.");
    }
    setEnvoi(false);
  }

  async function handleSupprimer(id: string) {
    if (!confirm("Supprimer ce compte admin ?")) return;
    const res = await fetch(`/api/admins/${id}`, { method: "DELETE" });
    if (res.ok) {
      setUtilisateurs(utilisateurs.filter((u) => u.id !== id));
    } else {
      const data = await res.json();
      alert(data.error ?? "Impossible de supprimer ce compte.");
    }
  }

  return (
    <div>
      <form onSubmit={handleAjouter} className="mb-8 max-w-md space-y-3 rounded-xl border border-ink/10 p-5">
        <h2 className="font-medium">Ajouter un administrateur</h2>
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field text-sm"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field text-sm"
            required
            minLength={6}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Nom (optionnel)</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field text-sm"
          />
        </div>
        {erreur && <p className="text-sm text-red-500">{erreur}</p>}
        <button type="submit" disabled={envoi} className="btn-primary text-sm disabled:opacity-50">
          {envoi ? "Création..." : "Créer le compte"}
        </button>
      </form>

      <div className="space-y-2">
        {utilisateurs.map((u) => (
          <div key={u.id} className="flex items-center justify-between rounded-lg border border-ink/10 px-4 py-3">
            <div>
              <p className="font-medium">{u.name || u.email}</p>
              <p className="text-sm text-ink/40">{u.email}</p>
            </div>
            {u.id === idConnecte ? (
              <span className="text-sm text-ink/40">C'est toi</span>
            ) : (
              <button onClick={() => handleSupprimer(u.id)} className="text-sm text-red-500 hover:underline">
                Supprimer
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
