import { prisma } from "@/lib/prisma";
import { ProduitForm } from "@/components/admin/ProduitForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function EditProduitPage({ params }: { params: { id: string } }) {
  const [produit, categories] = await Promise.all([
    prisma.produit.findUnique({ where: { id: params.id } }),
    prisma.categorie.findMany({ orderBy: { ordre: "asc" } }),
  ]);
  if (!produit) notFound();

  return (
    <div>
      <AdminPageHeader
        title="Modifier le produit"
        action={
          produit.publie ? (
            <a
              href={`/produit/${produit.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary inline-flex items-center gap-2"
            >
              <ExternalLink size={16} />
              Voir le produit
            </a>
          ) : (
            <p className="text-sm text-ink/40">Produit masqué — publie-le pour pouvoir le voir sur le site</p>
          )
        }
      />
      <ProduitForm
        categories={categories}
        initialData={{
          id: produit.id,
          nom: produit.nom,
          description: produit.description ?? "",
          prix: produit.prix,
          images: produit.images,
          categorieId: produit.categorieId,
          tailles: produit.tailles,
          quantite: produit.quantite,
          publie: produit.publie,
        }}
      />
    </div>
  );
}
