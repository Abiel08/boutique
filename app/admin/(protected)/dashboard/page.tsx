import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Bell, Package, TrendingUp, Wallet } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const debutMois = new Date();
  debutMois.setDate(1);
  debutMois.setHours(0, 0, 0, 0);

  const [
    nbCommandesNonVues,
    nbProduits,
    ventesRecentes,
    commandesLivrees,
    commandesDuMois,
    lignesTopProduits,
  ] = await Promise.all([
    prisma.commande.count({ where: { vueParAdmin: false } }),
    prisma.produit.count(),
    prisma.commande.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.commande.findMany({ where: { statut: { not: "ANNULEE" } }, select: { total: true } }),
    prisma.commande.findMany({
      where: { statut: { not: "ANNULEE" }, createdAt: { gte: debutMois } },
      select: { total: true },
    }),
    prisma.ligneCommande.groupBy({
      by: ["produitId"],
      _sum: { quantite: true },
      orderBy: { _sum: { quantite: "desc" } },
      take: 5,
    }),
  ]);

  const chiffreAffairesTotal = commandesLivrees.reduce((s, c) => s + c.total, 0);
  const chiffreAffairesMois = commandesDuMois.reduce((s, c) => s + c.total, 0);

  const produitsIds = lignesTopProduits.map((l) => l.produitId);
  const produitsInfo = await prisma.produit.findMany({ where: { id: { in: produitsIds } } });
  const topProduits = lignesTopProduits.map((l) => ({
    produit: produitsInfo.find((p) => p.id === l.produitId),
    quantiteVendue: l._sum.quantite ?? 0,
  }));

  const cartes = [
    {
      label: "Nouvelles commandes",
      valeur: nbCommandesNonVues,
      Icon: Bell,
      teinte: "bg-rose-50 text-rose-600",
      accent: nbCommandesNonVues > 0,
    },
    { label: "Produits en ligne", valeur: nbProduits, Icon: Package, teinte: "bg-blue-50 text-blue-600" },
    { label: "CA du mois", valeur: `${chiffreAffairesMois.toLocaleString()} FCFA`, Icon: TrendingUp, teinte: "bg-emerald-50 text-emerald-600" },
    { label: "CA total", valeur: `${chiffreAffairesTotal.toLocaleString()} FCFA`, Icon: Wallet, teinte: "bg-amber-50 text-amber-600" },
  ];

  return (
    <div>
      <AdminPageHeader title="Tableau de bord" description="Vue d'ensemble de ton activité" />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cartes.map((c) => (
          <div
            key={c.label}
            className={`rounded-xl border p-5 shadow-sm ${c.accent ? "border-ink/15 bg-ink text-paper" : "border-ink/10 bg-paper"}`}
          >
            <div className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${c.accent ? "bg-paper/15" : c.teinte}`}>
              <c.Icon size={18} className={c.accent ? "text-paper" : ""} />
            </div>
            <p className={`mt-3 text-sm ${c.accent ? "text-paper/70" : "text-ink/50"}`}>{c.label}</p>
            <p className="mt-1 text-2xl font-semibold">{c.valeur}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-ink/40">Dernières commandes</h2>
          <div className="space-y-2">
            {ventesRecentes.map((c) => (
              <Link
                key={c.id}
                href="/admin/commandes"
                className="flex items-center justify-between rounded-lg border border-ink/10 bg-paper px-4 py-3 shadow-sm hover:shadow-md hover:border-ink/20 transition-shadow"
              >
                <div>
                  <p className="font-medium text-ink">{c.nomClient}</p>
                  <p className="text-sm text-ink/40">{c.telephone} · {c.quartier}, {c.ville}</p>
                </div>
                <div className="flex items-center gap-3">
                  {!c.vueParAdmin && (
                    <span className="rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-600">
                      Nouveau
                    </span>
                  )}
                  <span className="font-semibold text-ink">{c.total.toLocaleString()} FCFA</span>
                </div>
              </Link>
            ))}
            {ventesRecentes.length === 0 && <p className="text-ink/40">Aucune commande pour le moment.</p>}
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-ink/40">Produits les plus vendus</h2>
          <div className="space-y-2">
            {topProduits.map((t, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-ink/10 bg-paper px-4 py-3 shadow-sm">
                <span className="font-medium text-ink">{t.produit?.nom ?? "Produit supprimé"}</span>
                <span className="text-sm text-ink/50">{t.quantiteVendue} vendus</span>
              </div>
            ))}
            {topProduits.length === 0 && <p className="text-ink/40">Pas encore assez de ventes.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
