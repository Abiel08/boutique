"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogoUploader } from "@/components/admin/LogoUploader";

interface Props {
  initialData: {
    nom: string;
    logoUrl: string;
    description: string;
    whatsappNumero: string;
    aPropos: string;
    conditionsVente: string;
    heroTitre: string;
    heroSousTitre: string;
  };
}

export function ParametresForm({ initialData }: Props) {
  const router = useRouter();
  const [data, setData] = useState(initialData);
  const [envoi, setEnvoi] = useState(false);
  const [succes, setSucces] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnvoi(true);
    setSucces(false);

    await fetch("/api/parametres", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    setEnvoi(false);
    setSucces(true);
    router.refresh();
    setTimeout(() => setSucces(false), 2000);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-5">
      <div>
        <label className="mb-1 block text-sm font-medium">Nom du site</label>
        <input
          value={data.nom}
          onChange={(e) => setData({ ...data, nom: e.target.value })}
          className="input-field"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Description</label>
        <input
          value={data.description}
          onChange={(e) => setData({ ...data, description: e.target.value })}
          className="input-field"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Logo du site</label>
        <LogoUploader logoUrl={data.logoUrl} onChange={(url) => setData({ ...data, logoUrl: url })} />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Titre de la page d'accueil</label>
        <input
          value={data.heroTitre}
          onChange={(e) => setData({ ...data, heroTitre: e.target.value })}
          className="input-field"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Sous-texte de la page d'accueil</label>
        <textarea
          value={data.heroSousTitre}
          onChange={(e) => setData({ ...data, heroSousTitre: e.target.value })}
          rows={2}
          className="input-field"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Numéro WhatsApp (format international, sans +)</label>
        <input
          value={data.whatsappNumero}
          onChange={(e) => setData({ ...data, whatsappNumero: e.target.value })}
          className="input-field"
          placeholder="Ex: 22990000000"
        />
        <p className="mt-1 text-xs text-ink/40">Laisse vide pour masquer le bouton WhatsApp sur le site.</p>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Texte "À propos"</label>
        <textarea
          value={data.aPropos}
          onChange={(e) => setData({ ...data, aPropos: e.target.value })}
          rows={4}
          className="input-field"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Texte "Conditions de vente"</label>
        <textarea
          value={data.conditionsVente}
          onChange={(e) => setData({ ...data, conditionsVente: e.target.value })}
          rows={4}
          className="input-field"
        />
      </div>

      <button type="submit" disabled={envoi} className="btn-primary disabled:opacity-50">
        {envoi ? "Enregistrement..." : succes ? "Enregistré ✓" : "Enregistrer"}
      </button>
    </form>
  );
}
