import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProduitsTable } from "@/components/admin/ProduitsTable";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export const dynamic = "force-dynamic";

export default async function ProduitsAdminPage() {
  const produits = await prisma.produit.findMany({
    orderBy: { createdAt: "desc" },
    include: { categorie: true },
  });

  return (
    <div>
      <AdminPageHeader
        title="Produits"
        description={`${produits.length} produit${produits.length > 1 ? "s" : ""} au total`}
        action={
          <Link href="/admin/produits/nouveau" className="btn-primary">
            + Ajouter un produit
          </Link>
        }
      />
      <ProduitsTable produits={produits} />
    </div>
  );
}
