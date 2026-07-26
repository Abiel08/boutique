"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Categorie {
  id: string;
  nom: string;
  slug: string;
  couleur: string;
}

export function CategoriesManager({ categoriesInitiales }: { categoriesInitiales: Categorie[] }) {
  const router = useRouter();
  const [categories, setCategories] = useState(categoriesInitiales);
  const [nom, setNom] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState("");

  async function handleAjouter(e: React.FormEvent) {
    e.preventDefault();
    if (!nom.trim()) return;
    setEnvoi(true);
    setErreur("");

    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom }),
    });

    if (res.ok) {
      const nouvelleCategorie = await res.json();
      setCategories([...categories, nouvelleCategorie]);
      setNom("");
      router.refresh();
    } else {
      setErreur("Une erreur est survenue.");
    }
    setEnvoi(false);
  }

  async function handleSupprimer(id: string) {
    if (!confirm("Supprimer cette catégorie ?")) return;
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    if (res.ok) {
      setCategories(categories.filter((c) => c.id !== id));
      router.refresh();
    } else {
      const data = await res.json();
      alert(data.error ?? "Impossible de supprimer cette catégorie.");
    }
  }

  return (
    <div>
      <form onSubmit={handleAjouter} className="mb-6 flex items-end gap-3">
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium text-ink">Nouvelle catégorie</label>
          <input
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Ex: Accessoires"
            className="input-field"
          />
        </div>
        <button type="submit" disabled={envoi} className="btn-primary disabled:opacity-50">
          {envoi ? "Ajout..." : "Ajouter"}
        </button>
      </form>
      {erreur && <p className="mb-4 text-sm text-red-500">{erreur}</p>}

      <div className="space-y-2">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center justify-between rounded-lg border border-ink/10 bg-paper px-4 py-3 shadow-sm">
            <span className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${c.couleur}`}>{c.nom}</span>
            <button onClick={() => handleSupprimer(c.id)} className="text-sm text-red-500 hover:underline">
              Supprimer
            </button>
          </div>
        ))}
        {categories.length === 0 && <p className="text-ink/40">Aucune catégorie pour le moment.</p>}
      </div>
    </div>
  );
}
