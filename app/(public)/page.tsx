import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/components/shop/SiteHeader";
import { SiteFooter } from "@/components/shop/SiteFooter";
import { ProductFilters } from "@/components/shop/ProductFilters";
import { optimiserImage } from "@/lib/images";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [config, produits, categories] = await Promise.all([
    prisma.siteConfig.findUnique({ where: { id: "main" } }),
    prisma.produit.findMany({
      where: { publie: true },
      orderBy: { createdAt: "desc" },
      include: { categorie: true },
    }),
    prisma.categorie.findMany({ orderBy: { ordre: "asc" } }),
  ]);

  const nom = config?.nom ?? "Ma Boutique";
  const heroTitre = config?.heroTitre || "Le style, livré chez vous.";
  const heroSousTitre =
    config?.heroSousTitre ||
    "Parcours la collection, commande en quelques clics, paie à la réception. Aucune surprise.";
  const imagesAperçu = produits.filter((p) => p.images[0]).slice(0, 4);

  return (
    <>
      <SiteHeader nom={nom} logoUrl={config?.logoUrl} categories={categories} />

      <section className="relative overflow-hidden border-b border-ink/10 bg-gradient-to-br from-amber-50 via-rose-50 to-blue-50">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-14 sm:py-20 md:grid-cols-2">
          <div>
            <h1 className="max-w-lg text-3xl font-semibold leading-tight text-ink sm:text-4xl">
              {heroTitre}
            </h1>
            <p className="mt-3 max-w-md text-ink/60">{heroSousTitre}</p>
            <Link href="#collection" className="btn-primary mt-6 inline-block">
              Voir la collection
            </Link>
          </div>

          {imagesAperçu.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {imagesAperçu.map((p, i) => (
                <div
                  key={p.id}
                  className={`overflow-hidden rounded-xl shadow-lg ${i === 0 ? "translate-y-4" : ""} ${i === 3 ? "-translate-y-4" : ""}`}
                >
                  <Image
                    src={optimiserImage(p.images[0], 300)}
                    alt={p.nom}
                    width={200}
                    height={266}
                    className="aspect-[3/4] h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <main id="collection" className="mx-auto max-w-6xl px-6 py-10">
        <h2 className="mb-8 text-xl font-semibold text-ink">Nouveautés</h2>
        {produits.length === 0 ? (
          <p className="text-ink/40">Aucun produit disponible pour le moment.</p>
        ) : (
          <ProductFilters produits={produits} categories={categories} />
        )}
      </main>
      <SiteFooter />
    </>
  );
}
