import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notifierNouvelleCommande } from "@/lib/notifications";
import { z } from "zod";

const commandeSchema = z.object({
  nomClient: z.string().min(1),
  telephone: z.string().min(6),
  pays: z.string().min(1),
  ville: z.string().min(1),
  quartier: z.string().min(1),
  lignes: z
    .array(
      z.object({
        produitId: z.string(),
        taille: z.string().optional(),
        quantite: z.number().int().positive(),
        prixUnitaire: z.number().int().positive(),
      })
    )
    .min(1),
});

// Le client passe une commande - pas d'authentification requise
export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = commandeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { nomClient, telephone, pays, ville, quartier, lignes } = parsed.data;
  const total = lignes.reduce((s, l) => s + l.prixUnitaire * l.quantite, 0);

  const commande = await prisma.$transaction(async (tx) => {
    const nouvelleCommande = await tx.commande.create({
      data: {
        nomClient,
        telephone,
        pays,
        ville,
        quartier,
        total,
        lignes: {
          create: lignes.map((l) => ({
            produitId: l.produitId,
            taille: l.taille,
            quantite: l.quantite,
            prixUnitaire: l.prixUnitaire,
          })),
        },
      },
    });

    // Décrémenter le stock de chaque produit commandé
    for (const ligne of lignes) {
      await tx.produit.update({
        where: { id: ligne.produitId },
        data: { quantite: { decrement: ligne.quantite } },
      });
    }

    return nouvelleCommande;
  });

  // Notifier l'admin par email (non bloquant pour la réponse au client)
  notifierNouvelleCommande({
    commandeId: commande.id,
    nomClient,
    telephone,
    localisation: `${quartier}, ${ville}, ${pays}`,
    total,
  });

  return NextResponse.json(commande, { status: 201 });
}

// Liste des commandes - réservé à l'admin
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const commandes = await prisma.commande.findMany({
    orderBy: { createdAt: "desc" },
    include: { lignes: { include: { produit: true } } },
  });
  return NextResponse.json(commandes);
}
