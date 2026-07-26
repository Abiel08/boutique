"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Zone {
  id: string;
  nom: string;
  frais: number;
  ordre: number;
}

export function ZonesLivraisonManager({ zonesInitiales }: { zonesInitiales: Zone[] }) {
  const router = useRouter();
  const [zones, setZones] = useState(zonesInitiales);
  const [nom, setNom] = useState("");
  const [frais, setFrais] = useState(0);
  const [envoi, setEnvoi] = useState(false);

  async function handleAjouter(e: React.FormEvent) {
    e.preventDefault();
    if (!nom.trim()) return;
    setEnvoi(true);

    const res = await fetch("/api/zones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom, frais, ordre: zones.length }),
    });

    if (res.ok) {
      const nouvelleZone = await res.json();
      setZones([...zones, nouvelleZone]);
      setNom("");
      setFrais(0);
    }
    setEnvoi(false);
  }

  async function handleSupprimer(id: string) {
    if (!confirm("Supprimer cette zone ?")) return;
    await fetch(`/api/zones/${id}`, { method: "DELETE" });
    setZones(zones.filter((z) => z.id !== id));
    router.refresh();
  }

  async function handleModifierFrais(id: string, nouveauFrais: number) {
    await fetch(`/api/zones/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ frais: nouveauFrais }),
    });
    setZones(zones.map((z) => (z.id === id ? { ...z, frais: nouveauFrais } : z)));
  }

  return (
    <div>
      <form onSubmit={handleAjouter} className="mb-6 flex flex-wrap items-end gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium">Nom de la zone</label>
          <input
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Ex: Cotonou centre"
            className="rounded-lg border border-ink/15 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Frais de livraison (FCFA)</label>
          <input
            type="number"
            value={frais}
            onChange={(e) => setFrais(Number(e.target.value))}
            className="w-32 rounded-lg border border-ink/15 px-3 py-2 text-sm"
          />
        </div>
        <button type="submit" disabled={envoi} className="btn-primary text-sm disabled:opacity-50">
          Ajouter la zone
        </button>
      </form>

      <div className="space-y-2">
        {zones.map((z) => (
          <div key={z.id} className="flex items-center justify-between rounded-lg border border-ink/10 px-4 py-3">
            <span className="font-medium">{z.nom}</span>
            <div className="flex items-center gap-3">
              <input
                type="number"
                defaultValue={z.frais}
                onBlur={(e) => handleModifierFrais(z.id, Number(e.target.value))}
                className="w-28 rounded-lg border border-ink/15 px-2 py-1 text-sm"
              />
              <span className="text-sm text-ink/40">FCFA</span>
              <button onClick={() => handleSupprimer(z.id)} className="text-sm text-red-500 hover:underline">
                Supprimer
              </button>
            </div>
          </div>
        ))}
        {zones.length === 0 && (
          <p className="text-ink/40">
            Aucune zone configurée — le client saisira sa localisation librement sans frais calculé automatiquement.
          </p>
        )}
      </div>
    </div>
  );
}
