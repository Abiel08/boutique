import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/components/shop/SiteHeader";
import { SiteFooter } from "@/components/shop/SiteFooter";
import { ProductFilters } from "@/components/shop/ProductFilters";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const categorie = await prisma.categorie.findUnique({ where: { slug: params.slug } });
  if (!categorie) return {};
  return {
    title: categorie.nom,
    description: `Découvre notre sélection de ${categorie.nom.toLowerCase()}. Paiement à la livraison.`,
  };
}

export default async function CategoriePage({ params }: { params: { slug: string } }) {
  const categorie = await prisma.categorie.findUnique({ where: { slug: params.slug } });
  if (!categorie) notFound();

  const [config, produits, categories] = await Promise.all([
    prisma.siteConfig.findUnique({ where: { id: "main" } }),
    prisma.produit.findMany({
      where: { publie: true, categorieId: categorie.id },
      orderBy: { createdAt: "desc" },
      include: { categorie: true },
    }),
    prisma.categorie.findMany({ orderBy: { ordre: "asc" } }),
  ]);

  return (
    <>
      <SiteHeader nom={config?.nom ?? "Ma Boutique"} logoUrl={config?.logoUrl} categories={categories} />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="mb-8 text-2xl text-ink">{categorie.nom}</h1>
        {produits.length === 0 ? (
          <p className="text-ink/40">Aucun produit dans cette catégorie pour le moment.</p>
        ) : (
          <ProductFilters produits={produits} categories={categories} categorieFixeId={categorie.id} />
        )}
      </main>
      <SiteFooter />
    </>
  );
}
