import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function echapperCsv(valeur: string | number): string {
  const texte = String(valeur);
  if (texte.includes(";") || texte.includes('"') || texte.includes("\n")) {
    return `"${texte.replace(/"/g, '""')}"`;
  }
  return texte;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const commandes = await prisma.commande.findMany({
    orderBy: { createdAt: "desc" },
    include: { lignes: { include: { produit: true } } },
  });

  const entetes = [
    "Date",
    "Client",
    "Téléphone",
    "Pays",
    "Ville",
    "Quartier",
    "Produits",
    "Statut",
    "Total (FCFA)",
  ];

  const lignesCsv = commandes.map((c) => {
    const produits = c.lignes
      .map((l) => `${l.produit.nom}${l.taille ? ` (${l.taille})` : ""} x${l.quantite}`)
      .join(" | ");

    return [
      new Date(c.createdAt).toLocaleString("fr-FR"),
      c.nomClient,
      c.telephone,
      c.pays,
      c.ville,
      c.quartier,
      produits,
      c.statut,
      c.total,
    ]
      .map(echapperCsv)
      .join(";");
  });

  const csv = "\uFEFF" + [entetes.join(";"), ...lignesCsv].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="commandes-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
