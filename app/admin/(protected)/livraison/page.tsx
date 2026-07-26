import { prisma } from "@/lib/prisma";
import { ZonesLivraisonManager } from "@/components/admin/ZonesLivraisonManager";

export const dynamic = "force-dynamic";

export default async function LivraisonPage() {
  const zones = await prisma.zoneLivraison.findMany({ orderBy: [{ ordre: "asc" }, { nom: "asc" }] });

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold">Zones de livraison</h1>
      <p className="mb-8 text-sm text-ink/50">
        Configure les zones que tes clients pourront choisir à la commande, avec des frais de livraison différents
        selon la distance.
      </p>
      <ZonesLivraisonManager zonesInitiales={zones} />
    </div>
  );
}
