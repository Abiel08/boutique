"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/shop/CartContext";

export default function CommandePage() {
  const { items, total, viderPanier } = useCart();
  const router = useRouter();
  const [nomClient, setNomClient] = useState("");
  const [telephone, setTelephone] = useState("");
  const [pays, setPays] = useState("Bénin");
  const [ville, setVille] = useState("");
  const [quartier, setQuartier] = useState("");
  const [whatsappBoutique, setWhatsappBoutique] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState("");
  const [succes, setSucces] = useState(false);
  const [commandeId, setCommandeId] = useState<string | null>(null);
  const [itemsCommandes, setItemsCommandes] = useState<typeof items>([]);
  const [totalCommande, setTotalCommande] = useState(0);

  useEffect(() => {
    fetch("/api/parametres")
      .then((res) => res.json())
      .then((config) => setWhatsappBoutique(config?.whatsappNumero ?? null))
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErreur("");

    if (!nomClient || !telephone || !ville || !quartier) {
      setErreur("Merci de remplir tous les champs.");
      return;
    }
    if (items.length === 0) {
      setErreur("Votre panier est vide.");
      return;
    }

    setEnvoi(true);
    try {
      const res = await fetch("/api/commandes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nomClient,
          telephone,
          pays,
          ville,
          quartier,
          lignes: items.map((i) => ({
            produitId: i.produitId,
            taille: i.taille,
            quantite: i.quantite,
            prixUnitaire: i.prix,
          })),
        }),
      });

      if (!res.ok) throw new Error("Erreur lors de la commande");
      const nouvelleCommande = await res.json();
      setCommandeId(nouvelleCommande.id);
      setItemsCommandes(items);
      setTotalCommande(total);

      viderPanier();
      setSucces(true);
    } catch (err) {
      setErreur("Une erreur est survenue. Réessayez.");
    } finally {
      setEnvoi(false);
    }
  }

  if (succes) {
    const recapitulatif = itemsCommandes
      .map((i) => `- ${i.nom}${i.taille ? ` (${i.taille})` : ""} x${i.quantite}`)
      .join("\n");
    const messageWhatsapp = encodeURIComponent(
      `Bonjour, je viens de passer une commande sur le site.\n\nNom : ${nomClient}\nTéléphone : ${telephone}\nLocalisation : ${quartier}, ${ville}, ${pays}\n\nProduits :\n${recapitulatif}\n\nTotal : ${totalCommande.toLocaleString()} FCFA (paiement à la livraison)`
    );

    return (
      <main className="mx-auto max-w-md px-6 py-20 text-center">
        <h1 className="text-2xl font-semibold text-ink">Commande envoyée ✓</h1>
        <p className="mt-3 text-ink/50">
          Merci {nomClient} ! Nous vous contacterons au {telephone} pour organiser la livraison.
          Paiement à la livraison.
        </p>

        {whatsappBoutique && (
          <a
            href={`https://wa.me/${whatsappBoutique}?text=${messageWhatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 block rounded-lg bg-[#25D366] py-3 font-medium text-white"
          >
            Confirmer ma commande sur WhatsApp
          </a>
        )}

        <button onClick={() => router.push("/")} className="btn-primary mt-4 w-full">
          Retour à la boutique
        </button>
        {commandeId && (
          <button
            onClick={() => router.push(`/suivi/${commandeId}`)}
            className="mt-3 block w-full text-sm text-ink/50 underline"
          >
            Suivre ma commande
          </button>
        )}
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-md px-6 py-10">
      <h1 className="mb-8 text-2xl font-semibold text-ink">Finaliser la commande</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Nom complet</label>
          <input
            value={nomClient}
            onChange={(e) => setNomClient(e.target.value)}
            className="input-field"
            placeholder="Votre nom"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Numéro de téléphone</label>
          <input
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            className="input-field"
            placeholder="Ex: 90 00 00 00"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Pays</label>
          <input
            value={pays}
            onChange={(e) => setPays(e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Ville</label>
          <input
            value={ville}
            onChange={(e) => setVille(e.target.value)}
            className="input-field"
            placeholder="Ex: Cotonou"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Quartier</label>
          <input
            value={quartier}
            onChange={(e) => setQuartier(e.target.value)}
            className="input-field"
            placeholder="Ex: Fidjrossè"
          />
        </div>

        <div className="flex items-center justify-between border-t border-ink/10 pt-4 font-semibold text-ink">
          <span>Total à payer à la livraison</span>
          <span>{total.toLocaleString()} FCFA</span>
        </div>

        {erreur && <p className="text-sm text-red-500">{erreur}</p>}

        <button type="submit" disabled={envoi} className="btn-primary w-full disabled:opacity-50">
          {envoi ? "Envoi..." : "Confirmer la commande"}
        </button>
      </form>
    </main>
  );
}
