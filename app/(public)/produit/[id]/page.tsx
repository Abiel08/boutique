import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/components/shop/SiteHeader";
import { SiteFooter } from "@/components/shop/SiteFooter";
import { AjouterAuPanierForm } from "@/components/shop/AjouterAuPanierForm";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { AvisSection } from "@/components/shop/AvisSection";
import { notFound } from "next/navigation";
import { SEUIL_STOCK_FAIBLE } from "@/lib/categories";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const produit = await prisma.produit.findUnique({ where: { id: params.id } });
  if (!produit) return {};

  const description = produit.description
    ? produit.description.slice(0, 155)
    : `${produit.nom} — ${produit.prix.toLocaleString()} FCFA. Paiement à la livraison.`;

  return {
    title: produit.nom,
    description,
    openGraph: {
      title: produit.nom,
      description,
      images: produit.images[0] ? [produit.images[0]] : [],
    },
  };
}

export default async function ProduitPage({ params }: { params: { id: string } }) {
  const [config, produit, categories] = await Promise.all([
    prisma.siteConfig.findUnique({ where: { id: "main" } }),
    prisma.produit.findUnique({
      where: { id: params.id },
      include: { avis: { orderBy: { createdAt: "desc" } }, categorie: true },
    }),
    prisma.categorie.findMany({ orderBy: { ordre: "asc" } }),
  ]);

  if (!produit || !produit.publie) notFound();

  const stockFaible = produit.quantite > 0 && produit.quantite <= SEUIL_STOCK_FAIBLE;

  return (
    <>
      <SiteHeader nom={config?.nom ?? "Ma Boutique"} logoUrl={config?.logoUrl} categories={categories} />
      <main className="mx-auto grid max-w-5xl gap-10 px-6 py-10 md:grid-cols-2">
        <ProductGallery images={produit.images} nom={produit.nom} />

        <div>
          <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium uppercase tracking-wide ${produit.categorie.couleur}`}>{produit.categorie.nom}</span>
          <h1 className="mt-2 text-2xl font-semibold text-ink">{produit.nom}</h1>
          <p className="mt-2 text-xl font-semibold text-ink">{produit.prix.toLocaleString()} FCFA</p>
          {stockFaible && (
            <p className="mt-2 inline-block rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
              Dernières pièces — plus que {produit.quantite} en stock
            </p>
          )}
          {produit.description && (
            <p className="mt-4 leading-relaxed text-ink/60">{produit.description}</p>
          )}

          <AjouterAuPanierForm
            produitId={produit.id}
            nom={produit.nom}
            prix={produit.prix}
            image={produit.images[0]}
            tailles={produit.tailles}
            stockDisponible={produit.quantite}
          />

          <p className="mt-4 text-sm text-ink/40">Paiement à la livraison</p>
        </div>
      </main>
      <div className="mx-auto max-w-5xl px-6">
        <AvisSection produitId={produit.id} avisInitiaux={JSON.parse(JSON.stringify(produit.avis))} />
      </div>
      <SiteFooter />
    </>
  );
}
