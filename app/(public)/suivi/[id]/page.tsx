import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

const statutLabels: Record<string, string> = {
  EN_ATTENTE: "En attente de confirmation",
  CONFIRMEE: "Confirmée — en préparation",
  LIVREE: "Livrée",
  ANNULEE: "Annulée",
};

const etapes = ["EN_ATTENTE", "CONFIRMEE", "LIVREE"];

export default async function SuiviDetailPage({ params }: { params: { id: string } }) {
  const commande = await prisma.commande.findUnique({
    where: { id: params.id },
    include: { lignes: { include: { produit: true } } },
  });

  if (!commande) notFound();

  const etapeActuelle = etapes.indexOf(commande.statut);

  return (
    <>
      <header className="border-b border-ink/10 px-6 py-4">
        <Link href="/suivi" className="text-sm text-ink/50">← Retour</Link>
      </header>
      <main className="mx-auto max-w-lg px-6 py-10">
        <h1 className="mb-2 text-2xl text-ink">Commande du {new Date(commande.createdAt).toLocaleDateString("fr-FR")}</h1>
        <p className="mb-8 text-ink/50">Livraison : {commande.quartier}, {commande.ville}, {commande.pays}</p>

        {commande.statut === "ANNULEE" ? (
          <p className="rounded-lg bg-red-50 px-4 py-3 font-medium text-red-600">Commande annulée</p>
        ) : (
          <div className="mb-8 flex items-center justify-between">
            {etapes.map((etape, i) => (
              <div key={etape} className="flex flex-1 flex-col items-center">
                <div
                  className={`h-3 w-3 rounded-full ${
                    i <= etapeActuelle ? "bg-ink" : "bg-ink/15"
                  }`}
                />
                <p className={`mt-2 text-center text-xs ${i <= etapeActuelle ? "font-medium" : "text-ink/40"}`}>
                  {statutLabels[etape].split(" — ")[0]}
                </p>
                {i < etapes.length - 1 && (
                  <div className={`absolute mt-1.5 h-0.5 w-full ${i < etapeActuelle ? "bg-ink" : "bg-ink/15"}`} />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="space-y-2 border-t border-ink/10 pt-4">
          {commande.lignes.map((l) => (
            <div key={l.id} className="flex justify-between text-sm text-ink/60">
              <span>{l.produit.nom} {l.taille && `(${l.taille})`} × {l.quantite}</span>
              <span>{(l.prixUnitaire * l.quantite).toLocaleString()} FCFA</span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-between border-t border-ink/10 pt-4 font-semibold">
          <span>Total (paiement à la livraison)</span>
          <span>{commande.total.toLocaleString()} FCFA</span>
        </div>
      </main>
    </>
  );
}
