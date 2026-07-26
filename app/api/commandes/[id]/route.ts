import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();
  const commande = await prisma.commande.update({
    where: { id: params.id },
    data: {
      ...(body.statut ? { statut: body.statut } : {}),
      ...(body.vueParAdmin !== undefined ? { vueParAdmin: body.vueParAdmin } : {}),
    },
  });
  return NextResponse.json(commande);
}
