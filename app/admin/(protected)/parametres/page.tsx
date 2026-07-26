import { prisma } from "@/lib/prisma";
import { ParametresForm } from "@/components/admin/ParametresForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export const dynamic = "force-dynamic";

export default async function ParametresPage() {
  let config = await prisma.siteConfig.findUnique({ where: { id: "main" } });
  if (!config) {
    config = await prisma.siteConfig.create({ data: { id: "main" } });
  }

  return (
    <div>
      <AdminPageHeader title="Paramètres du site" description="Apparence, contact et pages informatives" />
      <ParametresForm
        initialData={{
          nom: config.nom,
          logoUrl: config.logoUrl ?? "",
          description: config.description ?? "",
          whatsappNumero: config.whatsappNumero ?? "",
          aPropos: config.aPropos ?? "",
          conditionsVente: config.conditionsVente ?? "",
          heroTitre: config.heroTitre ?? "Le style, livré chez vous.",
          heroSousTitre:
            config.heroSousTitre ??
            "Parcours la collection, commande en quelques clics, paie à la réception. Aucune surprise.",
        }}
      />
    </div>
  );
}
