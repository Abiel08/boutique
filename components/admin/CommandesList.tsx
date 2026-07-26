"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface Ligne {
  id: string;
  quantite: number;
  taille: string | null;
  prixUnitaire: number;
  produit: { nom: string };
}

interface Commande {
  id: string;
  nomClient: string;
  telephone: string;
  pays: string;
  ville: string;
  quartier: string;
  statut: string;
  total: number;
  vueParAdmin: boolean;
  createdAt: string;
  lignes: Ligne[];
}

const statuts = ["EN_ATTENTE", "CONFIRMEE", "LIVREE", "ANNULEE"];
const statutLabels: Record<string, string> = {
  EN_ATTENTE: "En attente",
  CONFIRMEE: "Confirmée",
  LIVREE: "Livrée",
  ANNULEE: "Annulée",
};

export function CommandesList({ commandes }: { commandes: Commande[] }) {
  const router = useRouter();

  useEffect(() => {
    // Marquer les commandes non vues comme vues à l'ouverture de la page
    const nonVues = commandes.filter((c) => !c.vueParAdmin);
    nonVues.forEach((c) => {
      fetch(`/api/commandes/${c.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vueParAdmin: true }),
      });
    });
  }, [commandes]);

  async function changerStatut(id: string, statut: string) {
    await fetch(`/api/commandes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statut }),
    });
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {commandes.map((c) => (
        <div key={c.id} className="rounded-xl border border-ink/10 p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-medium">
                {c.nomClient} {!c.vueParAdmin && <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-600">Nouveau</span>}
              </p>
              <p className="text-sm text-ink/40">{c.telephone} · {c.quartier}, {c.ville}, {c.pays}</p>
              <p className="mt-1 text-xs text-ink/30">
                {new Date(c.createdAt).toLocaleString("fr-FR")}
              </p>
            </div>
            <select
              value={c.statut}
              onChange={(e) => changerStatut(c.id, e.target.value)}
              className="input-field text-sm"
            >
              {statuts.map((s) => (
                <option key={s} value={s}>
                  {statutLabels[s]}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-3 space-y-1 border-t border-ink/5 pt-3 text-sm">
            {c.lignes.map((l) => (
              <div key={l.id} className="flex justify-between text-ink/60">
                <span>
                  {l.produit.nom} {l.taille && `(${l.taille})`} × {l.quantite}
                </span>
                <span>{(l.prixUnitaire * l.quantite).toLocaleString()} FCFA</span>
              </div>
            ))}
          </div>

          <div className="mt-3 flex justify-between border-t border-ink/5 pt-3 font-semibold">
            <span>Total</span>
            <span>{c.total.toLocaleString()} FCFA</span>
          </div>
        </div>
      ))}
      {commandes.length === 0 && <p className="text-ink/40">Aucune commande pour le moment.</p>}
    </div>
  );
}
