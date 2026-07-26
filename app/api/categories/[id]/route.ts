import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const nbProduits = await prisma.produit.count({ where: { categorieId: params.id } });
  if (nbProduits > 0) {
    return NextResponse.json(
      {
        error: `Impossible de supprimer : ${nbProduits} produit${nbProduits > 1 ? "s utilisent" : " utilise"} encore cette catégorie. Déplace-les ou supprime-les d'abord.`,
      },
      { status: 409 }
    );
  }

  await prisma.categorie.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
