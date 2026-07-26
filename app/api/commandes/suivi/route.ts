import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const telephone = req.nextUrl.searchParams.get("telephone");
  if (!telephone) {
    return NextResponse.json({ error: "Numéro de téléphone requis" }, { status: 400 });
  }

  const commandes = await prisma.commande.findMany({
    where: { telephone },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      statut: true,
      total: true,
      createdAt: true,
    },
  });

  return NextResponse.json(commandes);
}
