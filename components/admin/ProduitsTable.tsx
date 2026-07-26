"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { SEUIL_STOCK_FAIBLE } from "@/lib/categories";

interface Produit {
  id: string;
  nom: string;
  prix: number;
  categorie: { nom: string };
  quantite: number;
  publie: boolean;
}

export function ProduitsTable({ produits }: { produits: Produit[] }) {
  const router = useRouter();

  async function handleSupprimer(id: string) {
    if (!confirm("Supprimer ce produit ?")) return;
    await fetch(`/api/produits/${id}`, { method: "DELETE" });
    router.refresh();
  }

  if (produits.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-ink/15 bg-paper p-10 text-center text-ink/40">
        Aucun produit pour le moment. Clique sur "Ajouter un produit" pour commencer.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-ink/10 bg-paper shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-ink/10 bg-muted text-left text-xs uppercase tracking-wide text-ink/40">
            <th className="px-4 py-3 font-medium">Nom</th>
            <th className="px-4 py-3 font-medium">Catégorie</th>
            <th className="px-4 py-3 font-medium">Prix</th>
            <th className="px-4 py-3 font-medium">Stock</th>
            <th className="px-4 py-3 font-medium">Statut</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {produits.map((p) => {
            const stockFaible = p.quantite > 0 && p.quantite <= SEUIL_STOCK_FAIBLE;
            const rupture = p.quantite <= 0;
            return (
              <tr key={p.id} className="border-b border-ink/5 last:border-0 hover:bg-muted/50">
                <td className="px-4 py-3 font-medium text-ink">{p.nom}</td>
                <td className="px-4 py-3 text-ink/60">{p.categorie.nom}</td>
                <td className="px-4 py-3 text-ink/60">{p.prix.toLocaleString()} FCFA</td>
                <td className="px-4 py-3">
                  <span className={rupture ? "text-red-600" : stockFaible ? "text-amber-600" : "text-ink/60"}>
                    {p.quantite}
                    {rupture && " (épuisé)"}
                    {stockFaible && " (faible)"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      p.publie ? "bg-green-50 text-green-700" : "bg-ink/5 text-ink/50"
                    }`}
                  >
                    {p.publie ? "Publié" : "Masqué"}
                  </span>
                </td>
                <td className="space-x-3 px-4 py-3 text-right">
                  {p.publie && (
                    <a
                      href={`/produit/${p.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ink/60 hover:text-ink hover:underline"
                    >
                      Voir
                    </a>
                  )}
                  <Link href={`/admin/produits/${p.id}/edit`} className="text-ink/60 hover:text-ink hover:underline">
                    Modifier
                  </Link>
                  <button onClick={() => handleSupprimer(p.id)} className="text-red-500 hover:underline">
                    Supprimer
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
