"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/shop/CartContext";

interface Props {
  produitId: string;
  nom: string;
  prix: number;
  image?: string;
  tailles: string[];
  stockDisponible: number;
}

export function AjouterAuPanierForm({ produitId, nom, prix, image, tailles, stockDisponible }: Props) {
  const { ajouterAuPanier } = useCart();
  const router = useRouter();
  const [taille, setTaille] = useState(tailles[0] ?? undefined);
  const [quantite, setQuantite] = useState(1);
  const [ajoute, setAjoute] = useState(false);

  if (stockDisponible <= 0) {
    return <p className="mt-4 font-medium text-red-600">Rupture de stock</p>;
  }

  function handleAjouter() {
    ajouterAuPanier({ produitId, nom, prix, image, taille, quantite });
    setAjoute(true);
    setTimeout(() => setAjoute(false), 2000);
  }

  return (
    <div className="mt-6 space-y-4">
      {tailles.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium text-ink">Taille</p>
          <div className="flex flex-wrap gap-2">
            {tailles.map((t) => (
              <button
                key={t}
                onClick={() => setTaille(t)}
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                  taille === t ? "border-ink bg-ink text-paper" : "border-ink/15 text-ink hover:border-ink/40"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="mb-2 text-sm font-medium text-ink">Quantité</p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuantite((q) => Math.max(1, q - 1))}
            className="h-9 w-9 rounded-full border border-ink/15 text-ink hover:border-ink/40"
          >
            −
          </button>
          <span className="w-6 text-center text-ink">{quantite}</span>
          <button
            onClick={() => setQuantite((q) => Math.min(stockDisponible, q + 1))}
            className="h-9 w-9 rounded-full border border-ink/15 text-ink hover:border-ink/40"
          >
            +
          </button>
        </div>
      </div>

      <button onClick={handleAjouter} className="btn-primary w-full">
        {ajoute ? "Ajouté ✓" : "Ajouter au panier"}
      </button>
      <button
        onClick={() => {
          handleAjouter();
          router.push("/panier");
        }}
        className="btn-secondary w-full"
      >
        Acheter maintenant
      </button>
    </div>
  );
}
