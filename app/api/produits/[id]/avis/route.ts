import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const avisSchema = z.object({
  nom: z.string().min(1).max(60),
  note: z.number().int().min(1).max(5),
  commentaire: z.string().max(500).optional(),
});

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const avis = await prisma.avis.findMany({
    where: { produitId: params.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(avis);
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const parsed = avisSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const avis = await prisma.avis.create({
    data: { ...parsed.data, produitId: params.id },
  });
  return NextResponse.json(avis, { status: 201 });
}
