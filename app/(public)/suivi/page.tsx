"use client";

import { useState } from "react";
import Link from "next/link";

const statutLabels: Record<string, string> = {
  EN_ATTENTE: "En attente",
  CONFIRMEE: "Confirmée",
  LIVREE: "Livrée",
  ANNULEE: "Annulée",
};

interface CommandeResume {
  id: string;
  statut: string;
  total: number;
  createdAt: string;
}

export default function SuiviPage() {
  const [telephone, setTelephone] = useState("");
  const [commandes, setCommandes] = useState<CommandeResume[] | null>(null);
  const [recherche, setRecherche] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setRecherche(true);
    const res = await fetch(`/api/commandes/suivi?telephone=${encodeURIComponent(telephone)}`);
    const data = await res.json();
    setCommandes(data);
  }

  return (
    <>
      <header className="border-b border-ink/10 px-6 py-4">
        <Link href="/" className="text-sm text-ink/50">← Retour à la boutique</Link>
      </header>
      <main className="mx-auto max-w-md px-6 py-10">
        <h1 className="mb-6 text-2xl text-ink">Suivre ma commande</h1>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            placeholder="Ton numéro de téléphone"
            className="flex-1 rounded-lg border border-ink/15 px-4 py-2"
          />
          <button type="submit" className="btn-primary">Chercher</button>
        </form>

        {recherche && commandes && (
          <div className="mt-8 space-y-3">
            {commandes.length === 0 ? (
              <p className="text-ink/40">Aucune commande trouvée avec ce numéro.</p>
            ) : (
              commandes.map((c) => (
                <Link
                  key={c.id}
                  href={`/suivi/${c.id}`}
                  className="flex items-center justify-between rounded-lg border border-ink/10 px-4 py-3"
                >
                  <div>
                    <p className="text-sm text-ink/40">
                      {new Date(c.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                    <p className="font-medium">{statutLabels[c.statut]}</p>
                  </div>
                  <span className="font-semibold">{c.total.toLocaleString()} FCFA</span>
                </Link>
              ))
            )}
          </div>
        )}
      </main>
    </>
  );
}
