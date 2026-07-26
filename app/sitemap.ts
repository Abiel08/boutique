import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXTAUTH_URL || "http://localhost:3000";

  const [produits, categories] = await Promise.all([
    prisma.produit.findMany({
      where: { publie: true },
      select: { id: true, updatedAt: true },
    }),
    prisma.categorie.findMany(),
  ]);

  const pagesStatiques: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: `${base}/a-propos`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/conditions`, changeFrequency: "monthly", priority: 0.5 },
    ...categories.map((c) => ({
      url: `${base}/categorie/${c.slug}`,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
  ];

  const pagesProduits: MetadataRoute.Sitemap = produits.map((p) => ({
    url: `${base}/produit/${p.id}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...pagesStatiques, ...pagesProduits];
}
