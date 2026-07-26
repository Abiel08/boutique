import { prisma } from "@/lib/prisma";
import { ProduitForm } from "@/components/admin/ProduitForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export const dynamic = "force-dynamic";

export default async function NouveauProduitPage() {
  const categories = await prisma.categorie.findMany({ orderBy: { ordre: "asc" } });

  return (
    <div>
      <AdminPageHeader title="Ajouter un produit" />
      <ProduitForm categories={categories} />
    </div>
  );
}
