import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PALETTE_CATEGORIES, slugifier } from "@/lib/categories";
import { z } from "zod";

const categorieSchema = z.object({
  nom: z.string().min(1).max(40),
});

export async function GET() {
  const categories = await prisma.categorie.findMany({ orderBy: { ordre: "asc" } });
  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();
  const parsed = categorieSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const slugBase = slugifier(parsed.data.nom);
  let slug = slugBase;
  let compteur = 1;
  while (await prisma.categorie.findUnique({ where: { slug } })) {
    slug = `${slugBase}-${compteur++}`;
  }

  const nbExistantes = await prisma.categorie.count();
  const couleur = PALETTE_CATEGORIES[nbExistantes % PALETTE_CATEGORIES.length];

  const categorie = await prisma.categorie.create({
    data: { nom: parsed.data.nom, slug, couleur, ordre: nbExistantes },
  });

  return NextResponse.json(categorie, { status: 201 });
}
