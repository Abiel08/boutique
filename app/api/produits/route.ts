import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const produitSchema = z.object({
  nom: z.string().min(1),
  description: z.string().optional(),
  prix: z.number().int().positive(),
  images: z.array(z.string()).default([]),
  categorieId: z.string().min(1),
  tailles: z.array(z.string()).default([]),
  quantite: z.number().int().min(0),
  publie: z.boolean().default(true),
});

export async function GET() {
  const produits = await prisma.produit.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(produits);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();
  const parsed = produitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const produit = await prisma.produit.create({ data: parsed.data });
  return NextResponse.json(produit, { status: 201 });
}
