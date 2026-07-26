"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/shop/ProductCard";
import { CategorieInfo } from "@/lib/categories";

interface Produit {
  id: string;
  nom: string;
  prix: number;
  images: string[];
  categorieId: string;
  categorie: { nom: string; couleur: string };
  tailles: string[];
  quantite: number;
}

interface ProductFiltersProps {
  produits: Produit[];
  categories: CategorieInfo[];
  categorieFixeId?: string; // si fourni, cache le sélecteur de catégorie (utilisé sur les pages catégorie)
}

export function ProductFilters({ produits, categories, categorieFixeId }: ProductFiltersProps) {
  const [recherche, setRecherche] = useState("");
  const [categorieId, setCategorieId] = useState<string>(categorieFixeId ?? "TOUTES");
  const [prixMax, setPrixMax] = useState<number>(0);
  const [taille, setTaille] = useState<string>("TOUTES");

  const prixPlafond = useMemo(
    () => Math.max(...produits.map((p) => p.prix), 10000),
    [produits]
  );

  const taillesDisponibles = useMemo(() => {
    const set = new Set<string>();
    produits.forEach((p) => p.tailles.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [produits]);

  const resultats = useMemo(() => {
    return produits.filter((p) => {
      if (categorieFixeId && p.categorieId !== categorieFixeId) return false;
      if (!categorieFixeId && categorieId !== "TOUTES" && p.categorieId !== categorieId) return false;
      if (recherche && !p.nom.toLowerCase().includes(recherche.toLowerCase())) return false;
      if (prixMax > 0 && p.prix > prixMax) return false;
      if (taille !== "TOUTES" && !p.tailles.includes(taille)) return false;
      return true;
    });
  }, [produits, categorieId, categorieFixeId, recherche, prixMax, taille]);

  return (
    <div>
      <div className="mb-10 flex flex-wrap items-center gap-3 rounded-2xl bg-ink/[0.03] p-4">
        <input
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          placeholder="Rechercher un produit..."
          className="input-pill min-w-[220px] flex-1"
        />

        {!categorieFixeId && categories.length > 0 && (
          <select
            value={categorieId}
            onChange={(e) => setCategorieId(e.target.value)}
            className="input-pill"
          >
            <option value="TOUTES">Toutes catégories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nom}
              </option>
            ))}
          </select>
        )}

        {taillesDisponibles.length > 0 && (
          <select
            value={taille}
            onChange={(e) => setTaille(e.target.value)}
            className="input-pill"
          >
            <option value="TOUTES">Toutes tailles</option>
            {taillesDisponibles.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        )}

        <div className="flex items-center gap-2 text-sm text-ink/50">
          <span>Prix max :</span>
          <input
            type="range"
            min={0}
            max={prixPlafond}
            step={500}
            value={prixMax}
            onChange={(e) => setPrixMax(Number(e.target.value))}
            className="w-32 accent-accent"
          />
          <span className="w-24 text-right">
            {prixMax > 0 ? `${prixMax.toLocaleString()} FCFA` : "Illimité"}
          </span>
        </div>
      </div>

      {resultats.length === 0 ? (
        <p className="text-ink/40">Aucun produit ne correspond à ta recherche.</p>
      ) : (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {resultats.map((p) => (
            <ProductCard
              key={p.id}
              id={p.id}
              nom={p.nom}
              prix={p.prix}
              image={p.images[0]}
              categorie={p.categorie}
              quantite={p.quantite}
            />
          ))}
        </div>
      )}
    </div>
  );
}
