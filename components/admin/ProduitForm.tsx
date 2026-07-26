"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUploader } from "@/components/admin/ImageUploader";

interface CategorieOption {
  id: string;
  nom: string;
}

interface ProduitFormData {
  id?: string;
  nom: string;
  description: string;
  prix: number;
  images: string[];
  categorieId: string;
  tailles: string[];
  quantite: number;
  publie: boolean;
}

export function ProduitForm({
  initialData,
  categories,
}: {
  initialData?: ProduitFormData;
  categories: CategorieOption[];
}) {
  const router = useRouter();
  const [data, setData] = useState<ProduitFormData>(
    initialData ?? {
      nom: "",
      description: "",
      prix: 0,
      images: [],
      categorieId: categories[0]?.id ?? "",
      tailles: [],
      quantite: 0,
      publie: true,
    }
  );
  const [tailleInput, setTailleInput] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState("");

  function ajouterTaille() {
    if (!tailleInput.trim()) return;
    setData((d) => ({ ...d, tailles: [...d.tailles, tailleInput.trim()] }));
    setTailleInput("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErreur("");

    if (!data.categorieId) {
      setErreur("Merci de choisir une catégorie (crée-en une d'abord si la liste est vide).");
      return;
    }

    setEnvoi(true);
    try {
      const url = data.id ? `/api/produits/${data.id}` : "/api/produits";
      const method = data.id ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Erreur");
      router.push("/admin/produits");
      router.refresh();
    } catch {
      setErreur("Une erreur est survenue.");
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
      <div>
        <label className="mb-1 block text-sm font-medium">Photos du produit</label>
        <ImageUploader images={data.images} onChange={(images) => setData((d) => ({ ...d, images }))} />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Nom du produit</label>
        <input
          value={data.nom}
          onChange={(e) => setData({ ...data, nom: e.target.value })}
          className="input-field"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Description</label>
        <textarea
          value={data.description}
          onChange={(e) => setData({ ...data, description: e.target.value })}
          className="input-field"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Prix (FCFA)</label>
          <input
            type="number"
            value={data.prix}
            onChange={(e) => setData({ ...data, prix: Number(e.target.value) })}
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Quantité en stock</label>
          <input
            type="number"
            value={data.quantite}
            onChange={(e) => setData({ ...data, quantite: Number(e.target.value) })}
            className="input-field"
            required
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Catégorie</label>
        {categories.length === 0 ? (
          <p className="rounded-lg border border-dashed border-amber-300 bg-amber-50 p-3 text-sm text-amber-700">
            Aucune catégorie n'existe encore. Va dans <strong>Admin → Catégories</strong> pour en créer une avant
            d'ajouter un produit.
          </p>
        ) : (
          <select
            value={data.categorieId}
            onChange={(e) => setData({ ...data, categorieId: e.target.value })}
            className="input-field"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nom}
              </option>
            ))}
          </select>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Tailles disponibles (ex: S, M, L ou 38, 39, 40)
        </label>
        <div className="flex gap-2">
          <input
            value={tailleInput}
            onChange={(e) => setTailleInput(e.target.value)}
            className="input-field flex-1"
            placeholder="Ex: M"
          />
          <button type="button" onClick={ajouterTaille} className="btn-secondary px-4 py-2 text-sm">
            Ajouter
          </button>
        </div>
        {data.tailles.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {data.tailles.map((t, i) => (
              <span key={i} className="rounded-full bg-muted px-3 py-1 text-sm">
                {t}{" "}
                <button
                  type="button"
                  onClick={() => setData((d) => ({ ...d, tailles: d.tailles.filter((_, idx) => idx !== i) }))}
                  className="ml-1 text-ink/40"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          checked={data.publie}
          onChange={(e) => setData({ ...data, publie: e.target.checked })}
        />
        Publier ce produit sur le site
      </label>

      {erreur && <p className="text-sm text-red-500">{erreur}</p>}

      <button type="submit" disabled={envoi || categories.length === 0} className="btn-primary disabled:opacity-50">
        {envoi ? "Enregistrement..." : data.id ? "Mettre à jour" : "Créer le produit"}
      </button>
    </form>
  );
}
