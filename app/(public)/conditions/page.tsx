import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/components/shop/SiteHeader";
import { SiteFooter } from "@/components/shop/SiteFooter";

export const dynamic = "force-dynamic";

export default async function Conditions() {
  const [config, categories] = await Promise.all([
    prisma.siteConfig.findUnique({ where: { id: "main" } }),
    prisma.categorie.findMany({ orderBy: { ordre: "asc" } }),
  ]);

  return (
    <>
      <SiteHeader nom={config?.nom ?? "Ma Boutique"} logoUrl={config?.logoUrl} categories={categories} />
      <main className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="mb-6 text-2xl text-ink">Conditions de vente</h1>
        {config?.conditionsVente ? (
          <p className="whitespace-pre-line leading-relaxed text-ink/60">{config.conditionsVente}</p>
        ) : (
          <p className="text-ink/40">Cette section n'a pas encore été renseignée.</p>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
